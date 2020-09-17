import request from 'supertest';
import express, { Express } from 'express';
import { rateLimiterMiddleware } from '../src/Middleware';
import { getHasRateLimitExceeded } from '../src/RateQuotaHandler';
import { init } from '../src/MemoryStore';
import { getUtcDateNow } from '../src/DateUtil';

const getSetupServer = (): Express => {
  const oneHour = 3600000;
  const app = express();
  const memoryStore = init();

  const rateLimiterConfig = {
    requestLimit: 1,
    duration: oneHour,
  };
  app.use(
    rateLimiterMiddleware(
      getHasRateLimitExceeded(memoryStore, rateLimiterConfig, getUtcDateNow),
    ),
  );
  app.get('/test', (_req, res) => res.send('Hello World!'));
  return app;
};

describe('rateLimiterMiddleware', () => {
  test('next middleware is called if rate quota limit has not been exceeded', async () => {
    const app = getSetupServer();
    const response = await request(app).get('/test');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });

  test('status code 429 is returned if rate quota limit has been exceeded', async () => {
    const app = getSetupServer();
    await request(app).get('/test'); // call one
    const response = await request(app).get('/test'); // call two
    expect(response.status).toBe(429);
  });

  test('retry message is send in body if rate quota limit has been exceeded', async () => {
    const app = getSetupServer();
    await request(app).get('/test'); // call one
    const response = await request(app).get('/test'); // call two
    expect(response.text).toBe(
      'Rate limit exceeded. Try again in 3600 seconds',
    );
  });
});
