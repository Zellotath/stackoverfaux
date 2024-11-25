import { NextFunction, Request, Response } from 'express';
import { AuthorizationError } from '../common/errors/AuthorizationError';
import { UnauthorizedError } from '../common/errors/UnauthorizedError';
import { NotFoundError } from '../common/errors/NotFoundError';

export async function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof UnauthorizedError) {
    res.sendStatus(401);
  } else if (err instanceof AuthorizationError) {
    res.sendStatus(403);
  } else if (err instanceof NotFoundError) {
    res.sendStatus(404);
  } else {
    res.sendStatus(500);
  }
}
