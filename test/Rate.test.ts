import {
  hasRateLimitExceeded,
  removedExpiredRateRequests,
  addNewRateRequestToRate,
} from '../src/Rate';

describe('Rate', () => {
  describe('hasRateLimitExceeded', () => {
    const rateRequest = {
      requestAt: new Date(),
    };

    test('should return true if requests have exceeded the rate limit', () =>
      expect(
        hasRateLimitExceeded({ rates: [rateRequest, rateRequest] }, 1),
      ).toBeTruthy());

    test('should return false if requests has not exceeded the rate limit', () =>
      expect(hasRateLimitExceeded({ rates: [rateRequest] }, 1)).toBeFalsy());
  });

  describe('removedExpiredRateRequests', () => {
    test('if no requests have expired then same number of requests should be returned', () => {
      const nonExpiredRateRequest = {
        requestAt: new Date(),
      };

      expect(
        removedExpiredRateRequests({ rates: [nonExpiredRateRequest] }, 3600),
      ).toStrictEqual({
        rates: [nonExpiredRateRequest],
      });
    });

    test('if all the requests have expired then no request should be returned', () => {
      const expiredRateRequest = {
        requestAt: new Date(Date.now() + 3660 * 1000), // 61 minutes ago
      };

      expect(
        removedExpiredRateRequests({ rates: [expiredRateRequest] }, 3600),
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
          3600,
        ),
      ).toStrictEqual({
        rates: [nonExpiredRateRequest],
      });
    });
  });

  describe('addNewRateRequestToRate', () => {
    test('new RateRequest is added to rate', () => {
      const requestAt = new Date();
      const existingRateRequest = {
        requestAt: new Date(),
      };
      const rate = {
        rates: [existingRateRequest],
      };

      expect(addNewRateRequestToRate(rate, requestAt)).toStrictEqual({
        rates: [
          existingRateRequest,
          {
            requestAt,
          },
        ],
      });
    });
  });
});
