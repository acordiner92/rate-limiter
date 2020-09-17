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

export const removeExpiredRequestEntries = (getUtcDateNow: GetUtcDateNow) => (
  rateQuota: RateQuota,
  ttl: number,
): RateQuota => {
  const nonExpiredRequestEntries = rateQuota.requestEntries.filter(
    x => x.requestedAt.getTime() > getUtcDateNow().getTime() - ttl,
  );
  return {
    ...rateQuota,
    requestEntries: nonExpiredRequestEntries,
  };
};

export const addNewRequestEntryToRateQuota = (
  rateQuota: RateQuota,
  requestedAt: Date,
): RateQuota => ({
  ...rateQuota,
  requestEntries: [
    ...rateQuota.requestEntries,
    {
      requestedAt,
    },
  ],
});
