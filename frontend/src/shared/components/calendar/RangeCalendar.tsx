import React, { useState } from "react";
import { useAppDispatch } from "@/app/store/hooks";
import { pushNotification } from "@/features/notifications/notificationSlice";

import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import {
  Box,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";

import {
  isSameDay,
  isBefore,
  isAfter,
  format,
  addMonths,
  subMonths,
} from "date-fns";

import { sr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { mint } from "@/shared/ui/theme";
import {
  getBlockedDayType,
  isValidRangeCalculator,
} from "@/shared/helper/calculateDisabledDates";

type RangeCalendarProps = {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  activeInput?: "start" | "end" | null; // 🟦 Fokusirani input
  minDate?: Date;
  blockedDates?: {
    type: "RESERVATION" | "LOCK";
    status?: "pending" | "confirmed";
    startDate: Date;
    endDate: Date;
  }[];
  readonly?: boolean;
  lockStartDate?: boolean;
};

const changeMonth = (currentMonth: Date, direction: "next" | "prev") => {
  return direction === "next"
    ? addMonths(currentMonth, 1)
    : subMonths(currentMonth, 1);
};

const RangeCalendar: React.FC<RangeCalendarProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  activeInput = null,
  minDate = new Date(),
  blockedDates,
  readonly,
  lockStartDate,
}) => {
  const { isRangeValid } = isValidRangeCalculator(blockedDates ?? [], "day");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useAppDispatch();
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startDate || new Date()
  );
  const [nextMonth, setNextMonth] = useState<Date>(() => {
    return addMonths(currentMonth, 1);
  });

  const handleDateChange = (date: Date | null) => {
    if (!date) return;

    if (activeInput === "start") {
      setStartDate(date);
      setEndDate(null);
      return;
    }

    if (activeInput === "end") {
      if (!startDate || date < startDate) {
        setStartDate(date);
        setEndDate(null);
      } else {
        setEndDate(date);
      }
      return;
    }

    if (lockStartDate) {
      if (!startDate) return;
      if (date <= startDate) {
        // ne može unazad
        return;
      }
      setEndDate(date);
      return;
    }

    if (!endDate && startDate && !activeInput) {
      // validacija ovdje
      if (!isRangeValid(startDate, date)) {
        dispatch(
          pushNotification({
            type: "error",
            message: "Izabrani period uključuje blokirane dane.",
          })
        );
        setStartDate(null);
        return;
      }
      setEndDate(date);
    }

    // Fallback ako nije poznato koji je input kliknut
    if (!startDate || endDate) {
      setStartDate(date);
      setEndDate(null);
    } else if (date < startDate) {
      setStartDate(date);
      setEndDate(null);
    } else {
      setEndDate(date);
    }
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => changeMonth(prev, direction));
    setNextMonth((prev) => changeMonth(prev, direction));
  };

  const isInRange = (day: Date) =>
    startDate && endDate
      ? isAfter(day, startDate) && isBefore(day, endDate)
      : false;

  const isStartOrEndDate = (day: Date) =>
    (startDate && isSameDay(day, startDate)) ||
    (endDate && isSameDay(day, endDate));

  const calendarStyles = {
    ".MuiPickersDay-root.Mui-selected": {
      backgroundColor: "transparent",
    },
    ".MuiPickersArrowSwitcher-root": {
      display: "none",
    },
    bgcolor: "background.paper",
    color: "text.primary",
  };

  const renderCalendar = (month: Date) => (
    <DateCalendar
      value={month}
      onChange={handleDateChange}
      disableHighlightToday
      disablePast
      readOnly={readonly}
      minDate={minDate}
      views={["day"]}
      sx={calendarStyles}
      slots={{
        day: (props: PickersDayProps<Date>) => {
          const { day, outsideCurrentMonth, ...rest } = props;

          const blocked = blockedDates
            ? getBlockedDayType(day, blockedDates)
            : null;

          return (
            <PickersDay
              {...rest}
              day={day}
              outsideCurrentMonth={outsideCurrentMonth}
              selected={false}
              disabled={props.disabled || !!blocked?.type} // ne može klik ako je blokiran
              sx={{
                ...(isStartOrEndDate(day) && {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.getContrastText(
                    theme.palette.primary.main
                  ),
                }),
                ...(isInRange(day) && {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.getContrastText(
                    theme.palette.primary.main
                  ),
                }),
                ...(blocked?.type === "LOCK" && {
                  backgroundColor: theme.palette.info.light,
                  color: theme.palette.getContrastText(
                    theme.palette.info.light
                  ),
                  position: "relative",
                  "&::after": {
                    content: '"🔒"',
                    position: "absolute",
                    fontSize: "0.7rem",
                    bottom: 2,
                    right: 2,
                  },
                }),
                ...(blocked?.type === "RESERVATION" && {
                  backgroundColor: theme.palette.warning.light,
                  color: theme.palette.getContrastText(
                    theme.palette.warning.light
                  ),
                  position: "relative",
                  "&::after": {
                    content: '"🏠"',
                    position: "absolute",
                    fontSize: "0.7rem",
                    bottom: 2,
                    right: 2,
                  },
                }),
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark" ? mint[900] : mint[100],
                  color: theme.palette.getContrastText(
                    theme.palette.mode === "dark" ? mint[900] : mint[100]
                  ),
                },
              }}
            />
          );
        },
      }}
      dayOfWeekFormatter={(weekday) => format(weekday, "eee", { locale: sr })}
    />
  );

  return (
    <Box sx={{ bgcolor: "background.paper", color: "text.primary" }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        {currentMonth > new Date() && (
          <IconButton onClick={() => handleMonthChange("prev")}>
            <ChevronLeft />
          </IconButton>
        )}
        <IconButton onClick={() => handleMonthChange("next")}>
          <ChevronRight />
        </IconButton>
      </Stack>

      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          gap: 2,
        }}
      >
        {renderCalendar(currentMonth)}
        {!isSmallScreen && renderCalendar(nextMonth)}
      </Box>
    </Box>
  );
};

export default RangeCalendar;
