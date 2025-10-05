import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
  Typography,
  Divider,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Close, ConfirmationNumber } from "@mui/icons-material";
import AppLoader from "@/shared/components/AppLoader";
import { useGetReservationDetails } from "./hook/useReservations";
import { ReservationStatus } from "./types";
import ReservationStatusCard from "./components/ReservationStatusCard";
import ReservationDatesCard from "./components/ReservationDatesCard";
import ReservationEstateCard from "./components/ReservationEstateCard";
import ReservationPaymentCard from "./components/ReservationPaymentCard";
import ReservationPersonCard from "./components/ReservationPersonCard";
import HostReservationActions from "./components/HostReservationActions";

interface Props {
  open: boolean;
  onClose: () => void;
  reservationId: string;
}

const HostReservationModal: React.FC<Props> = ({
  open,
  onClose,
  reservationId,
}) => {
  const { data: reservation, isPending } =
    useGetReservationDetails(reservationId);

  const [tab, setTab] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  if (isPending) return <AppLoader loading={isPending} />;
  if (!reservation)
    return <Typography>Podaci o rezervaciji nisu dostupni.</Typography>;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isMobile ? "xs" : isTablet ? "md" : "xl"}
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            maxWidth: "1200px",
            maxHeight: "90vh",
            minHeight: "80vh",
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ConfirmationNumber color="primary" />
          <Typography variant="h6">Rezervacija #{reservation._id}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} indicatorColor="primary">
        <Tab label="Pregled" />
        <Tab label="Akcije vlasnika" />
      </Tabs>

      <Divider />

      <DialogContent
        sx={{
          p: 0,
          height: "75vh",
          overflowY: "auto",
        }}
      >
        {tab === 0 && (
          <Box sx={{ p: 2 }}>
            {/* Reuse partials */}
            <ReservationStatusCard
              status={reservation.status as ReservationStatus}
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Box>
                <ReservationPersonCard
                  title="Informacije o gostu"
                  person={{
                    name: reservation.guestName,
                    email:
                      typeof reservation.userOfReservation !== "string"
                        ? reservation.userOfReservation.firstName
                        : "",
                    phone:
                      typeof reservation.userOfReservation !== "string"
                        ? reservation.userOfReservation.phoneNumber
                        : "",
                    guests: reservation.guestCount,
                    children: reservation.childrenCount,
                    note: reservation.note,
                  }}
                />
                <ReservationDatesCard
                  startDate={reservation.startDate}
                  endDate={reservation.endDate}
                  createdAt={reservation.createdAt}
                />
              </Box>
              <Box>
                <ReservationEstateCard
                  estateTitle={reservation.estateTitle}
                  address={reservation.estateReserved?.address}
                />
                <ReservationPaymentCard reservation={reservation} />
              </Box>
            </Box>
          </Box>
        )}

        {tab === 1 && <HostReservationActions reservation={reservation} />}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button
          color="secondary"
          variant="outlined"
          onClick={onClose}
          startIcon={<Close />}
        >
          Zatvori
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HostReservationModal;
