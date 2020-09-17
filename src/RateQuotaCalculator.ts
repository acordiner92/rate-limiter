import { GetUtcDateNow } from './DateUtil';
import { RateQuota, RequestEntry } from './RateQuota';

const getDifferenceInMilliseconds = (getUtcDateNow: GetUtcDateNow) => (
  requestEntry: RequestEntry,
  ttl: number,
): number =>
  requestEntry.requestedAt.getTime() - (getUtcDateNow().getTime() - ttl);
export const hasRateLimitExceeded = (
  rateQuota: RateQuota,
  limit: number,
): boolean => rateQuota.requestEntries.length > limit;

export const getRetryInAmount = (getUtcDateNow: GetUtcDateNow) => (
  rateQuota: RateQuota,
  ttl: number,
): number => {
  const [oldestRateRequest] = rateQuota.requestEntries
    .slice()
    .sort((a, b) => a.requestedAt.getTime() - b.requestedAt.getTime());

  return oldestRateRequest
    ? getDifferenceInMilliseconds(getUtcDateNow)(oldestRateRequest, ttl)
    : 0;
};
