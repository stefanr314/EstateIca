import React, { useState } from "react";
import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { Box, IconButton, Stack, useMediaQuery, useTheme } from "@mui/material";
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

type RangeCalendarProps = {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  activeInput?: "start" | "end" | null; // 🟦 Fokusirani input
  minDate?: Date;
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
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
  };

  const renderCalendar = (month: Date) => (
    <DateCalendar
      value={month}
      onChange={handleDateChange}
      disableHighlightToday
      disablePast
      minDate={minDate}
      views={["day"]}
      sx={calendarStyles}
      slots={{
        day: (props: PickersDayProps<Date>) => {
          const { day, outsideCurrentMonth, ...rest } = props;
          return (
            <PickersDay
              {...rest}
              day={day}
              outsideCurrentMonth={outsideCurrentMonth}
              selected={false}
              sx={{
                ...(isStartOrEndDate(day) && {
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }),
                ...(isInRange(day) && {
                  backgroundColor: theme.palette.primary.light,
                  color: "white",
                }),
                "&:hover": {
                  backgroundColor: theme.palette.mint?.light || "#c8f3e1",
                  color: "black",
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
    <Box>
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

// const handleDateChange = (date: Date | null) => {
//   if (!selectedStartDate) {
//     setSelectedStartDate(date);
//     arrivalInputClicked.current = false; // Resetuj fleg nakon promjene
//     return;
//   }
//   if (selectedStartDate && arrivalInputClicked.current) {
//     setSelectedStartDate(date);
//     setSelectedEndDate(null);
//     arrivalInputClicked.current = false; // Resetuj fleg nakon promjene
//     return;
//   }
//   if (date && date > selectedStartDate) {
//     setSelectedEndDate(date);
//     return;
//   }
//   if (date && selectedStartDate && date < selectedStartDate) {
//     setSelectedStartDate(date);
//     setSelectedEndDate(null);
//     setStartDateInput(date ? date.toLocaleDateString() : "");
//     return;
//   }
// };
