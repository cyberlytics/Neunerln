import { BaseError } from './base-error';

export class DatabaseError extends BaseError {
  private statusCode = 500;

  constructor(public message: string) {
    super();
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  getStatusCode() {
    return this.statusCode;
  }

  serializeErrors() {
    return {
      errors: [
        {
          error_spec: {
            name: 'BAD_REQUEST',
            message: this.message,
            log_level: 'Error',
            http_status_codes: [this.statusCode],
            suggested_application_actions: [`Check database connection.`],
          },
        },
      ],
    };
  }
}
