import { Rate } from './Rate';

export type MemoryStore = {
  readonly getRate: (identifier: string) => Rate | undefined;
  readonly saveRate: (identifier: string, rate: Rate) => Rate;
};

export const init = (): MemoryStore => {
  const inMemoryStore = new Map<string, Rate>();

  const getRate = (identifier: string): Rate | undefined =>
    inMemoryStore.get(identifier);

  const saveRate = (identifier: string, rate: Rate): Rate => {
    inMemoryStore.set(identifier, rate);
    return rate;
  };

  return {
    getRate,
    saveRate,
  };
};
