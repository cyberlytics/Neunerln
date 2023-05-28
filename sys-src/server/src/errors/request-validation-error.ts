import { ValidationError } from 'express-validator'
import { ErrorSpecs } from '../types/errors'
import { BaseError } from './base-error'

export class RequestValidationError extends BaseError {
  errors: ErrorSpecs

  constructor(errs: ValidationError[]) {
    super()

    Object.setPrototypeOf(this, RequestValidationError.prototype)

    this.errors = errs.map((err: any) => {
      return {
        error_spec: {
          name: 'BAD_REQUEST',
          message: err.msg,
          log_level: 'Error',
          http_status_codes: [400],
          suggested_application_actions: [`Check field: ${err.param}`]
        }
      }
    })
  }

  getStatusCode() {
    return 400
  }

  serializeErrors() {
    return {
      errors: this.errors
    }
  }
}
