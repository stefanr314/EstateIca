import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface MonthRangePickerProps {
  startMonth: Date | null;
  endMonth: Date | null;
  onStartMonthChange: (date: Date | null) => void;
  onEndMonthChange: (date: Date | null) => void;
}

export default function MonthRangePicker({
  startMonth,
  endMonth,
  onStartMonthChange,
  onEndMonthChange,
}: MonthRangePickerProps) {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <DatePicker
        views={["year", "month"]}
        label="Start month"
        value={startMonth}
        onChange={onStartMonthChange}
        minDate={new Date()}
      />
      <DatePicker
        views={["year", "month"]}
        label="End month"
        value={endMonth}
        onChange={onEndMonthChange}
        minDate={startMonth ?? undefined} // zabrani da end < start
      />
    </div>
  );
}
