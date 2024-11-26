import { Request } from 'express';

export function includeComments(req: Request): boolean {
  return req.query.includeComments?.toString().toLocaleLowerCase() === 'true';
}
