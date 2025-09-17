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
import { getDesignTokens, mint } from "@/shared/ui/theme";

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
import { GuestSelector } from "./GuestSelector";
import MobileReservation from "@/features/reservations/components/MobileReservationCardEstateDetails";

const darkPalette = getDesignTokens("dark");

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  ...theme.typography.body2,
  padding: theme.spacing(2),
  isolation: "isolate",
  textAlign: "left",
  color: (theme.vars ?? theme).palette.text.primary,

  ...theme.applyStyles("dark", {
    backgroundColor: darkPalette.palette.background.paper,
  }),
}));

interface EstateDetailsMainProps {
  estate: IResidentialEstate | IBusinessEstate;
  unavailableReservationDates: {
    type: "RESERVATION" | "LOCK";
    startDate: Date;
    endDate: Date;
  }[];
  startDateDefault: Date | null;
  endDateDefault: Date | null;
  guestCountDefault: number | null;
  childrenCountDefault: number | null;
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

function EstateDetailsMain({
  estate,
  unavailableReservationDates,
  startDateDefault,
  endDateDefault,
  guestCountDefault,
  childrenCountDefault,
}: EstateDetailsMainProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [startDate, setStartDate] = useState<Date | null>(
    startDateDefault ?? null
  );
  const [endDate, setEndDate] = useState<Date | null>(endDateDefault ?? null);
  const [guestCount, setGuestCount] = useState(guestCountDefault ?? 1);
  const [childrenCount, setChildrenCount] = useState(childrenCountDefault ?? 0);

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
                    blockedDates={unavailableReservationDates}
                  />
                ) : (
                  <MonthRangeCalendar
                    startMonth={startDate}
                    endMonth={endDate}
                    setStartMonth={setStartDate}
                    setEndMonth={setEndDate}
                    blockedDates={unavailableReservationDates}
                  />
                )}
              </>
            )}

            {isBusinessEstate(estate) && (
              <>
                {(estate.maximumLeaseMonths || estate.minimumLeaseMonths) && (
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
                  </Stack>
                )}
                {/* KALENDARRRR MJESECI */}
                <MonthRangeCalendar
                  startMonth={startDate}
                  endMonth={endDate}
                  setStartMonth={setStartDate}
                  setEndMonth={setEndDate}
                  blockedDates={unavailableReservationDates}
                />
              </>
            )}
          </Item>

          {isResidentialEstate(estate) && estate.guestIncluded && (
            <GuestSelector
              maxGuests={estate.guestIncluded + (estate.extraPeople ?? 0)}
              guestCount={guestCount}
              setGuestCount={setGuestCount}
              childrenCount={childrenCount}
              setChildrenCount={setChildrenCount}
            />
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
            guestIncluded={
              isResidentialEstate(estate) ? estate.guestIncluded : undefined
            }
            extraPeople={
              isResidentialEstate(estate) ? estate.extraPeople : undefined
            }
            guestCount={isResidentialEstate(estate) ? guestCount : 0}
            childrenCount={isResidentialEstate(estate) ? childrenCount : 0}
          />
          {/* <Item elevation={4} sx={{ height: 500 }}>
            Detalji Nekretnine
          </Item> */}
          {estate.amenities && (
            <EstateAmenitiesItem amenities={estate.amenities as AmenityKey[]} />
          )}
        </Stack>
      </Grid>
      <Grid flex={1} sx={{ display: { xs: "none", md: "none", lg: "block" } }}>
        <Item
          elevation={2}
          sx={(theme) => ({
            position: "sticky",
            top: "25%",
            p: 2,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #fafafa", // stroke

            ...theme.applyStyles("dark", {
              border: `none`,
            }),
          })}
        >
          <ReservationCard
            defaultStartDate={startDate}
            defaultEndDate={endDate}
            isDisabled={!isValidStay}
            guestCount={guestCount}
            childrenCount={childrenCount}
            isLongTermEstate={estate.rentalType === "Long Term"}
          />
        </Item>
      </Grid>
      {!isDesktop && (
        <MobileReservation
          startDate={startDate}
          endDate={endDate}
          isDisabled={!isValidStay}
          guestCount={guestCount}
          childrenCount={childrenCount}
          isLongTermEstate={estate.rentalType === "Long Term"}
        />
      )}
    </Grid>
  );
}

export default EstateDetailsMain;
