import { utc } from '../src/DateUtil';
import { calculateRateLimit } from '../src/RateLimiter';

describe('RateLimiter', () => {
  describe('calculateRateLimit', () => {
    const getUtcDateNow = (): Date => utc(2020, 10, 10, 8, 10);

    test('retryIn should be 0 if rate limit has not been exceeded', () => {
      const rate = {
        rates: [],
      };
      const config = {
        requestLimit: 1,
        duration: 60,
      };

      expect(calculateRateLimit(getUtcDateNow)(rate, config).retryIn).toBe(0);
    });

    test('rate has new request added to it if rate limit has not been exceeded', () => {
      const rate = {
        rates: [],
      };
      const config = {
        requestLimit: 1,
        duration: 60,
      };

      expect(
        calculateRateLimit(getUtcDateNow)(rate, config).rate.rates,
      ).toStrictEqual([
        {
          requestAt: utc(2020, 10, 10, 8, 10),
        },
      ]);
    });

    test('retryIn should not be 0 if rate limit has been exceeded', () => {
      const rate = {
        rates: [
          {
            requestAt: utc(2020, 10, 10, 8, 0, 0),
          },
        ],
      };
      const config = {
        requestLimit: 1,
        duration: 3600,
      };

      expect(calculateRateLimit(getUtcDateNow)(rate, config).retryIn).toBe(
        3000000, // in 50min
      );
    });

    test('no new rate request is added if rate limit has been exceeded', () => {
      const rate = {
        rates: [
          {
            requestAt: utc(2020, 10, 10, 8, 0, 0),
          },
        ],
      };
      const config = {
        requestLimit: 1,
        duration: 3600,
      };

      expect(
        calculateRateLimit(getUtcDateNow)(rate, config).rate.rates,
      ).toStrictEqual([
        {
          requestAt: utc(2020, 10, 10, 8, 0, 0),
        },
      ]);
    });
  });
});
