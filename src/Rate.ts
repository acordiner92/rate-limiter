type RateRequest = {
  readonly requestAt: Date;
};

export type Rate = {
  readonly rates: ReadonlyArray<RateRequest>;
};

export const init = (): Rate => ({
  rates: [],
});

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

const getDifferenceInSeconds = (
  rateRequest: RateRequest,
  rateDuration: number,
): number =>
  Math.ceil(
    (new Date(Date.now() + 1000 * rateDuration).getTime() -
      rateRequest.requestAt.getTime()) /
      1000,
  );

export const getRetryInAmount = (rate: Rate, rateDuration: number): number => {
  const [oldestRateRequest] = rate.rates
    .slice()
    .sort((a, b) => a.requestAt.getTime() - b.requestAt.getTime());

  return oldestRateRequest
    ? getDifferenceInSeconds(oldestRateRequest, rateDuration)
    : 0;
};
