type RateRequest = {
  readonly requestAt: Date;
};

type Rate = {
  readonly rates: ReadonlyArray<RateRequest>;
};

export const hasRateLimitExceeded = (
  rate: Rate,
  requestLimit: number,
): boolean => rate.rates.length > requestLimit;

export const removedExpiredRateRequests = (
  rate: Rate,
  rateDuration: number,
): Rate => {
  // TODO: fix this to be UTC
  const nonExpiredRates = rate.rates.filter(
    x => x.requestAt < new Date(Date.now() + 1000 * rateDuration),
  );
  return {
    ...rate,
    rates: nonExpiredRates,
  };
};

export const addNewRateRequestToRate = (rate: Rate, requestAt: Date): Rate => {
  const rateRequest = {
    requestAt,
  };

  return {
    ...rate,
    rates: [...rate.rates, rateRequest],
  };
};
