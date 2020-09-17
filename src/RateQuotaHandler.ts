import { GetUtcDateNow } from './DateUtil';
import logger from './Logger';
import { MemoryStore } from './MemoryStore';
import {
  calculateRateLimit,
  RateLimiterConfig,
  RateLimitResponse,
} from './RateLimiter';
import {
  addNewRequestEntryToRateQuota,
  init,
  RateQuota,
  removeExpiredRequestEntries,
} from './RateQuota';

const logRateQuotaBeforeTransformation = (
  identifier: string,
  rateQuota: RateQuota,
): void => logger.info(rateQuota, `rate quota for ${identifier} before`);

const logRateQuotaAfterTransformation = (
  identifier: string,
  rateQuota: RateQuota,
): void => logger.info(rateQuota, `rate quota for ${identifier} after`);

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
  logRateQuotaBeforeTransformation(identifier, rateQuota);

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

  const savedRateQuota = memoryStore.saveRateQuota(
    identifier,
    calculation.hasExceeded ? currentRateQuota : currentRateQuotaWithNewEntry,
  );
  logRateQuotaAfterTransformation(identifier, savedRateQuota);

  return {
    hasExceeded: calculation.hasExceeded,
    retryIn: calculation.retryIn,
  };
};
export type RunRateLimitCheck = (identifier: string) => RateLimitResponse;
