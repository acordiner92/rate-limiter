export const utc = (
  year: number,
  month: number,
  date = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  ms = 0,
): Date => new Date(Date.UTC(year, month, date, hours, minutes, seconds, ms));

export const utcDate = (date: Date): Date =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000);

export const getUtcDateNow = (): Date => utcDate(new Date());
export type GetUtcDateNow = typeof getUtcDateNow;
