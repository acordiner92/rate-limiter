import { utc } from '../src/DateUtil';
import { init } from '../src/MemoryStore';
import { runRateLimitCheck } from '../src/RateQuotaHandler';

describe('RateQuotaHandler', () => {
  const oneHour = 3600000;
  describe('runRateLimitCheck', () => {
    test('if memoryStore returns no existing rate quota a new one is created', () => {
      const getUtcDateNow = (): Date => utc(2020, 10, 10, 8, 10);
      const memoryStore = init();
      const config = {
        limit: 1,
        ttl: 5 * oneHour,
      };
      runRateLimitCheck(memoryStore, config, getUtcDateNow)('192.168.1.1');
      expect(memoryStore.getRateQuota('192.168.1.1')).toStrictEqual({
        requestEntries: [
          {
            requestedAt: utc(2020, 10, 10, 8, 10),
          },
        ],
      });
    });

    test('if rate quota limit has been exceeded then new request entry is not saved', () => {
      const getUtcDateNow = (): Date => utc(2020, 10, 10, 8, 10);
      const memoryStore = init();
      const config = {
        limit: 1,
        ttl: oneHour,
      };
      const existingRateQuota = {
        requestEntries: [
          {
            requestedAt: utc(2020, 10, 10, 8, 8),
          },
        ],
      };
      memoryStore.saveRateQuota('192.168.1.1', existingRateQuota);

      runRateLimitCheck(memoryStore, config, getUtcDateNow)('192.168.1.1');
      expect(memoryStore.getRateQuota('192.168.1.1')).toStrictEqual({
        requestEntries: [
          {
            requestedAt: utc(2020, 10, 10, 8, 8),
          },
        ],
      });
    });

    test('if rate quota limit has not been exceeded then new request is saved', () => {
      const getUtcDateNow = (): Date => utc(2020, 10, 10, 8, 10);
      const memoryStore = init();
      const config = {
        limit: 2,
        ttl: oneHour,
      };
      const existingRateQuota = {
        requestEntries: [
          {
            requestedAt: utc(2020, 10, 10, 8, 8),
          },
        ],
      };
      memoryStore.saveRateQuota('192.168.1.1', existingRateQuota);

      runRateLimitCheck(memoryStore, config, getUtcDateNow)('192.168.1.1');
      expect(memoryStore.getRateQuota('192.168.1.1')).toStrictEqual({
        requestEntries: [
          {
            requestedAt: utc(2020, 10, 10, 8, 8),
          },
          {
            requestedAt: utc(2020, 10, 10, 8, 10),
          },
        ],
      });
    });
  });
});
