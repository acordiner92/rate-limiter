import { utc } from '../src/DateUtil';
import { calculateRateLimit } from '../src/RateLimiter';

describe('RateLimiter', () => {
  const oneHr = 3600000;
  const oneMinute = 60000;

  describe('calculateRateLimit', () => {
    const getUtcDateNow = (): Date => utc(2020, 10, 10, 8, 10);
    const config = {
      limit: 1,
      ttl: oneHr,
    };

    test('retryIn should be 0 if rate quota limit has not been exceeded', () => {
      const rateQuota = {
        requestEntries: [],
      };

      expect(calculateRateLimit(getUtcDateNow)(rateQuota, config).retryIn).toBe(
        0,
      );
    });

    test('new request entry is added to rate quota if rate quota limit has not been exceeded', () => {
      const rateQuota = {
        requestEntries: [],
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
