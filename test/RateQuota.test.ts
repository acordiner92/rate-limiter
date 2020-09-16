import {
  hasRateLimitExceeded,
  removedExpiredRateRequests,
  addNewRateRequestToRate,
  init,
  getRetryInAmount,
} from '../src/RateQuota';
import { utc } from '../src/DateUtil';

describe('RateQuota', () => {
  describe('init', () => {
    test('Creates a new rate quota', () =>
      expect(init()).toStrictEqual({
        requestEntries: [],
      }));
  });

  describe('hasRateLimitExceeded', () => {
    const requestEntry = {
      requestedAt: new Date(),
    };

    test('returns true if the number of requests entries have exceeded the rate quota limit', () =>
      expect(
        hasRateLimitExceeded(
          { requestEntries: [requestEntry, requestEntry] },
          1,
        ),
      ).toBeTruthy());

    test('returns false if the number of request entries has not exceeded the rate quota limit', () =>
      expect(
        hasRateLimitExceeded({ requestEntries: [requestEntry] }, 1),
      ).toBeFalsy());
  });

  describe('removedExpiredRateRequests', () => {
    const getUtcDateNow = (): Date => utc(2020, 10, 10, 8, 10);

    test('if no request entries have expired then same number of request entries should be returned', () => {
      const nonExpiredRateRequest = {
        requestedAt: utc(2020, 10, 10, 7, 30, 0), // 40min and 0s ago
      };

      expect(
        removedExpiredRateRequests(getUtcDateNow)(
          { requestEntries: [nonExpiredRateRequest] },
          3600,
        ),
      ).toStrictEqual({
        requestEntries: [nonExpiredRateRequest],
      });
    });

    test('if all the request entries have expired then no request entries should be returned (time inclusive)', () => {
      const expiredRequestEntry = {
        requestedAt: utc(2020, 10, 10, 7, 10), // 60min ago
      };

      expect(
        removedExpiredRateRequests(getUtcDateNow)(
          { requestEntries: [expiredRequestEntry] },
          3600,
        ),
      ).toStrictEqual({
        requestEntries: [],
      });
    });

    test('if some of the request entries have expired then only non expired request entries should be returned', () => {
      const expiredRequestEntry = {
        requestedAt: utc(2020, 10, 10, 7, 8, 0), // 62min ago
      };
      const nonExpiredRequestEntry = {
        requestedAt: utc(2020, 10, 10, 7, 38, 0), // 30min ago
      };

      expect(
        removedExpiredRateRequests(getUtcDateNow)(
          { requestEntries: [expiredRequestEntry, nonExpiredRequestEntry] },
          3600,
        ),
      ).toStrictEqual({
        requestEntries: [nonExpiredRequestEntry],
      });
    });
  });

  describe('addNewRateRequestToRate', () => {
    test('new request entry is added to rate quota', () => {
      const newRequestedAt = utc(2020, 10, 10, 8, 10);
      const existingRateEntry = {
        requestedAt: utc(2020, 10, 10, 8, 0),
      };
      const rateQuota = {
        requestEntries: [existingRateEntry],
      };

      expect(addNewRateRequestToRate(rateQuota, newRequestedAt)).toStrictEqual({
        requestEntries: [
          existingRateEntry,
          {
            requestedAt: newRequestedAt,
          },
        ],
      });
    });
  });

  describe('getRetryInAmount', () => {
    const getUtcDateNow = (): Date => utc(2020, 10, 10, 8, 10);

    test('if there are no request entries then retryInAmount should be 0', () => {
      const rateQuota = {
        requestEntries: [],
      };
      expect(getRetryInAmount(getUtcDateNow)(rateQuota, 3600)).toBe(0);
    });

    test('since request entry is 59min and 58s ago, retryIn should be 2s', () => {
      const existingRequestEntry = {
        requestedAt: utc(2020, 10, 10, 7, 10, 2), // 59min and 58s ago
      };
      const rateQuota = {
        requestEntries: [existingRequestEntry],
      };
      expect(getRetryInAmount(getUtcDateNow)(rateQuota, 3600)).toBe(2000);
    });

    test('retryInAmount should be based the oldest request entry', () => {
      const oldestRequestEntry = {
        requestedAt: utc(2020, 10, 10, 7, 30, 0), // 40min ago
      };
      const newerRequestEntry = {
        requestedAt: utc(2020, 10, 10, 7, 50, 0), // 20min ago
      };
      const rateQuota = {
        requestEntries: [newerRequestEntry, oldestRequestEntry],
      };
      expect(getRetryInAmount(getUtcDateNow)(rateQuota, 3600)).toBe(1200000); // 20min remaining
    });
  });
});
