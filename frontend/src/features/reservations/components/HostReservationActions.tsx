import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Divider,
  Chip,
  Paper,
} from "@mui/material";
import { IReservationPopulated, ReservationStatus } from "../types";
import {
  useApproveBusinessUnitCountUpdate,
  useApproveExtendUpdateDateReservations,
  useConfirmBusinessReservation,
  useConfirmLongTermResidentialReservation,
  useDenyBusinessUnitCountUpdate,
  useDenyExtendUpdateDateReservation,
  useDenyLongTermReservation,
} from "../hook/useHostReservations";
import EuroIcon from "@mui/icons-material/Euro";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router";

export default function HostReservationActions({
  reservation,
}: {
  reservation: IReservationPopulated;
}) {
  const navigate = useNavigate();

  const { mutate: confirmLongTermResidential, isPending: isConfirmingRes } =
    useConfirmLongTermResidentialReservation();
  const { mutate: confirmBusiness, isPending: isConfirmingBus } =
    useConfirmBusinessReservation();
  const { mutate: denyLongTerm, isPending: isDenying } =
    useDenyLongTermReservation();

  const { mutate: approveExtendUpdate, isPending: isApprovingExtendUpdate } =
    useApproveExtendUpdateDateReservations();
  const { mutate: approveBusinessUnit, isPending: isApprovingUnit } =
    useApproveBusinessUnitCountUpdate();
  const { mutate: denyExtendUpdate, isPending: isDenyingExtendUpdate } =
    useDenyExtendUpdateDateReservation();
  const { mutate: denyBusinessUnit, isPending: isDenyingUnit } =
    useDenyBusinessUnitCountUpdate();

  const isBusiness = reservation.estateReserved.estateType === "BusinessEstate";
  const isResidential =
    reservation.estateReserved.estateType === "ResidentialEstate";

  const isPendingChangeResidential =
    isResidential && !!reservation.pendingChange;
  const isPendingBusinessChange =
    isBusiness && !!reservation.pendingContractChange;

  const isPendingLongTerm =
    reservation.rentalType === "Long Term" &&
    reservation.status === ReservationStatus.PENDING;

  const showLongTermPendingRequests =
    isPendingLongTerm &&
    !isPendingChangeResidential &&
    !isPendingBusinessChange;

  const showExtendUpdateRequests =
    isPendingChangeResidential &&
    reservation.status === ReservationStatus.PENDING;

  const showBusinessUnitCountRequests =
    isPendingBusinessChange && isPendingLongTerm;

  const handleConfirm = () => {
    if (isBusiness) confirmBusiness(reservation._id);
    else confirmLongTermResidential(reservation._id);
  };

  const handleDeny = () => {
    denyLongTerm(reservation._id);
  };

  if (reservation.status === ReservationStatus.CANCELED) {
    const contractId = localStorage.getItem("lastContractId");
    const isLongTerm = reservation.rentalType === "Long Term";

    return (
      <Box sx={{ p: 4, mx: "auto", textAlign: "center" }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Ova rezervacija je otkazana.
        </Typography>

        {isLongTerm && contractId && (
          <Paper
            elevation={2}
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Ugovor o otkazivanju
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() =>
                navigate(`/dashboard/contract/${contractId}`, { replace: true })
              }
            >
              Prikaži ugovor
            </Button>
          </Paper>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Akcije vlasnika
      </Typography>

      {!showLongTermPendingRequests &&
        !showExtendUpdateRequests &&
        !showBusinessUnitCountRequests && (
          <Typography variant="body2" color="text.secondary">
            Trenutno nema dostupnih akcija. Ako je rezervacija u toku ili već
            potvrđena, ne možete izvršiti dodatne promjene.
          </Typography>
        )}

      {showLongTermPendingRequests && (
        <>
          {/* Osnovne informacije */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Rezervacija #{reservation._id.slice(-6)}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CalendarMonthIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(reservation.startDate).toLocaleDateString(
                      "sr-Latn-RS"
                    )}{" "}
                    –{" "}
                    {new Date(reservation.endDate).toLocaleDateString(
                      "sr-Latn-RS"
                    )}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <EuroIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Ukupna cijena: <strong>{reservation.totalPrice} €</strong>
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <GroupIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {reservation.guestCount} odraslih
                    {reservation.childrenCount
                      ? ` + ${reservation.childrenCount} djece`
                      : ""}
                  </Typography>
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                <Stack direction="row" spacing={1}>
                  <Chip
                    label={
                      isBusiness
                        ? "Poslovni (dugoročni najam)"
                        : "Stambeni (dugoročni najam)"
                    }
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={`Status: ${reservation.status}`}
                    color="warning"
                    variant="outlined"
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Akciona dugmad */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="flex-end"
          >
            <Button
              variant="contained"
              color="error"
              onClick={handleDeny}
              disabled={isDenying}
              loading={isDenying}
            >
              Odbij rezervaciju
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleConfirm}
              loading={isConfirmingRes || isConfirmingBus}
              disabled={isConfirmingRes || isConfirmingBus}
            >
              Potvrdi rezervaciju
            </Button>
          </Stack>
        </>
      )}

      {showExtendUpdateRequests && reservation.pendingChange && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Gost traži promjenu datuma boravka
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Stari:{" "}
            {new Date(reservation.startDate).toLocaleDateString("sr-Latn-RS")} →
            {new Date(reservation.endDate).toLocaleDateString("sr-Latn-RS")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Novi:{" "}
            {new Date(
              reservation.pendingChange.newStartDate!
            ).toLocaleDateString("sr-Latn-RS")}{" "}
            →{" "}
            {new Date(reservation.pendingChange.newEndDate!).toLocaleDateString(
              "sr-Latn-RS"
            )}
          </Typography>

          {reservation.pendingChange.extraPrice && (
            <Typography sx={{ mt: 1.5 }} color="success.main">
              Doplata: +{reservation.pendingChange.extraPrice} €
            </Typography>
          )}

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="error"
              loading={isDenyingExtendUpdate}
              disabled={isDenyingExtendUpdate}
              onClick={() => denyExtendUpdate(reservation._id)}
            >
              Odbij promjenu
            </Button>
            <Button
              variant="contained"
              color="success"
              loading={isApprovingExtendUpdate}
              disabled={isApprovingExtendUpdate}
              onClick={() => approveExtendUpdate(reservation._id)}
            >
              Odobri promjenu
            </Button>
          </Stack>
        </Box>
      )}

      {/* ✅ SLUČAJ 3: Promjena broja jedinica (Business) */}
      {showBusinessUnitCountRequests && reservation.pendingContractChange && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Klijent traži promjenu ugovora (broj jedinica)
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Stari broj jedinica: {reservation.unitCount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Novi broj jedinica: {reservation.pendingContractChange.newUnitCount}
          </Typography>

          {reservation.pendingContractChange.note && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Napomena: {reservation.pendingContractChange.note}
            </Typography>
          )}

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="error"
              loading={isDenyingUnit}
              disabled={isDenyingUnit}
              onClick={() => denyBusinessUnit(reservation._id)}
            >
              Odbij zahtjev
            </Button>
            <Button
              variant="contained"
              color="success"
              loading={isApprovingUnit}
              disabled={isApprovingUnit}
              onClick={() => approveBusinessUnit(reservation._id)}
            >
              Odobri zahtjev
            </Button>
          </Stack>
        </Box>
      )}

      {/* Info ispod */}
      <Paper
        elevation={2}
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Nakon potvrde rezervacije, biće automatski kreiran ugovor ukoliko je
          predviđen za ovaj tip nekretnine.
        </Typography>
      </Paper>

      {/* ✅ Prikaz posljednjeg ugovora (demo) */}
      {reservation.lastRelatedContractId && (
        <Paper
          elevation={2}
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Posljednji kreirani ugovor
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              const contractId = reservation.lastRelatedContractId;
              if (contractId)
                navigate(`/dashboard/contract/${contractId}`, {
                  replace: true,
                });
            }}
          >
            Prikaži ugovor
          </Button>
        </Paper>
      )}
    </Box>
  );
}
