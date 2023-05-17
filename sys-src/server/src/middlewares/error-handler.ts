import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../errors/base-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof BaseError) {
    return res.status(err.getStatusCode()).send(err.serializeErrors());
  }

  // reaches it only if error is not known
  return res.status(500).send({
    errors: [
      {
        error_spec: {
          name: 'INTERNAL_SERVER_ERROR',
          message: err.message,
          log_level: 'ERROR',
          http_status_codes: [500],
          suggested_application_actions: ['Please check logs'],
        },
      },
    ],
  });
};
