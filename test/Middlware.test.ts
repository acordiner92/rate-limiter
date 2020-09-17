import request from 'supertest';
import express, { Express } from 'express';
import { rateLimiterMiddleware } from '../src/Middleware';
import { runRateLimitCheck } from '../src/RateQuotaHandler';
import { init } from '../src/MemoryStore';
import { getUtcDateNow } from '../src/DateUtil';

const getTestServer = (): Express => {
  const oneHour = 3600000;
  const app = express();
  const memoryStore = init();

  const rateLimiterConfig = {
    limit: 1,
    ttl: oneHour,
  };
  app.use(
    rateLimiterMiddleware(
      runRateLimitCheck(memoryStore, rateLimiterConfig, getUtcDateNow),
    ),
  );
  app.get('/test', (_req, res) => res.send('Hello World!'));
  return app;
};

describe('rateLimiterMiddleware', () => {
  test('next middleware is called if rate quota limit has not been exceeded', async () => {
    const app = getTestServer();
    const response = await request(app).get('/test');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });

  test('status code 429 is returned if rate quota limit has been exceeded', async () => {
    const app = getTestServer();
    await request(app).get('/test'); // call one
    const response = await request(app).get('/test'); // call two
    expect(response.status).toBe(429);
  });

  test('retry message is send in body if rate quota limit has been exceeded', async () => {
    const app = getTestServer();
    await request(app).get('/test'); // call one
    const response = await request(app).get('/test'); // call two
    expect(response.text).toBe(
      'Rate limit exceeded. Try again in 3600 seconds',
    );
  });
});
