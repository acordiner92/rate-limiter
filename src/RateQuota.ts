import { GetUtcDateNow } from './DateUtil';

type RequestEntry = {
  readonly requestedAt: Date;
};

export type RateQuota = {
  readonly requestEntries: ReadonlyArray<RequestEntry>;
};

export const init = (): RateQuota => ({
  requestEntries: [],
});

export const hasRateLimitExceeded = (
  rateQuota: RateQuota,
  requestLimit: number,
): boolean => rateQuota.requestEntries.length > requestLimit;

export const removedExpiredRateRequests = (getUtcDateNow: GetUtcDateNow) => (
  rateQuota: RateQuota,
  rateDuration: number,
): RateQuota => {
  const nonExpiredRates = rateQuota.requestEntries.filter(
    x =>
      x.requestedAt.getTime() > getUtcDateNow().getTime() - 1000 * rateDuration,
  );
  return {
    ...rateQuota,
    requestEntries: nonExpiredRates,
  };
};

export const addNewRateRequestToRate = (
  rateQuota: RateQuota,
  requestedAt: Date,
): RateQuota => {
  const rateRequest = {
    requestedAt,
  };

  return {
    ...rateQuota,
    requestEntries: [...rateQuota.requestEntries, rateRequest],
  };
};

const getDifferenceInMilliseconds = (getUtcDateNow: GetUtcDateNow) => (
  requestEntry: RequestEntry,
  rateDuration: number,
): number =>
  requestEntry.requestedAt.getTime() -
  (getUtcDateNow().getTime() - 1000 * rateDuration);

export const getRetryInAmount = (getUtcDateNow: GetUtcDateNow) => (
  rateQuota: RateQuota,
  rateDuration: number,
): number => {
  const [oldestRateRequest] = rateQuota.requestEntries
    .slice()
    .sort((a, b) => a.requestedAt.getTime() - b.requestedAt.getTime());

  return oldestRateRequest
    ? getDifferenceInMilliseconds(getUtcDateNow)(
        oldestRateRequest,
        rateDuration,
      )
    : 0;
};
