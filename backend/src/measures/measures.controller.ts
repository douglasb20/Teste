import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Req } from '@nestjs/common';
import { MeasuresService } from './measures.service';
import { CreateMeasureDto } from './dto/create-measure.dto';
import { Request } from 'express';
import { ConfirmMeasureDto } from './dto/confirm-measure.dto';

@Controller()
export class MeasuresController {
  constructor(private readonly measuresService: MeasuresService) { }
  

  // Endpoint pada fazer upload da leitura.
  @Post('upload')
  @HttpCode(HttpStatus.OK)
  async uplodad(
    @Body() createMeasureDto: CreateMeasureDto,
    @Req() req: Request
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return this.measuresService.createMeasure(createMeasureDto, baseUrl);
  }

  // Endpoint pada fazer confirmação da leitura.
  @Patch('confirm')
  @HttpCode(HttpStatus.OK)
  async confirmMeasure(
    @Body() confirmMeasureDto: ConfirmMeasureDto,
  ) {
    return this.measuresService.confirmMeasure(confirmMeasureDto);
  }
}
