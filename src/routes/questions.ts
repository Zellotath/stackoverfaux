import { Request, Router } from 'express';
import { prisma } from '../database/databaseClient';
import { NotFoundError } from '../common/errors/NotFoundError';
import { includeComments } from './routeUtilities';
import { authorizeFor, PermissionType } from '../middleware/authorize';

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

questionsRouter.get('/questions/:id/answers', async (req, res) => {
  const questionId = Number(req.params.id);
  const answers = await prisma.answer.findMany({
    where: { questionId },
    include: { user: true, comments: includeComments(req) }
  });
  res.json(answers);
});

questionsRouter.post('/questions', authorizeFor(PermissionType.CreateQuestion), async (req, res) => {
  const { userId, body, title } = req.body;
  const question = await prisma.question.create({
    data: { userId, title, body, score: 0 }
  });

  res.json(question);
});
