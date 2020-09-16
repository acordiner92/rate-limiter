import express from 'express';
import { rateLimiterMiddleware } from './Middleware';
import { init } from './MemoryStore';
import { getHasRateLimitExceeded } from './RateQuotaHandler';

const app = express();
const port = 5000;
const oneHour = 3600000;

const memoryStore = init();

const rateLimiterConfig = {
  requestLimit: 100,
  duration: oneHour,
};

const getHasRateLimitExceededFn = getHasRateLimitExceeded(
  memoryStore,
  rateLimiterConfig,
);

app.use(rateLimiterMiddleware(getHasRateLimitExceededFn));

app.get('/test', (_req, res) => res.send('Hello World!'));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`),
);
