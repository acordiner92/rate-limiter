import { utc } from '../src/DateUtil';
import { runRateLimitCheck } from '../src/RateQuotaHandler';

describe('RateQuotaHandler', () => {
  const oneSecond = 1000;
  describe('runRateLimitCheck', () => {
    test('if memoryStore returns no existing rate quota a new one is created', () => {
      const getUtcDateNow = (): Date => utc(2020, 10, 10, 8, 10);

      const memoryStoreMock = {
        saveRate: jest.fn(),
        getRate: jest.fn().mockReturnValue(undefined),
      };

      const config = {
        limit: 1,
        ttl: 5 * oneSecond,
      };

      runRateLimitCheck(memoryStoreMock, config, getUtcDateNow)('192.168.1.1');

      expect(memoryStoreMock.saveRate.mock.calls[0][1]).toStrictEqual({
        requestEntries: [
          {
            requestedAt: utc(2020, 10, 10, 8, 10),
          },
        ],
      });
    });
  });
});
