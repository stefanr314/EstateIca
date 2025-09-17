import {
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  areIntervalsOverlapping,
} from "date-fns";

type BlockedDate = {
  type: "RESERVATION" | "LOCK";
  startDate: Date;
  endDate: Date;
};

type Mode = "day" | "month";

export function getBlockedMonthType(
  month: Date,
  blocked: BlockedDate[]
): "LOCK" | "RESERVATION" | null {
  const found = blocked.find((range) =>
    isWithinInterval(month, {
      start: startOfMonth(range.startDate),
      end: endOfMonth(range.endDate),
    })
  );
  return found ? found.type : null;
}

export function getBlockedDayType(
  day: Date,
  blockedDates: BlockedDate[]
): "RESERVATION" | "LOCK" | null {
  const found = blockedDates.find((range) =>
    isWithinInterval(day, { start: range.startDate, end: range.endDate })
  );
  return found ? found.type : null;
}

export function isMonthRangeValid(
  start: Date,
  end: Date,
  blocked: BlockedDate[]
) {
  return !blocked.some(
    (range) =>
      isWithinInterval(range.startDate, { start, end }) ||
      isWithinInterval(range.endDate, { start, end })
  );
}

export function isValidRangeCalculator(
  blockedDates: BlockedDate[],
  mode: Mode
) {
  // Normalizacija za početak/kraj prema modu
  const normStart = (d: Date) => (mode === "month" ? startOfMonth(d) : d);
  const normEnd = (d: Date) => (mode === "month" ? endOfMonth(d) : d);

  function isRangeValid(start: Date, end: Date): boolean {
    if (!start || !end) return true;

    // Normalizuj izabrani opseg
    const sel = { start: normStart(start), end: normEnd(end) };

    // Bilo koji preklop sa bilo kojom blokadom → nevalidno
    return !blockedDates.some((range) => {
      const blk = {
        start: normStart(range.startDate),
        end: normEnd(range.endDate),
      };
      // inclusive:true znači da i “dodir na granici” računa kao overlap
      return areIntervalsOverlapping(sel, blk, { inclusive: true });
    });
  }

  return { isRangeValid };
}
