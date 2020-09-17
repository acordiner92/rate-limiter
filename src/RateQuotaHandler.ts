import { GetUtcDateNow } from './DateUtil';
import { MemoryStore } from './MemoryStore';
import {
  calculateRateLimit,
  RateLimiterConfig,
  RateLimitResponse,
} from './RateLimiter';
import {
  addNewRequestEntryToRateQuota,
  init,
  removeExpiredRequestEntries,
} from './RateQuota';

/**
 * Checks whether this particular identity has exceeded the
 * rate quota limit or not.
 *
 * @param {string} identifier
 * @returns {RateLimitResponse}
 */
export const runRateLimitCheck = (
  memoryStore: MemoryStore,
  config: RateLimiterConfig,
  getUtcDateNow: GetUtcDateNow,
) => (identifier: string): RateLimitResponse => {
  const rateQuota = memoryStore.getRateQuota(identifier) ?? init();

  const currentRateQuota = removeExpiredRequestEntries(getUtcDateNow)(
    rateQuota,
    config.ttl,
  );
  const currentRateQuotaWithNewEntry = addNewRequestEntryToRateQuota(
    currentRateQuota,
    getUtcDateNow(),
  );

  const calculation = calculateRateLimit(getUtcDateNow)(
    currentRateQuotaWithNewEntry,
    config,
  );

  memoryStore.saveRateQuota(
    identifier,
    calculation.hasExceeded ? currentRateQuota : currentRateQuotaWithNewEntry,
  );

  return {
    hasExceeded: calculation.hasExceeded,
    retryIn: calculation.retryIn,
  };
};
export type RunRateLimitCheck = (identifier: string) => RateLimitResponse;
