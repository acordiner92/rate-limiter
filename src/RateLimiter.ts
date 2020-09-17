import {
  addNewRequestEntryToRateQuota,
  RateQuota,
  removeExpiredRequestEntries,
} from './RateQuota';

import { GetUtcDateNow } from './DateUtil';
import { getRetryInAmount, hasRateLimitExceeded } from './RateQuotaCalculator';

export type RateLimiterConfig = {
  readonly limit: number;
  readonly ttl: number;
};

export type CalculationResponse = {
  readonly hasExceeded: boolean;
  readonly retryIn: number;
  readonly rate: RateQuota;
};

export type RateLimitResponse = {
  readonly hasExceeded: boolean;
  readonly retryIn: number;
};

export const calculateRateLimit = (getUtcDateNow: GetUtcDateNow) => (
  rate: RateQuota,
  config: RateLimiterConfig,
): CalculationResponse => {
  const currentRate = removeExpiredRequestEntries(getUtcDateNow)(
    rate,
    config.ttl,
  );

  const currentRateWithNewRequest = addNewRequestEntryToRateQuota(
    currentRate,
    getUtcDateNow(),
  );
  const hasExceeded = hasRateLimitExceeded(
    currentRateWithNewRequest,
    config.limit,
  );
  if (hasExceeded) {
    return {
      hasExceeded,
      rate: currentRate,
      retryIn: getRetryInAmount(getUtcDateNow)(currentRate, config.ttl),
    };
  } else {
    return {
      rate: currentRateWithNewRequest,
      hasExceeded,
      retryIn: 0,
    };
  }
};
