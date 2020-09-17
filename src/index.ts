import express from 'express';
import { rateLimiterMiddleware } from './Middleware';
import { init } from './MemoryStore';
import { runRateLimitCheck } from './RateQuotaHandler';
import { getUtcDateNow } from './DateUtil';
import Logger from './Logger';

const app = express();
const memoryStore = init();
const port = 5000;
const oneHour = 3600000;
const rateLimiterConfig = {
  limit: 2,
  ttl: oneHour,
};

app.use(
  rateLimiterMiddleware(
    runRateLimitCheck(memoryStore, rateLimiterConfig, getUtcDateNow),
  ),
);

app.get('/test', (_req, res) => res.send('Hello World!'));

app.listen(port, () =>
  Logger.info(
    `Server with rate limiting listening at http://localhost:${port}`,
  ),
);
