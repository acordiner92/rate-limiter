import {
  addNewRateRequestToRate,
  removedExpiredRateRequests,
  hasRateLimitExceeded,
} from './Rate';

import { MemoryStore } from './MemoryStore';
import { init } from './Rate';

export type RateLimiterConfig = {
  readonly requestLimit: number;
  readonly duration: number;
};

export const getHasRateLimitExceeded = (
  memoryStore: MemoryStore,
  config: RateLimiterConfig,
) => (identifier: string): boolean => {
  const rate = memoryStore.getRate(identifier) ?? init();
  const updatedRate = addNewRateRequestToRate(rate, new Date());
  const freshRate = removedExpiredRateRequests(updatedRate, config.duration);
  memoryStore.saveRate(identifier, freshRate);
  return hasRateLimitExceeded(freshRate, config.requestLimit);
};
