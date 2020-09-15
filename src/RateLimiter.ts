type RateLimiterConfig = {
  readonly requestLimit: number;
  readonly duration: number;
};

type RateRequest = {
  readonly requestAt: Date;
};

type Rate = {
  readonly rates: ReadonlyArray<RateRequest>;
};

export const hasRateLimitExceeded = (
  rate: Rate,
  config: RateLimiterConfig,
): boolean => rate.rates.length > config.requestLimit;

export const removedExpiredRateRequests = (
  rate: Rate,
  config: RateLimiterConfig,
): Rate => {
  const nonExpiredRates = rate.rates.filter(
    x => x.requestAt < new Date(Date.now() + 1000 * config.duration),
  );
  return {
    ...rate,
    rates: nonExpiredRates,
  };
};
