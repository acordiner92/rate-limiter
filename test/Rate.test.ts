import {
  hasRateLimitExceeded,
  removedExpiredRateRequests,
  addNewRateRequestToRate,
  init,
  getRetryInAmount,
} from '../src/Rate';

describe('Rate', () => {
  describe('init', () => {
    test('Creates a new rate', () =>
      expect(init()).toStrictEqual({
        rates: [],
      }));
  });

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

  describe('getRetryInAmount', () => {
    test('if rate requests is empty then retryInAmount should be 0', () => {
      const rate = {
        rates: [],
      };
      expect(getRetryInAmount(rate, 3600)).toBe(0);
    });

    test('if rate request is not empty then retryInAmount should be 1', () => {
      const existingRateRequest = {
        requestAt: new Date(Date.now() + 1000 * 3599),
      };
      const rate = {
        rates: [existingRateRequest],
      };
      expect(getRetryInAmount(rate, 3600)).toBe(1);
    });

    test('retryInAmount should be on the old rate request', () => {
      const oldestRateRequest = {
        requestAt: new Date(Date.now() + 1000 * 1800),
      };
      const newerRateRequest = {
        requestAt: new Date(Date.now() + 1000 * 3600),
      };
      const rate = {
        rates: [newerRateRequest, oldestRateRequest],
      };
      expect(getRetryInAmount(rate, 3600)).toBe(1800);
    });
  });
});
