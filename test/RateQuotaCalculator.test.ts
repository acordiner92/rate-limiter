import { utc } from '../src/DateUtil';
import {
  getRetryInAmount,
  hasRateQuotaLimitBeenExceeded,
} from '../src/RateQuotaCalculator';

describe('RateQuotaCalculator', () => {
  const oneSecond = 1000;
  const oneMinute = 60000;
  const oneHour = 3600000;

  describe('hasRateQuotaLimitBeenExceeded', () => {
    const requestEntry = {
      requestedAt: utc(2020, 10, 10, 8, 10),
    };

    test('returns true if the number of requests entries have exceeded the rate quota limit', () =>
      expect(
        hasRateQuotaLimitBeenExceeded(
          { requestEntries: [requestEntry, requestEntry] },
          1,
        ),
      ).toBeTruthy());

    test('returns false if the number of request entries has not exceeded the rate quota limit', () =>
      expect(
        hasRateQuotaLimitBeenExceeded({ requestEntries: [requestEntry] }, 1),
      ).toBeFalsy());
  });

  describe('getRetryInAmount', () => {
    const getUtcDateNow = (): Date => utc(2020, 10, 10, 8, 10);

    test('if there are no request entries then retryInAmount should be 0', () => {
      const rateQuota = {
        requestEntries: [],
      };
      expect(getRetryInAmount(getUtcDateNow)(rateQuota, oneHour)).toBe(0);
    });

    test('since request entry is 59min and 58s ago, retryIn should be 2s', () => {
      const existingRequestEntry = {
        requestedAt: utc(2020, 10, 10, 7, 10, 2), // 59min and 58s ago
      };
      const rateQuota = {
        requestEntries: [existingRequestEntry],
      };
      expect(getRetryInAmount(getUtcDateNow)(rateQuota, oneHour)).toBe(
        oneSecond * 2,
      );
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
      expect(getRetryInAmount(getUtcDateNow)(rateQuota, oneHour)).toBe(
        oneMinute * 20,
      );
    });
  });
});
