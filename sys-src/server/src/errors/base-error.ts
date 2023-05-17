import { SerializeErrors } from '../types/errors';

export abstract class BaseError extends Error {
  constructor() {
    super();

    Object.setPrototypeOf(this, BaseError.prototype);
  }

  // extracts the status code from the error
  abstract getStatusCode(): number;

  // return formated error
  abstract serializeErrors(): SerializeErrors;
}
