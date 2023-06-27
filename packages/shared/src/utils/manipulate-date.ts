interface Params {
  minutes: number;
  hours: number;
  days: number;
  weeks: number;
  months: number;
  years: number;
}

/**
 *
 * @param date date to manipulate
 * @param params
 * @returns manipulated date
 * @example
 * const date = new Date();
 * const newDate = manipulateDate(date, { minutes: 10, hours: 1, days: 1, weeks: 1, months: 1, years: 1 });
 *
 * console.log(date); // 2021-01-01T00:00:00
 * console.log(newDate); // 2022-02-02T01:10:00
 */
export const manipulateDate = (date: Date, params: Partial<Params>) => {
  const {
    minutes = 0,
    hours = 0,
    days = 0,
    weeks = 0,
    months = 0,
    years = 0,
  } = params;

  const newDate = new Date(date);

  newDate.setMinutes(newDate.getMinutes() + minutes);
  newDate.setHours(newDate.getHours() + hours);
  newDate.setDate(newDate.getDate() + days);
  newDate.setDate(newDate.getDate() + weeks * 7);
  newDate.setMonth(newDate.getMonth() + months);
  newDate.setFullYear(newDate.getFullYear() + years);

  return newDate;
};
