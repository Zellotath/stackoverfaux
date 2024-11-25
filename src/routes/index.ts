import { Router } from 'express';

export const router = Router();

router.get('/health', (req, res) => {
  res.send('Application server running');
});
