import { RateQuota } from './RateQuota';

export type MemoryStore = {
  readonly getRateQuota: (identifier: string) => RateQuota | undefined;
  readonly saveRateQuota: (identifier: string, rate: RateQuota) => RateQuota;
};
/**
 * Initializes a new instance of a memory store that holds
 * the rate quota for each individual address.
 *
 * @returns {MemoryStore}
 */
export const init = (): MemoryStore => {
  // Storing this in an in memory map for sake of simplicity.
  // However if we were to use this in a multi server environment
  // then we would need a shared memory cluster like redis or memcache.
  const inMemoryStore = new Map<string, RateQuota>();

  const getRateQuota = (identifier: string): RateQuota | undefined =>
    inMemoryStore.get(identifier);

  const saveRateQuota = (identifier: string, rate: RateQuota): RateQuota => {
    inMemoryStore.set(identifier, rate).get(identifier);
    return rate;
  };

  return {
    getRateQuota,
    saveRateQuota,
  };
};
