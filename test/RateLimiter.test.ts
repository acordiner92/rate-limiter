import {
  hasRateLimitExceeded,
  removedExpiredRateRequests,
} from '../src/RateLimiter';

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
      ).toBeFalsy());
  });

  describe('removedExpiredRateRequests', () => {
    test('if no requests have expired then same number of requests should be returned', () => {
      const nonExpiredRateRequest = {
        requestAt: new Date(),
      };

      expect(
        removedExpiredRateRequests(
          { rates: [nonExpiredRateRequest] },
          { requestLimit: 1, duration: 3600 },
        ),
      ).toStrictEqual({
        rates: [nonExpiredRateRequest],
      });
    });

    test('if all the requests have expired then no request should be returned', () => {
      const expiredRateRequest = {
        requestAt: new Date(Date.now() + 3660 * 1000), // 61 minutes ago
      };

      expect(
        removedExpiredRateRequests(
          { rates: [expiredRateRequest] },
          { requestLimit: 1, duration: 3600 },
        ),
      ).toStrictEqual({
        rates: [],
      });
    });

    test('if some of the requests have expired then only non expired requests should be returned', () => {
      const expiredRateRequest = {
        requestAt: new Date(Date.now() + 3660 * 1000), // 61 minutes ago
      };
      const nonExpiredRateRequest = {
        requestAt: new Date(),
      };

      expect(
        removedExpiredRateRequests(
          { rates: [expiredRateRequest, nonExpiredRateRequest] },
          { requestLimit: 1, duration: 3600 },
        ),
      ).toStrictEqual({
        rates: [nonExpiredRateRequest],
      });
    });
  });
});
