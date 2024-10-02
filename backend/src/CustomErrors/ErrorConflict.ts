import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorConflict extends HttpException {
  constructor(error_type: string, error_description: string) {
    const response = {
      error_code: error_type,
      error_description: error_description,
    };
    super(response, HttpStatus.CONFLICT); // Você pode usar outro status conforme necessário
  }
}
