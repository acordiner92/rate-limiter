import { GetUtcDateNow } from './DateUtil';
import { RateQuota, RequestEntry } from './RateQuota';

const getDifferenceInMilliseconds = (getUtcDateNow: GetUtcDateNow) => (
  requestEntry: RequestEntry,
  ttl: number,
): number =>
  requestEntry.requestedAt.getTime() - (getUtcDateNow().getTime() - ttl);

/**
 * Determines whether rateQuota's limit has been
 * exceeded or not.
 *
 * @param {RateQuota} rateQuota
 * @param {number} limit
 * @returns {boolean} has rate quota been exceeded.
 */
export const hasRateQuotaLimitBeenExceeded = (
  rateQuota: RateQuota,
  limit: number,
): boolean => rateQuota.requestEntries.length > limit;

/**
 * Gets retry in time for a rate quota in the form
 * of milliseconds.
 *
 * @param {RateQuota} rateQuota
 * @param {number} ttl
 * @returns {number} retry time in ms.
 */
export const getRetryInAmount = (getUtcDateNow: GetUtcDateNow) => (
  rateQuota: RateQuota,
  ttl: number,
): number => {
  const [oldestRequestEntry] = rateQuota.requestEntries
    .slice()
    .sort((a, b) => a.requestedAt.getTime() - b.requestedAt.getTime());

  return oldestRequestEntry
    ? getDifferenceInMilliseconds(getUtcDateNow)(oldestRequestEntry, ttl)
    : 0;
};
