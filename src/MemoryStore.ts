import { RateQuota } from './RateQuota';

export type MemoryStore = {
  readonly getRate: (identifier: string) => RateQuota | undefined;
  readonly saveRate: (identifier: string, rate: RateQuota) => RateQuota;
};

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
