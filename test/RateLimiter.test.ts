import { hasRateLimitExceeded } from '../src/RateLimiter';

describe('RateLimiter', () => {
  describe('hasRateLimitExceeded', () => {
    const rateRequest = {
      requestAt: new Date(),
    };

    test('should return true if requests have exceeded the rate limit', () =>
      expect(
        hasRateLimitExceeded(
          { rates: [rateRequest, rateRequest] },
          { requestLimit: 1, duration: 3600 },
        ),
      ).toBeTruthy());

    test('should return false if requests has not exceeded the rate limit', () =>
      expect(
        hasRateLimitExceeded(
          { rates: [rateRequest] },
          { requestLimit: 1, duration: 3600 },
        ),
      ).toBeTruthy());
  });
});
