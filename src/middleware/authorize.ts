import { NextFunction, Request, Response } from 'express';

export enum PermissionType {
  CreateAnswer = 'answer.create',
  EditAnswer = 'answer.edit',
  DeleteAnswer = 'answer.delete',
  CreateQuestion = 'question.create',
  EditQuestion = 'question.edit',
  DeleteQuestion = 'question.delete',
  CreateComment = 'comment.create',
  EditComment = 'comment.edit',
  DeleteComment = 'comment.delete',
  Vote = 'vote'
}

export function authorizeFor(permission: PermissionType) {
  return (req: Request, res: Response, next: NextFunction) => {
    /*
     * Note: For now this just allows all requests. In a real implementation, this would probably take a permission instance
     * (which could contain info about the request like the resource ID or be a function) and check if the user has the permission to act upon
     * that resource.
     */
    next();
  };
}
