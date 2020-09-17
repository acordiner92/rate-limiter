import { getUtcDateNow, utc, utcDate } from '../src/DateUtil';

describe('DateUtil', () => {
  describe('utc', () => {
    const date = utc(2020, 10, 9, 8, 7, 6, 5);

    test('correct year is set', () => expect(date.getUTCFullYear()).toBe(2020));

    test('correct month is set', () => expect(date.getMonth()).toBe(10));

    test('correct day is set', () => expect(date.getUTCDate()).toBe(9));

    test('correct hour is set', () => expect(date.getUTCHours()).toBe(8));

    test('correct minute is set', () => expect(date.getUTCMinutes()).toBe(7));

    test('correct second is set', () => expect(date.getUTCSeconds()).toBe(6));

    test('correct milliseconds is set', () =>
      expect(date.getUTCMilliseconds()).toBe(5));

    test('set non specified time values to 0', () =>
      expect(utc(2020, 10, 9, 8, 7, 6).getMilliseconds()).toBe(0));
  });
});
