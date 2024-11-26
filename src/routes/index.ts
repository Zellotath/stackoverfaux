import { Router } from 'express';
import { questionsRouter } from './questions';
import { answersRouter } from './answers';
import { commentsRouter } from './comments';

export const router = Router();

router.get('/health', (req, res) => {
  res.send('Application server running');
});

router.use(questionsRouter);
