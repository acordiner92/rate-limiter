import { getUtcDateNow } from './DateUtil';
import { MemoryStore } from './MemoryStore';
import {
  calculateRateLimit,
  RateLimiterConfig,
  RateLimitResponse,
} from './RateQuotaLimiter';
import { init } from './RateQuota';

export const getHasRateLimitExceeded = (
  memoryStore: MemoryStore,
  config: RateLimiterConfig,
) => (identifier: string): RateLimitResponse => {
  const rate = memoryStore.getRate(identifier) ?? init();
  const calculation = calculateRateLimit(getUtcDateNow)(rate, config);
  memoryStore.saveRate(identifier, calculation.rate);
  return {
    hasExceeded: calculation.hasExceeded,
    retryIn: calculation.retryIn,
  };
};
export type GetHasRateLimitExceeded = (identifier: string) => RateLimitResponse;
