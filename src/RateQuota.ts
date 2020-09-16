import { GetUtcDateNow } from './DateUtil';

const oneSecond = 1000;

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
  rateDuration: number,
): RateQuota => {
  const nonExpiredRequestEntries = rateQuota.requestEntries.filter(
    x =>
      x.requestedAt.getTime() >
      getUtcDateNow().getTime() - oneSecond * rateDuration,
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
