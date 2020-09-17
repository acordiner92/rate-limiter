import { GetUtcDateNow } from './DateUtil';

export type RequestEntry = {
  readonly requestedAt: Date;
};

export type RateQuota = {
  readonly requestEntries: ReadonlyArray<RequestEntry>;
};

/**
 * Creates a new rate quota.
 *
 * @returns {RateQuota}
 */
export const init = (): RateQuota => ({
  requestEntries: [],
});

/**
 * Removes all request entries that have past
 * the configured ttl time.
 *
 * @param {RateQuota} rateQuota
 * @param {number} ttl
 * @returns {RateQuota} rate quota with no expired request entries.
 */
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

/**
 * Adds a new request entry to the rate quota.
 *
 * @param {RateQuota} rateQuota
 * @param {Date} requestedAt
 * @returns {RateQuota}
 */
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
