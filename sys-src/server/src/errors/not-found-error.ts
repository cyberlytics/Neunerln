import { BaseError } from './base-error';

export class NotFoundError extends BaseError {
  private statusCode = 404;

  constructor() {
    super();

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  getStatusCode() {
    return this.statusCode;
  }

  serializeErrors() {
    return {
      errors: [
        {
          error_spec: {
            name: 'NOT_FOUND',
            message: 'Route not found',
            log_level: 'Error',
            http_status_codes: [this.statusCode],
            suggested_application_actions: ['Check or change the request url.'],
          },
        },
      ],
    };
  }
}
