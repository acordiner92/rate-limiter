import { init } from '../src/MemoryStore';

describe('MemoryStore', () => {
  describe('get', () => {
    test('if a rate quota exists with that identifier then that rate quota is returned', () => {
      const memoryStore = init();
      const identifier = '192.168.1.1';
      const rateQuota = {
        requestEntries: [],
      };
      memoryStore.saveRate(identifier, rateQuota);

      expect(memoryStore.getRate(identifier)).toStrictEqual({
        requestEntries: [],
      });
    });

    test('if a rate does not exist then undefined returned', () => {
      const memoryStore = init();
      const identifier = '192.168.1.1';

      expect(memoryStore.getRate(identifier)).toBeUndefined();
    });
  });

  describe('save', () => {
    test('a rate is saved in memory store', () => {
      const memoryStore = init();
      const identifier = '192.168.1.1';
      const requestEntry = {
        requestedAt: new Date(),
      };
      const rateQuota = {
        requestEntries: [requestEntry],
      };
      memoryStore.saveRate(identifier, rateQuota);

      expect(memoryStore.getRate(identifier)).toStrictEqual({
        requestEntries: [requestEntry],
      });
    });
  });
});
