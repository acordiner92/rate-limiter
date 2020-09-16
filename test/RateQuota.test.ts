import {
  removeExpiredRequestEntries,
  addNewRequestEntryToRateQuota,
  init,
} from '../src/RateQuota';
import { utc } from '../src/DateUtil';

describe('RateQuota', () => {
  const oneHr = 3600000;

  describe('init', () => {
    test('Creates a new rate quota', () =>
      expect(init()).toStrictEqual({
        requestEntries: [],
      }));
  });

  describe('removeExpiredRequestEntries', () => {
    const getUtcDateNow = (): Date => utc(2020, 10, 10, 8, 10);

    test('if no request entries have expired then same number of request entries should be returned', () => {
      const nonExpiredRateRequest = {
        requestedAt: utc(2020, 10, 10, 7, 30, 0), // 40min and 0s ago
      };

      expect(
        removeExpiredRequestEntries(getUtcDateNow)(
          { requestEntries: [nonExpiredRateRequest] },
          oneHr,
        ),
      ).toStrictEqual({
        requestEntries: [nonExpiredRateRequest],
      });
    });

    test('if all the request entries have expired then no request entries should be returned (time inclusive)', () => {
      const expiredRequestEntry = {
        requestedAt: utc(2020, 10, 10, 7, 10), // 60min ago
      };

      expect(
        removeExpiredRequestEntries(getUtcDateNow)(
          { requestEntries: [expiredRequestEntry] },
          oneHr,
        ),
      ).toStrictEqual({
        requestEntries: [],
      });
    });

    test('if some of the request entries have expired then only non expired request entries should be returned', () => {
      const expiredRequestEntry = {
        requestedAt: utc(2020, 10, 10, 7, 8, 0), // 62min ago
      };
      const nonExpiredRequestEntry = {
        requestedAt: utc(2020, 10, 10, 7, 38, 0), // 30min ago
      };

      expect(
        removeExpiredRequestEntries(getUtcDateNow)(
          { requestEntries: [expiredRequestEntry, nonExpiredRequestEntry] },
          oneHr,
        ),
      ).toStrictEqual({
        requestEntries: [nonExpiredRequestEntry],
      });
    });
  });

  describe('addNewRequestEntryToRateQuota', () => {
    test('new request entry is added to rate quota', () => {
      const newRequestedAt = utc(2020, 10, 10, 8, 10);
      const existingRateEntry = {
        requestedAt: utc(2020, 10, 10, 8, 0),
      };
      const rateQuota = {
        requestEntries: [existingRateEntry],
      };

      expect(
        addNewRequestEntryToRateQuota(rateQuota, newRequestedAt),
      ).toStrictEqual({
        requestEntries: [
          existingRateEntry,
          {
            requestedAt: newRequestedAt,
          },
        ],
      });
    });
  });
});
