import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorBadRequest extends HttpException {
  constructor(error_type: string, error_description: string ) {
    const response = {
      error_code: error_type,
      error_description: error_description,
    };
    super(response, HttpStatus.BAD_REQUEST); // Você pode usar outro status conforme necessário
  }
}