import React, { Suspense, useEffect, useMemo, useState } from "react";

const RangeCalendar = React.lazy(
  () => import("@/shared/components/calendar/RangeCalendar")
);
const MonthRangeCalendarDual = React.lazy(
  () => import("@/shared/components/calendar/MonthRangeCalendar")
);

import { differenceInDays, format } from "date-fns";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

import ScheduleIcon from "@mui/icons-material/Schedule";
import Cancel from "@mui/icons-material/Cancel";
import EditCalendar from "@mui/icons-material/EditCalendar";
import AddCircle from "@mui/icons-material/AddCircle";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Group from "@mui/icons-material/Group";
import Home from "@mui/icons-material/Home";

import {
  IReservation,
  IReservationPopulated,
  ReservationStatus,
} from "../types";
import { getSmartMonthCount } from "@/shared/helper/getSmartMonthCalculator";
import { GuestSelector } from "@/features/estates/components/GuestSelector";
import { useEstateUnavailableDates } from "@/features/estates/hooks/useEstate";
import {
  useCancelReservation,
  useExtendReservation,
  useUpdateBusinessReservationUnitCount,
  useUpdateReservationDate,
  useUpdateResidentialGuestCount,
} from "../hook/useReservations";
import { srLatn } from "date-fns/locale";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router";

interface Props {
  reservation: IReservationPopulated;
}

const getStayLengthInDays = (start: Date | null, end: Date | null) =>
  start && end ? differenceInDays(end, start) : 0;

