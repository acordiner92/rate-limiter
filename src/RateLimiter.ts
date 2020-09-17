import { RateQuota } from './RateQuota';

import { GetUtcDateNow } from './DateUtil';
import {
  getRetryInAmount,
  hasRateQuotaLimitBeenExceeded,
} from './RateQuotaCalculator';

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
  rateQuota: RateQuota,
  config: RateLimiterConfig,
): RateLimitResponse => {
  const hasExceeded = hasRateQuotaLimitBeenExceeded(rateQuota, config.limit);
  return {
    hasExceeded,
    retryIn: hasExceeded
      ? getRetryInAmount(getUtcDateNow)(rateQuota, config.ttl)
      : 0,
  };
};
