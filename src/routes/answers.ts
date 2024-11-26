import { Request, Response, Router } from 'express';
import { prisma } from '../database/databaseClient';
import { NotFoundError } from '../common/errors/NotFoundError';
import { includeComments } from './routeUtilities';
import { Answer, Prisma } from '@prisma/client';
import { authorizeFor, PermissionType } from '../middleware/authorize';

export const answersRouter = Router();

answersRouter.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const answerId: number = Number(req.params.answerId);
  const questionId = Number(req.params.questionId);

  const answer = await prisma.answer.findFirst({
    where: { id: answerId, questionId },
    include: { user: true, comments: includeComments(req) }
  });
  if (!answer) {
    throw new NotFoundError();
  }

  res.json(answer);
});

answersRouter.post('/questions/:id/answers', authorizeFor(PermissionType.CreateAnswer), async (req, res) => {
  const questionId = Number(req.params.id);
  // Note: For now the userId comes from the request body. In the future, this will come from the request with the requesting user's ID
  const { userId, body } = req.body;

  const answer = await prisma.answer.create({
    data: { userId, questionId, body, score: 0, accepted: false }
  });

  res.json(answer);
});

answersRouter.put(
  '/questions/:questionId/answers/:answerId/accept',
  authorizeFor(PermissionType.EditAnswer),
  async (req, res) => {
    await updateAnswer(req, { accepted: true });
    res.sendStatus(204);
  }
);

answersRouter.delete(
  '/questions/:questionId/answers/:answerId/accept',
  authorizeFor(PermissionType.EditAnswer),
  async (req, res) => {
    await updateAnswer(req, { accepted: false });
    res.sendStatus(204);
  }
);

answersRouter.delete(
  '/questions/:questionId/answers/:answerId',
  authorizeFor(PermissionType.DeleteAnswer),
  async (req, res) => {
    // Note: This is currently a hard delete. In the future, this should be a soft delete that blanks out the content but leaves the record.
    const answerId = Number(req.params.answerId);
    const questionId = Number(req.params.questionId);
    const question = await prisma.question.findFirst({ where: { id: questionId } });
    if (!question) {
      throw new NotFoundError();
    }

    await prisma.answer.delete({ where: { id: answerId, questionId } });
    res.sendStatus(204);
  }
);

// Note: This is a PUT because the plan is to have one vote per user, so putting mutiple times won't change the score
answersRouter.put(
  '/questions/:questionId/answers/:answerId/vote',
  authorizeFor(PermissionType.Vote),
  async (req, res) => {
    const direction = req.body.direction;
    const answer = await updateAnswer(req, { score: direction === 'up' ? { increment: 1 } : { decrement: 1 } });
    res.json(answer);
  }
);

async function updateAnswer(req: Request, updates: Prisma.AnswerUpdateArgs['data']): Promise<Answer> {
  const answerId = Number(req.params.answerId);
  const questionId = Number(req.params.questionId);
  const question = await prisma.question.findFirst({ where: { id: questionId } });
  if (!question) {
    throw new NotFoundError();
  }

  return await prisma.answer.update({
    where: { id: answerId, questionId },
    data: updates
  });
}
