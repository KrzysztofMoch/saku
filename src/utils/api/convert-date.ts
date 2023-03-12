const fillZero = (number: number) => {
  return number < 10 ? `0${number}` : number;
};

/**
 * Convert Date to string in UTC time
 * @param date Date
 * @returns string
 * @example
 * const date = new Date();
 * const dateInUTC = convertDate(date);
 *
 * console.log(dateInUTC); // 2021-01-01T00:00:00
 */
const convertDate = (date: Date) => {
  // date must be in UTC time
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  // pattern: ^\d{4}-[0-1]\d-([0-2]\d|3[0-1])T([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$
  // example: 2021-01-01T00:00:00
  return `${year}-${fillZero(month)}-${fillZero(day)}T${fillZero(
    hours,
  )}:${fillZero(minutes)}:${fillZero(seconds)}`;
};

export default convertDate;
