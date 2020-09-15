// import {
//   addNewRateRequestToRate,
//   removedExpiredRateRequests,
//   hasRateLimitExceeded,
//   getRetryInAmount,
// } from './Rate';

// import { MemoryStore } from './MemoryStore';
// import { init } from './Rate';

export type RateLimiterConfig = {
  readonly requestLimit: number;
  readonly duration: number;
};

export type RateLimitResponse = {
  readonly hasExceeded: boolean;
  readonly retryIn: number;
};

// export const getHasRateLimitExceeded = (
//   memoryStore: MemoryStore,
//   config: RateLimiterConfig,
// ) => (identifier: string): RateLimitResponse => {
//   const rate = memoryStore.getRate(identifier) ?? init();
//   const updatedRate = addNewRateRequestToRate(rate, new Date());
//   const freshRate = removedExpiredRateRequests(updatedRate, config.duration);
//   memoryStore.saveRate(identifier, freshRate);
//   const hasExceeded = hasRateLimitExceeded(rate, config.requestLimit);
//   return {
//     hasExceeded,
//     retryIn: hasExceeded ? getRetryInAmount(freshRate, config.duration) : 0,
//   };
// };
