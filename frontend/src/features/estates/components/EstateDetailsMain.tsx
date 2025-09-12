import { useState } from "react";

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import {
  Divider,
  MenuItem,
  Paper,
  Select,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { getDesignTokens } from "@/shared/ui/theme";

import EstateTextDetailsItem from "./EstateTextDeatilsItem";
import EstateAmenitiesItem from "./EstatesAmenitiesItem";
import ReservationCard from "@/features/reservations/components/ReservationCardEstateDetails";
import RangeCalendar from "@/shared/components/calendar/RangeCalendar";
import { BusinessPropertyDetails } from "./BusinessEstatePropertyDetails";
import { PropertyDetailsItem } from "./EstatePropertyDetails";
import { EstatePriceCard } from "./EstatePriceDetails";
import { IBusinessEstate, IResidentialEstate } from "../types";
import { AmenityKey } from "@/shared/constants/amenitiesMap";
import { differenceInDays, differenceInMonths, addMonths } from "date-fns";

import {
  isResidentialEstate,
  isBusinessEstate,
} from "@/shared/helper/determineEstateType";
import { CalendarMonth } from "@mui/icons-material";
import MonthRangeCalendar from "@/shared/components/calendar/MonthRangeCalendar";

const darkPalette = getDesignTokens("dark");

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "left",
  color: (theme.vars ?? theme).palette.text.primary,

  ...theme.applyStyles("dark", {
    backgroundColor: darkPalette.palette.background.paper,
  }),
}));

interface EstateDetailsMainProps {
  estate: IResidentialEstate | IBusinessEstate;
}

const getStayLengthInDays = (start: Date | null, end: Date | null) =>
  start && end ? differenceInDays(end, start) : 0;

function getSmartMonthCount(start: Date, end: Date): number {
  const fullMonths = differenceInMonths(end, start);
  const monthAfterStart = addMonths(start, fullMonths);
  const remainingDays = differenceInDays(end, monthAfterStart);

  // Ako ostatak preko punih mjeseci prelazi npr. 5 dana, dodaćemo još 1 mjesec
  const GRACE_DAYS = 5;

  return remainingDays > GRACE_DAYS ? fullMonths + 1 : fullMonths;
}

export { getSmartMonthCount };

