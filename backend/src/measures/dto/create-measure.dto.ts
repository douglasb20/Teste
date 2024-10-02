import { IsBase64, IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateMeasureDto {
  @IsNotEmpty({ message: ({ property }) => `Campo ${property} obrigatório` })
  @IsBase64(null, { message: ({ property }) => `Campo ${property} só aceita BASE64` })
  image: string;

  @IsNotEmpty({ message: ({ property }) => `Campo ${property} obrigatório` })
  @IsString({ message: ({ property }) => `Campo ${property} só aceita string` })
  customer_code: number;

  @IsNotEmpty({ message: ({ property }) => `Campo ${property} obrigatório` })
  @IsString({ message: ({ property }) => `Campo ${property} só aceita string` })
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
    message: ({ property }) => `Campo ${property} deve estar no formato yyyy-MM-dd HH:mm:ss`,
  })
  measure_datetime: string;

  @IsNotEmpty({ message: ({ property }) => `Campo ${property} obrigatório` })
  @IsIn(['WATER', 'GAS'], { message: 'Campo só aceita valores como WATER ou GAS' })
  measure_type: 'WATER' | 'GAS';
}
