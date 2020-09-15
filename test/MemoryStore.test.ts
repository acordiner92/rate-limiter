import { init } from '../src/MemoryStore';

describe('MemoryStore', () => {
  describe('get', () => {
    test('if a rate exists then a rate is returned', () => {
      const memoryStore = init();
      const identifier = '192.168.1.1';
      const rate = {
        rates: [],
      };
      memoryStore.saveRate(identifier, rate);

      expect(memoryStore.getRate(identifier)).toStrictEqual({
        rates: [],
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
      const rateRequest = {
        requestAt: new Date(),
      };
      const rate = {
        rates: [rateRequest],
      };
      memoryStore.saveRate(identifier, rate);

      expect(memoryStore.getRate(identifier)).toStrictEqual({
        rates: [rateRequest],
      });
    });
  });
});
