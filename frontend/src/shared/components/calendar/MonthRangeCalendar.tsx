import React, { useState } from "react";
import {
  Box,
  Stack,
  useMediaQuery,
  useTheme,
  IconButton,
  Typography,
} from "@mui/material";
import { isAfter, isBefore, setMonth, setYear, startOfMonth } from "date-fns";
import {
  getBlockedMonthType,
  isValidRangeCalculator,
} from "@/shared/helper/calculateDisabledDates";
import { useAppDispatch } from "@/app/store/hooks";
import { pushNotification } from "@/features/notifications/notificationSlice";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

type MonthRangeCalendarProps = {
  startMonth: Date | null;
  endMonth: Date | null;
  setStartMonth: (date: Date | null) => void;
  setEndMonth: (date: Date | null) => void;
  minDate?: Date;
  blockedDates?: {
    type: "RESERVATION" | "LOCK";
    startDate: Date;
    endDate: Date;
  }[];
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Maj",
  "Jun",
  "Jul",
  "Avg",
  "Sep",
  "Okt",
  "Nov",
  "Dec",
];

const MonthRangeCalendarDual: React.FC<MonthRangeCalendarProps> = ({
  startMonth,
  endMonth,
  setStartMonth,
  setEndMonth,
  minDate = new Date(),
  blockedDates,
}) => {
  const { isRangeValid } = isValidRangeCalculator(blockedDates ?? [], "month");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useAppDispatch();

  const [baseYear, setBaseYear] = useState<number>(
    startMonth?.getFullYear() || new Date().getFullYear()
  );

  const handleMonthClick = (date: Date) => {
    // disable past
    if (isBefore(startOfMonth(date), startOfMonth(minDate))) return;

    // ako nema starta → postavi start
    if (!startMonth) {
      setStartMonth(date);
      setEndMonth(null);
      return;
    }

    // ako postoji start ali nema end → probaj da postaviš end
    if (startMonth && !endMonth) {
      if (!isRangeValid(startMonth, date)) {
        dispatch(
          pushNotification({
            type: "error",
            message: "Izabrani period uključuje blokirane mjesece.",
          })
        );
        setStartMonth(null);
        setEndMonth(null);
        return;
      }

      if (date < startMonth) {
        // ako klikneš prije starta → reset na novi start
        setStartMonth(date);
        setEndMonth(null);
        return;
      }

      setEndMonth(date);
      return;
    }

    // ako već postoji i start i end → resetuj range na novi start
    setStartMonth(date);
    setEndMonth(null);
  };

  const isInRange = (monthDate: Date) =>
    startMonth && endMonth
      ? isAfter(monthDate, startMonth) && isBefore(monthDate, endMonth)
      : false;

  const isStartOrEnd = (monthDate: Date) =>
    (startMonth &&
      startMonth.getMonth() === monthDate.getMonth() &&
      startMonth.getFullYear() === monthDate.getFullYear()) ||
    (endMonth &&
      endMonth.getMonth() === monthDate.getMonth() &&
      endMonth.getFullYear() === monthDate.getFullYear());

  const renderYearGrid = (year: number) => (
    <Box key={year} sx={{ flex: 1 }}>
      <Box
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 1,
          bgcolor: "action.hover",
          borderRadius: 1,
          py: 0.5,
        }}
      >
        {year}
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
          gap: 1,
        }}
      >
        {months.map((label, idx) => {
          const date = setMonth(setYear(new Date(), year), idx);
          const type = blockedDates
            ? getBlockedMonthType(date, blockedDates)
            : null;
          const isBeforeMin = isBefore(
            startOfMonth(date),
            startOfMonth(minDate)
          );

          return (
            <Box
              key={`${year}-${idx}`}
              onClick={() => !type && !isBeforeMin && handleMonthClick(date)}
              sx={{
                px: 2,
                py: 1,
                textAlign: "center",
                borderRadius: 2,
                cursor: type || isBeforeMin ? "not-allowed" : "pointer",
                bgcolor: isStartOrEnd(date)
                  ? theme.palette.primary.main
                  : isInRange(date)
                  ? theme.palette.primary.light
                  : type === "LOCK"
                  ? theme.palette.error.light
                  : type === "RESERVATION"
                  ? theme.palette.warning.light
                  : isBeforeMin
                  ? "action.disabledBackground"
                  : "action.hover",
                color: isStartOrEnd(date)
                  ? theme.palette.primary.contrastText
                  : isBeforeMin
                  ? "text.disabled"
                  : "text.primary",
                position: "relative",
                "&::after": {
                  content:
                    type === "LOCK"
                      ? '"🔒"'
                      : type === "RESERVATION"
                      ? '"🏠"'
                      : '""',
                  position: "absolute",
                  fontSize: "0.7rem",
                  bottom: 2,
                  right: 4,
                },
              }}
            >
              {label}
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: "background.paper", p: 2 }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <IconButton
          onClick={() => setBaseYear((prev) => prev - 1)}
          disabled={baseYear - 1 < minDate.getFullYear()}
        >
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6">Izaberite raspon</Typography>
        <IconButton onClick={() => setBaseYear((prev) => prev + 1)}>
          <ChevronRight />
        </IconButton>
      </Stack>

      <Stack direction={isSmallScreen ? "column" : "row"} spacing={3}>
        {renderYearGrid(baseYear)}
        {renderYearGrid(baseYear + 1)}
      </Stack>
    </Box>
  );
};

export default MonthRangeCalendarDual;
