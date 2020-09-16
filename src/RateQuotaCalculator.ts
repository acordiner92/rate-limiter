import { GetUtcDateNow } from './DateUtil';
import { RateQuota, RequestEntry } from './RateQuota';

const getDifferenceInMilliseconds = (getUtcDateNow: GetUtcDateNow) => (
  requestEntry: RequestEntry,
  rateDuration: number,
): number =>
  requestEntry.requestedAt.getTime() -
  (getUtcDateNow().getTime() - 1000 * rateDuration);
export const hasRateLimitExceeded = (
  rateQuota: RateQuota,
  requestLimit: number,
): boolean => rateQuota.requestEntries.length > requestLimit;

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
