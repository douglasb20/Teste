import { IsBase64, IsIn, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class ConfirmMeasureDto {
  @IsNotEmpty({ message: ({ property }) => `Campo ${property} obrigatório` })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: ({ property }) => `Campo ${property} só aceita número` },
  )
  confirmed_value: number;

  @IsNotEmpty({ message: ({ property }) => `Campo ${property} obrigatório` })
  @IsUUID(4, { message: ({ property }) => `UUID do ${property} incorreta` })
  measure_uuid: string;
}
