import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Between, DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidV4 } from 'uuid';
import { startOfMonth, endOfMonth, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import * as fs from 'fs'
import * as path from 'path';

import { Measures } from './entities/measures-entity';
import { ConfirmMeasureDto } from './dto/confirm-measure.dto';
import { CreateMeasureDto } from './dto/create-measure.dto';
import { ErrorBadRequest } from 'CustomErrors/ErrorBadRequest';
import { ErrorNotFound } from 'CustomErrors/ErrorNotFound';
import { ErrorConflict } from 'CustomErrors/ErrorConflict';
import { GeminiResponse } from 'Interfaces';

@Injectable()
export class MeasuresService {
  private query: QueryRunner;
  private destPath = path.join(__dirname, '..', '..', '..', 'files', 'images').replaceAll("\\", '/');
  constructor(
    @InjectRepository(Measures)
    private measureRepository: Repository<Measures>,
    private dataSource: DataSource,
    private configService: ConfigService
  ) {
    this.query = this.dataSource.createQueryRunner();
  }

  async createMeasure(createMeasureDto: CreateMeasureDto, baseUrl: string) {

    // Gero o UUID da leitura para ser usado no banco e na imagem.
    const measure_uuid = uuidV4();
    try {
      await this.query.startTransaction();

      // Método para verificar se já existe leitura naquele mês,
      // e por tipo de leitura.
      const measures = await this.checkReadMonth(createMeasureDto);
      if (measures.length > 0) {
        throw new ErrorConflict('DOUBLE_REPORT', 'Leitura do mês já realizada');
      }

      // Peço para a LLM fazer a leitura do registro.
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.configService.get('GEMINI_API_KEY')}`, {
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Please, get the full value integer from the image, only value."
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: createMeasureDto.image
                  }
                }
              ]
            }
          ]
        }),
        method: 'POST'
      })

      // Verifico se a requisição ocorreu tudo certo.
      if (!resp.ok) {
        // Jogo uma exception caso der erro na requisição.
        throw new ErrorBadRequest('ERROR_REQUEST', 'Erro na requisição com o LLM');
      }

      // Capturo os dados da requisição e converto em JSON.
      const data = await resp.json() as GeminiResponse;

      // Pego o valor capturado pelo LLM.
      const measure_value = data?.candidates?.[0].content?.parts?.[0].text;
      if(isNaN(Number(measure_value))){
        // Se o valor vindo do LLM não for um número, jogo um erro de valor errado.
        throw new ErrorBadRequest('INCORRECT_VALUE', 'Valor obtido do LLM incorreto');
      }

      // Crio a imagem no na memória do sistema e retorno o path da imagem.
      const imageName = this.resolveImage(createMeasureDto, measure_uuid);

      // Preparo os dados para ser salvos no banco de dados.
      const newMeasure = this.measureRepository.create({
        image_url: imageName,
        measure_value: Number(measure_value),
        customer_id: Number(createMeasureDto.customer_code),
        measure_type: createMeasureDto.measure_type,
        measure_datetime: createMeasureDto.measure_datetime,
        measure_uuid
      });
      
      // Salvo os dados no banco de dados.
      await this.query.manager.save(Measures, newMeasure);
      await this.query.commitTransaction();

      return {
        image_url: `${baseUrl}/images/${imageName}`,
        measure_value: Number(measure_value),
        measure_uuid
      };
    } catch (err) {
      await this.query.rollbackTransaction();
      this.resolveImage(createMeasureDto, measure_uuid, true);
      throw err;
    }
  }

  async confirmMeasure(confirmMeasureDto: ConfirmMeasureDto) {
    try {
      await this.query.startTransaction();

      // Localizo a leitura do registro pelo uuid.
      const measure = await this.measureRepository.findOneBy({
        measure_uuid: confirmMeasureDto.measure_uuid
      });

      if (!measure) {
        // Caso não encontrado, jogo uma exception de não localizado.
        throw new ErrorNotFound('MEASURE_NOT_FOUND', 'Leitura do mês não encontrada');
      }
      if (measure.has_confirmed) {
        // Caso a leitura já tenha sido confirmada antes, jogo uma exception de duplicate.
        throw new ErrorConflict('CONFIRMATION_DUPLICATE', 'Leitura do mês já realizada');
      }

      // Preparo os dados para salvar no banco de dados.
      const confirmMeasure = this.measureRepository.create({
        ...measure,
        has_confirmed: 1,
        measure_value: Number(confirmMeasureDto.confirmed_value)
      });

      // Atualizo os dados no banco de dados.
      await this.query.manager.save(Measures, confirmMeasure);
      
      await this.query.commitTransaction();
      return {
        success: true
      }
    } catch (err) {
      await this.query.startTransaction();
      throw err;
    }
  }

  async checkReadMonth(createMeasureDto: CreateMeasureDto): Promise<Measures[]> {

    // Transformo o formato da data recebido em Date;
    const measure_datetime = parse(createMeasureDto.measure_datetime, 'yyyy-MM-dd HH:mm:ss', new Date(), { locale: ptBR });
    // Forço essa data recebida para ir para o primeiro dia do mês da qual foi informado
    const startMonth = startOfMonth(measure_datetime);
    // Forço essa data recebida para ir para o último dia do mês da qual foi informado
    const endMonth = endOfMonth(measure_datetime);

    // Faço a pesquisa da leitura com os dados informados
    const measure = await this.measureRepository.findBy({
      customer_id: createMeasureDto.customer_code,
      measure_datetime: Between(startMonth, endMonth),
      measure_type: createMeasureDto.measure_type
    });

    // Devolvo resultado
    return measure;
  }

  resolveImage(createMeasureDto: CreateMeasureDto, measure_uuid: string, remove = false) {

    // crio o nome do arquivo recebido em base64.
    const imageName = `meter_${measure_uuid}.jpg`;

    // Converto Base64 em buffer.
    const imageBuffer = Buffer.from(createMeasureDto.image.replace(/^data:\w+\/[\w-]+;base64,/g, ''), 'base64');

    // Caso for uma chamada para remover imagem, verifico primeiro se ela existe.
    if (remove && fs.existsSync(path.join(this.destPath, imageName))) {
      // Caso a a imagem existir, excluo ela do sistema.
      fs.promises.unlink(path.join(this.destPath, imageName));
      return;
    }

    if (!remove) {
      // Caso não for uma chamada de remoção, eu crio a imagem.
      fs.promises.writeFile(
        path.join(this.destPath, imageName),
        imageBuffer
      );
    }

    // Retorno o nome do arquivo.
    return imageName;
  }
}
