import { RateQuota } from './RateQuota';

import { GetUtcDateNow } from './DateUtil';
import { getRetryInAmount, hasRateLimitExceeded } from './RateQuotaCalculator';

export type RateLimiterConfig = {
  readonly limit: number;
  readonly ttl: number;
};

export type RateLimitResponse = {
  readonly hasExceeded: boolean;
  readonly retryIn: number;
};

/**
 * Performs rate limit calculations on rate quota to determine whether
 * rate quota limit has been exceeded and time to be able retry again
 * if exceeded
 *
 * @param {RateQuota} rate
 * @param {RateLimiterConfig} config
 * @returns {RateQuotaResponse} calculations + updated RateQuota.
 */
export const calculateRateLimit = (getUtcDateNow: GetUtcDateNow) => (
  rate: RateQuota,
  config: RateLimiterConfig,
): RateLimitResponse => {
  const hasExceeded = hasRateLimitExceeded(rate, config.limit);
  return hasExceeded
    ? {
        hasExceeded,
        retryIn: getRetryInAmount(getUtcDateNow)(rate, config.ttl),
      }
    : {
        hasExceeded,
        retryIn: 0,
      };
};
