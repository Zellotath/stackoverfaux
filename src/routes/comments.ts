import { Request, Router } from 'express';
import { prisma } from '../database/databaseClient';
import { authorizeFor, PermissionType } from '../middleware/authorize';
import { getLogger } from '../logging/applicationLogger';

type CommentRequestParams = { questionId: string; answerId?: string };

export const commentsRouter = Router({ mergeParams: true });

commentsRouter.get('/comments', async (req: Request<CommentRequestParams>, res) => {
  const commentsQuery = req.params.answerId
    ? { parentAnswerId: Number(req.params.answerId) }
    : { parentQuestionId: Number(req.params.questionId) };

  const comments = await prisma.comment.findMany({
    where: commentsQuery,
    include: { user: true }
  });
  res.json(comments);
});

commentsRouter.delete('/comments/:id', authorizeFor(PermissionType.DeleteComment), async (req, res) => {
  const commentId = Number(req.params.id);

  // Note: This is currently a hard delete. In the future, this should be a soft delete that blanks out the content but leaves the record.
  await prisma.comment.delete({ where: { id: commentId } });
  res.sendStatus(204);
});
