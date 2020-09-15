// import {
//   addNewRateRequestToRate,
//   removedExpiredRateRequests,
//   hasRateLimitExceeded,
// } from './Rate';

export type RateLimiterConfig = {
  readonly requestLimit: number;
  readonly duration: number;
};

// export const getHasRateLimitExceeded = (config: RateLimiterConfig) => (
//   identifier: string,
// ) => {
//   // fetch identifier rate
//   // if none exist create new Rate other using existing
//   const updatedRate = addNewRateRequestToRate(rate, new Date());
//   const freshRate = removedExpiredRateRequests(updatedRate, config.duration);
//   return hasRateLimitExceeded(freshRate, config.requestLimit);
// };
