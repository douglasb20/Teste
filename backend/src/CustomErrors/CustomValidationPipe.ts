import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors: ValidationError[] = await validate(object);
    
    if (errors.length > 0) {
      const messages = errors.map(err => Object.values(err.constraints)).flat();
      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description: messages,
      });
    }

    return value;
  }

  private toValidate(metatype: any) {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}