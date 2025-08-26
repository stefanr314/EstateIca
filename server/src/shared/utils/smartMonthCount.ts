import { differenceInMonths, differenceInDays, addMonths } from "date-fns";

function getSmartMonthCount(start: Date, end: Date): number {
  const fullMonths = differenceInMonths(end, start);
  const monthAfterStart = addMonths(start, fullMonths);
  const remainingDays = differenceInDays(end, monthAfterStart);

  // Ako ostatak preko punih mjeseci prelazi npr. 5 dana, dodaćemo još 1 mjesec
  const GRACE_DAYS = 5;

  return remainingDays > GRACE_DAYS ? fullMonths + 1 : fullMonths;
}

export { getSmartMonthCount };
