import express from 'express';
import { rateLimiterMiddleware } from './Middleware';
import { init } from './MemoryStore';
import { getHasRateLimitExceeded } from './RateLimiter';

const app = express();
const port = 5000;

const memoryStore = init();

const rateLimiterConfig = {
  requestLimit: 1,
  duration: 60,
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
