import express from 'express';
import { rateLimiterMiddleware } from './Middleware';
import { init } from './MemoryStore';
import { getHasRateLimitExceeded } from './RateQuotaHandler';
import { getUtcDateNow } from './DateUtil';

const app = express();
const port = 5000;
const oneHour = 3600000;

const memoryStore = init();

const rateLimiterConfig = {
  requestLimit: 100,
  duration: oneHour,
};

app.use(
  rateLimiterMiddleware(
    getHasRateLimitExceeded(memoryStore, rateLimiterConfig, getUtcDateNow),
  ),
);

app.get('/test', (_req, res) => res.send('Hello World!'));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`),
);
