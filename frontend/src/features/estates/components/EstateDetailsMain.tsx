import { use, useEffect, useState } from "react";

import { useTheme } from "@mui/material/styles";
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
import CalendarMonth from "@mui/icons-material/CalendarMonth";

import EstateTextDetailsItem from "./EstateTextDeatilsItem";
import EstateAmenitiesItem from "./EstatesAmenitiesItem";
import ReservationCard from "@/features/reservations/components/ReservationCardEstateDetails";
import RangeCalendar from "@/shared/components/calendar/RangeCalendar";
import { BusinessPropertyDetails } from "./BusinessEstatePropertyDetails";
import { PropertyDetailsItem } from "./EstatePropertyDetails";
import { EstatePriceCard } from "./EstatePriceDetails";
import { IBusinessEstate, IResidentialEstate } from "../types";
import { AmenityKey } from "@/shared/constants/amenitiesMap";

import { differenceInDays } from "date-fns";
import { getSmartMonthCount } from "@/shared/helper/getSmartMonthCalculator";

import {
  isResidentialEstate,
  isBusinessEstate,
} from "@/shared/helper/determineEstateType";
import MonthRangeCalendar from "@/shared/components/calendar/MonthRangeCalendar";
import { GuestSelector } from "./GuestSelector";
import MobileReservation from "@/features/reservations/components/MobileReservationCardEstateDetails";
import { useAppDispatch } from "@/app/store/hooks";
import { useDefaultDates } from "@mui/x-date-pickers/internals";
import { setReservation } from "@/features/reservations/reservationSlice";

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
  isHostOfSelectedEstate?: boolean;
}

const getStayLengthInDays = (start: Date | null, end: Date | null) =>
  start && end ? differenceInDays(end, start) : 0;

function EstateDetailsMain({
  estate,
  unavailableReservationDates,
  startDateDefault,
  endDateDefault,
  guestCountDefault,
  childrenCountDefault,
  isHostOfSelectedEstate,
}: EstateDetailsMainProps) {
  const dispatch = useAppDispatch();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [startDate, setStartDate] = useState<Date | null>(
    startDateDefault ?? null
  );
  const [endDate, setEndDate] = useState<Date | null>(endDateDefault ?? null);
  const [guestCount, setGuestCount] = useState(guestCountDefault ?? 1);
  const [childrenCount, setChildrenCount] = useState(childrenCountDefault ?? 0);
  const [businessUnitCount, setBusinessUnitCount] = useState<
    number | undefined
  >(isBusinessEstate(estate) ? 1 : undefined);

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

  useEffect(() => {
    dispatch(
      setReservation({
        estateId: estate._id,
        estateTitle: estate.title,
        estateAddress: `${estate.address.street || "-"}, ${
          estate.address.city
        } ${estate.address.country}`,
        estateType: estate.estateType,
      })
    );
  }, [estate, dispatch]);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: isHostOfSelectedEstate ? 12 : 8 }}>
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

          {isBusinessEstate(estate) && (
            <Item elevation={4} sx={{ p: 2 }}>
              <Typography variant="h4">Izaberite broj jedinica</Typography>
              <Select
                value={businessUnitCount}
                onChange={(e) => setBusinessUnitCount(Number(e.target.value))}
                sx={{ minWidth: 80 }}
              >
                {Array.from(
                  { length: estate.unitsAvailable },
                  (_, i) => i + 1
                ).map((val) => (
                  <MenuItem key={val} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="text.secondary">
                Podrazumijevano 1 – prilagodite ako vam treba više jedinica.
              </Typography>
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
      {!isHostOfSelectedEstate && (
        <Grid
          size={{ xs: 12, lg: 4 }}
          sx={{ display: { xs: "none", md: "none", lg: "block" } }}
        >
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
              guestCount={isResidentialEstate(estate) ? guestCount : undefined}
              childrenCount={
                isResidentialEstate(estate) ? childrenCount : undefined
              }
              unitCount={businessUnitCount}
              isLongTermEstate={estate.rentalType === "Long Term"}
            />
          </Item>
        </Grid>
      )}

      {!isHostOfSelectedEstate && !isDesktop && (
        <MobileReservation
          startDate={startDate}
          endDate={endDate}
          isDisabled={!isValidStay}
          guestCount={isResidentialEstate(estate) ? guestCount : undefined}
          childrenCount={
            isResidentialEstate(estate) ? childrenCount : undefined
          }
          unitCount={businessUnitCount}
          isLongTermEstate={estate.rentalType === "Long Term"}
        />
      )}
    </Grid>
  );
}

export default EstateDetailsMain;
