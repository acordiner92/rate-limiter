import { utc } from '../src/DateUtil';
import { calculateRateLimit } from '../src/RateQuotaLimiter';

describe('RateQuotaLimiter', () => {
  const oneHr = 3600;
  const oneMinute = 60000;

  describe('calculateRateLimit', () => {
    const getUtcDateNow = (): Date => utc(2020, 10, 10, 8, 10);

    test('retryIn should be 0 if rate quota limit has not been exceeded', () => {
      const rateQuota = {
        requestEntries: [],
      };
      const config = {
        requestLimit: 1,
        duration: oneHr,
      };

      expect(calculateRateLimit(getUtcDateNow)(rateQuota, config).retryIn).toBe(
        0,
      );
    });

    test('new request entry is added to rate quota if rate quota limit has not been exceeded', () => {
      const rateQuota = {
        requestEntries: [],
      };
      const config = {
        requestLimit: 1,
        duration: oneHr,
      };

      expect(
        calculateRateLimit(getUtcDateNow)(rateQuota, config).rate
          .requestEntries,
      ).toStrictEqual([
        {
          requestedAt: utc(2020, 10, 10, 8, 10),
        },
      ]);
    });

    test('retryIn should not be 0 if rate quota limit has been exceeded', () => {
      const rateQuota = {
        requestEntries: [
          {
            requestedAt: utc(2020, 10, 10, 8, 0, 0),
          },
        ],
      };
      const config = {
        requestLimit: 1,
        duration: oneHr,
      };

      expect(calculateRateLimit(getUtcDateNow)(rateQuota, config).retryIn).toBe(
        oneMinute * 50, // in 50min
      );
    });

    test('no new request entry is added if rate quota limit has been exceeded', () => {
      const rateQuota = {
        requestEntries: [
          {
            requestedAt: utc(2020, 10, 10, 8, 0, 0),
          },
        ],
      };
      const config = {
        requestLimit: 1,
        duration: oneHr,
      };

      expect(
        calculateRateLimit(getUtcDateNow)(rateQuota, config).rate
          .requestEntries,
      ).toStrictEqual([
        {
          requestedAt: utc(2020, 10, 10, 8, 0, 0),
        },
      ]);
    });
  });
});
