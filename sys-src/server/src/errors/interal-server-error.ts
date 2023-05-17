import { BaseError } from './base-error';

export class InternalServerError extends BaseError {
  private statusCode = 500;

  constructor(public message: string) {
    super();

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  getStatusCode() {
    return this.statusCode;
  }

  serializeErrors() {
    return {
      errors: [
        {
          error_spec: {
            name: 'INTERNAL_SERVER_ERROR',
            message: this.message,
            log_level: 'ERROR',
            http_status_codes: [this.statusCode],
            suggested_application_actions: ['Please check logs.'],
          },
        },
      ],
    };
  }
}
