import { GetUtcDateNow } from './DateUtil';

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

export const removedExpiredRateRequests = (getUtcDateNow: GetUtcDateNow) => (
  rate: Rate,
  rateDuration: number,
): Rate => {
  const nonExpiredRates = rate.rates.filter(
    x =>
      x.requestAt.getTime() > getUtcDateNow().getTime() - 1000 * rateDuration,
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

const getDifferenceInSeconds = (getUtcDateNow: GetUtcDateNow) => (
  rateRequest: RateRequest,
  rateDuration: number,
): number =>
  Math.ceil(
    (rateRequest.requestAt.getTime() -
      (getUtcDateNow().getTime() - 1000 * rateDuration)) /
      1000,
  );

export const getRetryInAmount = (getUtcDateNow: GetUtcDateNow) => (
  rate: Rate,
  rateDuration: number,
): number => {
  const [oldestRateRequest] = rate.rates
    .slice()
    .sort((a, b) => a.requestAt.getTime() - b.requestAt.getTime());

  return oldestRateRequest
    ? getDifferenceInSeconds(getUtcDateNow)(oldestRateRequest, rateDuration)
    : 0;
};
