import { RateQuota } from './RateQuota';

export type MemoryStore = {
  readonly getRate: (identifier: string) => RateQuota | undefined;
  readonly saveRate: (identifier: string, rate: RateQuota) => RateQuota;
};
/**
 * Initializes a new instance of a memory store that holds
 * the rate quota for each individual address.
 *
 * @returns {MemoryStore}
 */
export const init = (): MemoryStore => {
  const inMemoryStore = new Map<string, RateQuota>();

  const getRate = (identifier: string): RateQuota | undefined =>
    inMemoryStore.get(identifier);

  const saveRate = (identifier: string, rate: RateQuota): RateQuota => {
    inMemoryStore.set(identifier, rate);
    return rate;
  };

  return {
    getRate,
    saveRate,
  };
};
