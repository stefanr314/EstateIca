import { MonthCalendar } from "@mui/x-date-pickers";
import { useTheme } from "@mui/material/styles";
import { getBlockedMonthType } from "@/shared/helper/calculateDisabledDates";

export default function CustomMonthCalendar({
  value,
  onChange,
  blockedDates,
}: {
  value: Date | null;
  onChange: (date: Date | null) => void;
  blockedDates?: {
    type: "RESERVATION" | "LOCK";
    startDate: Date;
    endDate: Date;
  }[];
}) {
  const theme = useTheme();

  return (
    <MonthCalendar
      value={value}
      onChange={onChange}
      disablePast
      slotProps={{
        monthButton: {
          sx: {
            "&.Mui-disabled": {
              backgroundColor: theme.palette.action.disabledBackground,
            },
            "&.blocked-lock": {
              backgroundColor: theme.palette.error.light,
              color: theme.palette.getContrastText(theme.palette.error.light),
            },
            "&.blocked-reservation": {
              backgroundColor: theme.palette.warning.light,
              color: theme.palette.getContrastText(theme.palette.warning.light),
            },
          },
        },
      }}
      shouldDisableMonth={(date) => {
        const type = blockedDates
          ? getBlockedMonthType(date, blockedDates)
          : null;
        return !!type; // onemogući klik
      }}
    />
  );
}
