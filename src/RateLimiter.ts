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