const UserReservationActions: React.FC<Props> = ({ reservation }) => {
  const navigate = useNavigate();

  const estateId = reservation.estateReserved._id;

  const { data: blockedDates } = useEstateUnavailableDates(
    estateId,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
    { reservationId: reservation._id }
  );

  const { mutate: cancelReservation, isPending: isCancelling } =
    useCancelReservation();
  const { mutate: updateReservationDates, isPending: isUpdatingDates } =
    useUpdateReservationDate();
  const { mutate: extendReservation, isPending: isExtending } =
    useExtendReservation();
  const { mutate: updateGuestCount, isPending: isUpdatingGuests } =
    useUpdateResidentialGuestCount();
  const { mutate: updateBusinessUnitCount, isPending: isUnitCountUpdate } =
    useUpdateBusinessReservationUnitCount();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const [newStartDate, setNewStartDate] = useState<Date | null>(
    reservation.startDate ? new Date(reservation.startDate) : null
  );
  const [newEndDate, setNewEndDate] = useState<Date | null>(
    reservation.endDate ? new Date(reservation.endDate) : null
  );

  const [guestCount, setGuestCount] = useState(reservation.guestCount ?? 1);
  const [childrenCount, setChildrenCount] = useState(
    reservation.childrenCount ?? 0
  );

  const [unitCount, setUnitCount] = useState(reservation.unitCount ?? 1);

  const [note, setNote] = useState<string>("");

  const estateReserved = reservation.estateReserved;
  const isShortTerm = reservation.rentalType === "Short Term";
  const isLongTerm = reservation.rentalType === "Long Term";
  const isBusiness = estateReserved.estateType === "BusinessEstate";
  const isResidential = estateReserved.estateType === "ResidentialEstate";

  const isPendingChangeUpdate = reservation.pendingChange !== undefined;
  const isExtension =
    new Date(reservation.startDate) < new Date() &&
    reservation.rentalType === "Short Term";

  const isExtendValid = useMemo(() => {
    return (
      isExtension && newEndDate && newEndDate > new Date(reservation.endDate)
    );
  }, [isExtension, newEndDate, reservation.endDate]);
  const stayLength = useMemo(() => {
    if (!newStartDate || !newEndDate || !estateReserved) return 0;

    if (isShortTerm) {
      return getStayLengthInDays(
        isExtension ? new Date(reservation.startDate) : newStartDate,
        newEndDate
      );
    }
    if (isLongTerm) {
      return getSmartMonthCount(newStartDate, newEndDate);
    }
    return 0;
  }, [
    newStartDate,
    newEndDate,
    isShortTerm,
    isLongTerm,
    isExtension,
    reservation.startDate,
    estateReserved,
  ]);

  const disabledButton =
    isPendingChangeUpdate ||
    isUpdatingDates ||
    isExtending ||
    isCancelling ||
    isUpdatingGuests;

  const isValidStay = useMemo(() => {
    if (!estateReserved) return true; // fallback kad nije populated
    if (estateReserved.estateType !== "ResidentialEstate") return true;

    if (!stayLength) return false;

    return (
      stayLength >= estateReserved.minimumStay &&
      (estateReserved.maximumStay === undefined ||
        stayLength <= estateReserved.maximumStay)
    );
  }, [estateReserved, stayLength]);

  useEffect(() => {
    if (reservation.pendingChange?.type === "UPDATE_DATE") {
      setNewStartDate(
        reservation.pendingChange.newStartDate
          ? new Date(reservation.pendingChange.newStartDate)
          : null
      );
      setNewEndDate(
        reservation.pendingChange.newEndDate
          ? new Date(reservation.pendingChange.newEndDate)
          : null
      );
    } else if (reservation.pendingChange?.type === "EXTEND") {
      setNewStartDate(new Date(reservation.startDate));
      setNewEndDate(
        reservation.pendingChange.newEndDate
          ? new Date(reservation.pendingChange.newEndDate)
          : new Date(reservation.endDate)
      );
    } else {
      // fallback na originalnu rezervaciju
      setNewStartDate(new Date(reservation.startDate));
      setNewEndDate(new Date(reservation.endDate));
    }
  }, [reservation]);

  function handleCancel() {
    cancelReservation(reservation._id);
    setCancelDialogOpen(false);
  }

  function handleUpdateDates() {
    if (isPendingChangeUpdate) return;
    if (newStartDate && newEndDate) {
      const body = {
        startDate: newStartDate,
        endDate: newEndDate,
        note: note.trim() ? note : undefined,
      };
      updateReservationDates({ reservationId: reservation._id, body });
      setNote("");
    }
  }

  function handleExtend() {
    if (isPendingChangeUpdate) return;
    if (!newEndDate) return;
    const body = {
      newEndDate,
      note: note.trim() ? note : undefined,
    };
    extendReservation({ reservationId: reservation._id, body });
    setNote("");
  }

  function handleUpdateGuestCount() {
    updateGuestCount({
      reservationId: reservation._id,
      body: {
        guestCount,
        childrenCount,
      },
    });
  }

  function handleUnitCountUpdate() {
    updateBusinessUnitCount({
      reservationId: reservation._id,
      body: {
        unitCount,
      },
    });
  }

  // 🟥 Early return ako je otkazana
  // DODATI AKO JE LONG TERM OPCIJU DA SE PREGLEDA CONTRACT IZ LOCAL STORAGE POVUCI
  if (reservation.status === ReservationStatus.CANCELED) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Akcije za rezervaciju
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" color="error" gutterBottom>
          Vaša rezervacija je otkazana.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Nije moguće izvršavati daljnje akcije nad ovom rezervacijom.
        </Typography>
        {isLongTerm && reservation.lastRelatedContractId && (
          <Stack>
            <Typography gutterBottom>
              Pogledajte posljedni kontrakt za ovu rezervaciju klikom na dugme
              ispod
            </Typography>
            <Button
              onClick={() =>
                navigate(
                  `/dashboard/contract/${reservation.lastRelatedContractId}`,
                  { replace: true }
                )
              }
            >
              Pregledaj ugovor
            </Button>
          </Stack>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Akcije za rezervaciju
      </Typography>

      <Stack spacing={2}>
        {/* === SHORT TERM / LONG TERM: izmjena datuma === */}
        {!isBusiness && (isShortTerm || isLongTerm) && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>
                {isShortTerm
                  ? "Promjena datuma / produženje"
                  : "Promjena datuma"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {isResidential && (
                <Stack direction="row" gap={3}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={1}
                    sx={{ mb: 1 }}
                  >
                    <ScheduleIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      Minimalni ostanak: {estateReserved.minimumStay}
                    </Typography>
                  </Stack>

                  {estateReserved.maximumStay && (
                    <Stack direction="row" alignItems="center" gap={1}>
                      <ScheduleIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        Maksimalni ostanak: {estateReserved.maximumStay}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              )}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
                  gap: 2,
                }}
              >
                <Box>
                  {/* Kalendar lijevo */}
                  {isShortTerm && (
                    <Suspense fallback={<div>Kalendar se ucitava...</div>}>
                      <RangeCalendar
                        startDate={newStartDate}
                        endDate={newEndDate}
                        setStartDate={setNewStartDate}
                        setEndDate={setNewEndDate}
                        blockedDates={blockedDates}
                        readonly={isPendingChangeUpdate}
                        lockStartDate={isExtension}
                      />
                    </Suspense>
                  )}

                  {isLongTerm && (
                    <Suspense fallback={<div>Kalendar se ucitava...</div>}>
                      <MonthRangeCalendarDual
                        startMonth={newStartDate}
                        endMonth={newEndDate}
                        setStartMonth={setNewStartDate}
                        setEndMonth={setNewEndDate}
                        blockedDates={blockedDates}
                        readonly={isPendingChangeUpdate}
                      />
                    </Suspense>
                  )}

                  {/* Helper text*/}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, textAlign: "center" }}
                  >
                    {isExtension
                      ? "Izaberite novi krajnji datum za produženje boravka."
                      : "Izaberite novi raspon datuma za promjenu rezervacije."}
                  </Typography>
                </Box>

                {/* Preview desno */}
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Trenutni period
                    </Typography>
                    <Typography>
                      {format(new Date(reservation.startDate), "dd.MM.yyyy", {
                        locale: srLatn,
                      })}{" "}
                      →{" "}
                      {format(new Date(reservation.endDate), "dd.MM.yyyy", {
                        locale: srLatn,
                      })}
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    {/* Note field */}
                    <TextField
                      label="Napomena (opcionalno)"
                      variant="outlined"
                      size="small"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      fullWidth
                      multiline
                      minRows={2}
                      sx={{ mt: 2 }}
                    />

                    <Divider sx={{ my: 1 }} />

                    <Button
                      variant="contained"
                      startIcon={isExtension ? <AddCircle /> : <EditCalendar />}
                      loading={isUpdatingDates || isExtending}
                      disabled={
                        disabledButton ||
                        !isValidStay ||
                        (isExtension && !isExtendValid)
                      }
                      onClick={isExtension ? handleExtend : handleUpdateDates}
                    >
                      {isExtension ? "Produži boravak" : "Zatraži promjenu"}
                    </Button>
                    {!isValidStay && (
                      <Typography
                        variant="body2"
                        color="error.light"
                        align="center"
                      >
                        {isPendingChangeUpdate
                          ? "Zatražili ste promjenu, trenutno čekajte na validaciju od strane vlasnika nekretnine."
                          : !newStartDate || !newEndDate
                          ? "Molimo vas odaberite datume dolaska i odlaska."
                          : isExtension && !isExtendValid
                          ? "Novi datum odlaska mora biti poslije trenutnog kraja rezervacije."
                          : "Odabrani raspon datuma nije validan. Povesti računa o minimalnoj i maksimalnoj dužini."}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
        {/* === PROMJENA BROJA GOSTIJU (short term only) === */}
        {isShortTerm &&
          reservation.status === ReservationStatus.CONFIRMED &&
          isResidential && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Promjena broja gostiju</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2} direction="row">
                  <GuestSelector
                    maxGuests={
                      estateReserved.guestIncluded +
                      (estateReserved.extraPeople ?? 0)
                    }
                    guestCount={guestCount}
                    setGuestCount={setGuestCount}
                    childrenCount={childrenCount}
                    setChildrenCount={setChildrenCount}
                  />
                </Stack>
                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  startIcon={<Group />}
                  disabled={disabledButton}
                  loading={isUpdatingGuests}
                  onClick={handleUpdateGuestCount}
                >
                  Sačuvaj promjenu
                </Button>
              </AccordionDetails>
            </Accordion>
          )}
        {/* === BUSINESS: promjena jedinica === */}
        {isBusiness && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Promjena broja jedinica</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2} direction="row">
                <TextField
                  label="Broj jedinica"
                  type="number"
                  size="small"
                  value={unitCount}
                  onChange={(e) => setUnitCount(Number(e.target.value))}
                  // defaultValue={
                  //   typeof reservation.unitCount !== "undefined"
                  //     ? reservation.unitCount
                  //     : 1
                  // }
                  inputProps={{ min: 1 }}
                  disabled={reservation.pendingContractChange !== undefined}
                  helperText={
                    reservation.pendingContractChange
                      ? "Trenutno cekanje na odobrenje od strane vlasnika nekretnine"
                      : ""
                  }
                />
              </Stack>
              <Button
                sx={{ mt: 2 }}
                variant="contained"
                startIcon={<Home />}
                onClick={handleUnitCountUpdate}
                loading={isUnitCountUpdate}
                disabled={
                  reservation.pendingContractChange !== undefined ||
                  isUnitCountUpdate ||
                  disabledButton
                }
              >
                Sačuvaj promjenu
              </Button>
            </AccordionDetails>
          </Accordion>
        )}

        {isLongTerm &&
          reservation.lastRelatedContractId &&
          reservation.status === ReservationStatus.CONFIRMED && (
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography gutterBottom>
                Pogledajte posljedni kontrakt za ovu rezervaciju klikom na dugme
                ispod
              </Typography>
              <Button
                onClick={() =>
                  navigate(
                    `/dashboard/contract/${reservation.lastRelatedContractId}`,
                    { replace: true }
                  )
                }
              >
                Pregledaj ugovor
              </Button>
            </Stack>
          )}

        {new Date(reservation.startDate).getTime() > Date.now() &&
          reservation.status === ReservationStatus.CONFIRMED && (
            <>
              {/* === DANGER ZONE === */}
              <Divider sx={{ my: 2 }} />
              <Paper elevation={2} sx={{ p: 2, mb: 1 }}>
                <Typography variant="subtitle2" color="error" gutterBottom>
                  Danger Zone
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => setCancelDialogOpen(true)}
                >
                  Otkaži rezervaciju
                </Button>
              </Paper>
            </>
          )}
      </Stack>

      {/* Potvrda otkazivanja */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>
          Da li ste sigurni da želite otkazati? Ova akcija je nepovratna
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Ne</Button>
          <Button
            color="error"
            onClick={handleCancel}
            loading={isCancelling}
            disabled={disabledButton}
          >
            Da, otkaži
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserReservationActions;
