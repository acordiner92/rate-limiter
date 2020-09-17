import express from 'express';
import { rateLimiterMiddleware } from './Middleware';
import { init } from './MemoryStore';
import { runRateLimitCheck } from './RateQuotaHandler';
import { getUtcDateNow } from './DateUtil';

const app = express();
const memoryStore = init();
const port = 5000;
const oneHour = 3600000;
const rateLimiterConfig = {
  limit: 100,
  ttl: oneHour,
};

app.use(
  rateLimiterMiddleware(
    runRateLimitCheck(memoryStore, rateLimiterConfig, getUtcDateNow),
  ),
);

app.get('/test', (_req, res) => res.send('Hello World!'));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`),
);
