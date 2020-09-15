import {
  hasRateLimitExceeded,
  removedExpiredRateRequests,
  addNewRateRequestToRate,
  init,
  getRetryInAmount,
} from '../src/Rate';
import { utc } from '../src/DateUtil';

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
    const getUtcDateNow = (): Date => utc(2020, 10, 10, 8, 10);

    test('if no requests have expired then same number of requests should be returned', () => {
      const nonExpiredRateRequest = {
        requestAt: utc(2020, 10, 10, 7, 30, 0), // 40min and 0s ago
      };

      expect(
        removedExpiredRateRequests(getUtcDateNow)(
          { rates: [nonExpiredRateRequest] },
          3600,
        ),
      ).toStrictEqual({
        rates: [nonExpiredRateRequest],
      });
    });

    test('if all the requests have expired then no request should be returned (time inclusive)', () => {
      const expiredRateRequest = {
        requestAt: utc(2020, 10, 10, 7, 10), // 60min ago
      };

      expect(
        removedExpiredRateRequests(getUtcDateNow)(
          { rates: [expiredRateRequest] },
          3600,
        ),
      ).toStrictEqual({
        rates: [],
      });
    });

    test('if some of the requests have expired then only non expired requests should be returned', () => {
      const expiredRateRequest = {
        requestAt: utc(2020, 10, 10, 7, 8, 0), // 62min ago
      };
      const nonExpiredRateRequest = {
        requestAt: utc(2020, 10, 10, 7, 38, 0), // 30min ago
      };

      expect(
        removedExpiredRateRequests(getUtcDateNow)(
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
    const getUtcDateNow = (): Date => utc(2020, 10, 10, 8, 10);

    test('if rate requests is empty then retryInAmount should be 0', () => {
      const rate = {
        rates: [],
      };
      expect(getRetryInAmount(getUtcDateNow)(rate, 3600)).toBe(0);
    });

    test('if rate request is not empty then retryInAmount should be 1', () => {
      const existingRateRequest = {
        requestAt: utc(2020, 10, 10, 7, 10, 2), // 59min and 58s ago
      };
      const rate = {
        rates: [existingRateRequest],
      };
      expect(getRetryInAmount(getUtcDateNow)(rate, 3600)).toBe(2);
    });

    test('retryInAmount should be based the oldest rate request', () => {
      const oldestRateRequest = {
        requestAt: utc(2020, 10, 10, 7, 30, 0), // 40min ago
      };
      const newerRateRequest = {
        requestAt: utc(2020, 10, 10, 7, 50, 0), // 20min ago
      };
      const rate = {
        rates: [newerRateRequest, oldestRateRequest],
      };
      expect(getRetryInAmount(getUtcDateNow)(rate, 3600)).toBe(1200); // 20min remaining
    });
  });
});
