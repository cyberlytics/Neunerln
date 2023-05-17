import { BaseError } from './base-error';

export class BadRequestError extends BaseError {
  private statusCode = 400;

  constructor(
    public message: string,
    private suggestedApplicationActions: string[]
  ) {
    super();

    Object.setPrototypeOf(this, BadRequestError.prototype);
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
            suggested_application_actions: this.suggestedApplicationActions,
          },
        },
      ],
    };
  }
}
