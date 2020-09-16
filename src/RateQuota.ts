import { GetUtcDateNow } from './DateUtil';

export type RequestEntry = {
  readonly requestedAt: Date;
};

export type RateQuota = {
  readonly requestEntries: ReadonlyArray<RequestEntry>;
};

export const init = (): RateQuota => ({
  requestEntries: [],
});

export const removeExpiredRateRequests = (getUtcDateNow: GetUtcDateNow) => (
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
