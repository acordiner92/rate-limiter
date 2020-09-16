import {
  addNewRateRequestToRate,
  removedExpiredRateRequests as removeExpiredRateRequests,
  hasRateLimitExceeded,
  getRetryInAmount,
  RateQuota,
} from './RateQuota';

import { MemoryStore } from './MemoryStore';
import { init } from './RateQuota';
import { GetUtcDateNow, getUtcDateNow } from './DateUtil';

export type RateLimiterConfig = {
  readonly requestLimit: number;
  readonly duration: number;
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
  const currentRate = removeExpiredRateRequests(getUtcDateNow)(
    rate,
    config.duration,
  );

  const currentRateWithNewRequest = addNewRateRequestToRate(
    currentRate,
    getUtcDateNow(),
  );
  const hasExceeded = hasRateLimitExceeded(
    currentRateWithNewRequest,
    config.requestLimit,
  );
  if (hasExceeded) {
    return {
      hasExceeded,
      rate: currentRate,
      retryIn: getRetryInAmount(getUtcDateNow)(currentRate, config.duration),
    };
  } else {
    return {
      rate: currentRateWithNewRequest,
      hasExceeded,
      retryIn: 0,
    };
  }
};

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