function EstateDetailsMain({ estate }: EstateDetailsMainProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.up("md"));
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guestCount, setGuestCount] = useState(1);

  let isValidStay: boolean = true;

  if (isResidentialEstate(estate)) {
    const stayLength =
      estate.rentalType === "Short Term"
        ? getStayLengthInDays(startDate, endDate)
        : startDate && endDate
        ? getSmartMonthCount(startDate, endDate)
        : 0;
    isValidStay =
      stayLength >= estate.minimumStay &&
      (estate.maximumStay === undefined || stayLength <= estate.maximumStay);
  }
  if (isBusinessEstate(estate)) {
    const leaseMontsLength =
      startDate && endDate ? getSmartMonthCount(startDate, endDate) : 0;
    isValidStay =
      estate.minimumLeaseMonths === undefined ||
      (estate.minimumLeaseMonths <= leaseMontsLength &&
        (estate.maximumLeaseMonths === undefined ||
          estate.maximumLeaseMonths >= leaseMontsLength));
  }

  return (
    <Grid container spacing={3}>
      <Grid flex={1}>
        <Stack
          spacing={2}
          sx={{
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          <EstateTextDetailsItem estate={estate} />
          {isResidentialEstate(estate) && (
            <PropertyDetailsItem
              guestCapacity={estate.guestIncluded}
              extraPeople={estate.extraPeople}
              beds={estate.beds}
              bathrooms={estate.bathrooms}
              roomType={estate.roomType}
              rentalType={estate.rentalType}
              residentialType={estate.residentialType}
              area={estate.area}
              unitsAvailable={estate.unitsAvailable}
              petAllowance={estate.petAllowance}
            />
          )}
          {isBusinessEstate(estate) && (
            <BusinessPropertyDetails
              unitsAvailable={estate.unitsAvailable}
              area={estate.area}
              intentedUse={estate.intentedUse}
              floor={estate.floor}
              hasElevator={estate.hasElevator}
              isGroundFloor={estate.isGroundFloor}
              ceilingHeight={estate.ceilingHeight}
              hasParking={estate.hasParking}
              parkingSpaces={estate.parkingSpaces}
              hasRestroom={estate.hasRestroom}
              minimumLeaseMonths={estate.minimumLeaseMonths}
              maximumLeaseMonths={estate.maximumLeaseMonths}
              airConditioning={estate.airConditioning}
              internetReady={estate.internetReady}
            />
          )}
          <Item elevation={4} sx={{ p: 2 }}>
            <Typography variant="h5" pb={2}>
              Duzina boravka
            </Typography>
            <Divider />
            {isResidentialEstate(estate) && (
              <>
                <Stack
                  direction="row"
                  spacing={3}
                  py={2}
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      bgcolor: "action.hover",
                    }}
                  >
                    <CalendarMonth fontSize="small" color="primary" />
                    <Typography variant="body2" fontWeight={500}>
                      Minimalna: {estate.minimumStay}
                    </Typography>
                  </Stack>

                  {estate.maximumStay && (
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                      }}
                    >
                      <CalendarMonth fontSize="small" color="primary" />
                      <Typography variant="body2" fontWeight={500}>
                        Maksimalna: {estate.maximumStay}
                      </Typography>
                    </Stack>
                  )}
                </Stack>

                {estate.rentalType === "Short Term" ? (
                  <RangeCalendar
                    startDate={startDate}
                    setStartDate={(date) => setStartDate(date)}
                    endDate={endDate}
                    setEndDate={(date) => setEndDate(date)}
                  />
                ) : (
                  <MonthRangeCalendar
                    startMonth={startDate}
                    endMonth={endDate}
                    onStartMonthChange={setStartDate}
                    onEndMonthChange={setEndDate}
                  />
                )}
              </>
            )}

            {isBusinessEstate(estate) &&
              (estate.maximumLeaseMonths || estate.minimumLeaseMonths) && (
                <Stack direction={"row"} gap={3}>
                  {estate.minimumLeaseMonths && (
                    <Typography variant="body2">
                      Minimalna duzina izdavanja u mjesecima:{" "}
                      {estate.minimumLeaseMonths}
                    </Typography>
                  )}
                  {estate.maximumLeaseMonths && (
                    <Typography variant="body1">
                      Maksimalna duzina izdavanja u mjesecima:
                      {estate.maximumLeaseMonths}
                    </Typography>
                  )}
                  {/* KALENDARRRR MJESECI */}
                  <MonthRangeCalendar
                    startMonth={startDate}
                    endMonth={endDate}
                    onStartMonthChange={setStartDate}
                    onEndMonthChange={setEndDate}
                  />
                </Stack>
              )}
          </Item>

          {isResidentialEstate(estate) && estate.guestIncluded && (
            <Item elevation={4} sx={{ p: 2, mt: 2 }}>
              <Typography variant="h5" pb={1}>
                Broj gostiju
              </Typography>
              <Divider />
              <Stack direction="row" gap={2} alignItems="center" pt={1}>
                <Typography variant="body2">Izaberite broj gostiju:</Typography>
                <Select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  sx={{ minWidth: 120 }}
                >
                  {Array.from(
                    {
                      length: estate.guestIncluded + (estate.extraPeople || 0),
                    },
                    (_, i) => {
                      const val = i + 1;
                      const isExtra = val > estate.guestIncluded;
                      return (
                        <MenuItem key={val} value={val}>
                          {val} gost{val > 1 ? "i" : ""}{" "}
                          {isExtra ? "(Extra)" : ""}
                        </MenuItem>
                      );
                    }
                  )}
                </Select>
              </Stack>
            </Item>
          )}
          <EstatePriceCard
            rentalType={estate.rentalType}
            price={
              estate.rentalType === "Short Term"
                ? estate.pricePerNight!
                : estate.pricePerMonth!
            }
            stayLength={
              estate.rentalType === "Short Term"
                ? getStayLengthInDays(startDate, endDate)
                : startDate && endDate
                ? getSmartMonthCount(startDate, endDate)
                : 0
            }
          />
          {/* <Item elevation={4} sx={{ height: 500 }}>
            Detalji Nekretnine
          </Item> */}
          {estate.amenities && (
            <EstateAmenitiesItem amenities={estate.amenities as AmenityKey[]} />
          )}
        </Stack>
      </Grid>
      <Grid flex={1} sx={{ display: { xs: "none", md: "block" } }}>
        <Box
          sx={{
            position: "sticky",
            top: "25%",
            padding: 2,
            bgcolor: "secondary.main",
            height: "30rem",
          }}
        >
          <ReservationCard
            defaultStartDate={startDate}
            defaultEndDate={endDate}
            isDisabled={!isValidStay}
            guestCount={guestCount}
            isLongTermEstate={estate.rentalType === "Long Term"}
          />
        </Box>
      </Grid>
      {!isMobile && (
        <Item
          sx={{
            position: "fixed",
            width: "100%",
            left: 0,
            bottom: 0,
            padding: 2,
            bgcolor: "secondary.main",
            height: "5rem",
            zIndex: 1000,
          }}
        >
          Rezervisi Kartica
        </Item>
      )}
    </Grid>
  );
}

export default EstateDetailsMain;
