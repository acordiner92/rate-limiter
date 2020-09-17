describe('rateLimiterMiddleware', () => {
  test.todo(
    'next middleware is called if rate quota limit has not been exceeded',
  );

  test.todo(
    'status code 429 is returned if rate quota limit has been exceeded',
  );

  test.todo(
    'retry message is send in body if rate quota limit has been exceeded',
  );
});
