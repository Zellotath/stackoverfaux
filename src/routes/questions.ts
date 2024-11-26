import { Router } from 'express';
import { NotFoundError } from '../common/errors/NotFoundError';
import { prisma } from '../database/databaseClient';
import { authorizeFor, PermissionType } from '../middleware/authorize';
import { answersRouter } from './answers';
import { includeComments } from './routeUtilities';
import { commentsRouter } from './comments';

export const questionsRouter = Router();

questionsRouter.get('/questions/:id', async (req, res) => {
  const questionId = Number(req.params.id);
  const question = await prisma.question.findFirst({
    where: { id: questionId },
    include: { user: true, comments: includeComments(req) }
  });
  if (!question) {
    throw new NotFoundError();
  }
  res.json(question);
});

questionsRouter.post('/questions', authorizeFor(PermissionType.CreateQuestion), async (req, res) => {
  const { userId, body, title } = req.body;
  const question = await prisma.question.create({
    data: { userId, title, body, score: 0 }
  });

  res.json(question);
});

questionsRouter.delete('/questions/:id', authorizeFor(PermissionType.DeleteQuestion), async (req, res) => {
  const questionId = Number(req.params.id);
  // Note: This is currently a hard delete. In the future, this should be a soft delete that blanks out the content but leaves the record.
  await prisma.question.delete({ where: { id: questionId } });
  res.sendStatus(204);
});

questionsRouter.use('/questions/:questionId', answersRouter);
questionsRouter.use('/questions/:questionId', commentsRouter);
