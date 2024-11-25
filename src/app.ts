import 'dotenv/config';
import express from 'express';
import { router } from './routes';
import { getLogger } from './logging/applicationLogger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());
app.use(router);
app.use(errorHandler);

app.listen(process.env.APPLICATION_PORT, () => {
  getLogger().info(`Stack Overfaux is running on port ${process.env.APPLICATION_PORT}`);
});
