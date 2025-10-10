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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Chip,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  IconButton,
  Paper,
  alpha,
} from "@mui/material";

import {
  Person,
  Email,
  Phone,
  Home,
  CalendarToday,
  Euro,
  Payment,
  Cancel,
  CheckCircle,
  Schedule,
  Group,
  Note,
  Close,
  ConfirmationNumber,
  LocationOn,
  AccessTime,
} from "@mui/icons-material";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import { useGetReservationDetails } from "./hook/useReservations";
import AppLoader from "@/shared/components/AppLoader";
import { ReservationStatus } from "./types";
import UserReservationActions from "./components/UserReservationActions";

interface Props {
  open: boolean;
  onClose: () => void;
  reservationId: string;
}

const UserReservationModal: React.FC<Props> = ({
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

  const handleTab = (_: React.SyntheticEvent, newVal: number) => setTab(newVal);

  const getStatusIcon = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.CONFIRMED:
        return <CheckCircle color="success" />;
      case ReservationStatus.CANCELED:
        return <Cancel color="error" />;
      case ReservationStatus.PENDING:
        return <Schedule color="warning" />;
      case ReservationStatus.COMPLETED:
        return <BeenhereIcon color="info" />;
      default:
        return <Schedule />;
    }
  };

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.CONFIRMED:
        return "success";
      case ReservationStatus.CANCELED:
        return "error";
      case ReservationStatus.PENDING:
        return "warning";
      case ReservationStatus.COMPLETED:
        return "info";
      default:
        return "default";
    }
  };

  if (isPending) return <AppLoader loading={isPending} />;

  if (!reservation)
    return <Typography>Nista znacajno za prikaz. Nazad molicu...</Typography>;

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

      <Tabs
        value={tab}
        onChange={handleTab}
        indicatorColor="primary"
        sx={{ px: 2 }}
      >
        <Tab label="Pregled" />
        <Tab label="Akcije" />
        <Tab label="Aktivne promjene" />
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
            {/* Status Card */}
            <Card
              sx={{
                mb: 2,
                bgcolor: alpha(
                  theme.palette.background.paper,
                  theme.palette.mode === "dark" ? 0.6 : 1
                ),
              }}
            >
              <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {getStatusIcon(reservation.status)}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status rezervacije
                    </Typography>
                    <Chip
                      label={reservation.status}
                      color={getStatusColor(reservation.status) as any}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
              }}
            >
              {/* Left Column */}
              <Box>
                {/* Host Information */}
                <Card
                  sx={{
                    mb: 2,
                    bgcolor: alpha(
                      theme.palette.background.paper,
                      theme.palette.mode === "dark" ? 0.6 : 1
                    ),
                  }}
                >
                  <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Person color="primary" />
                      Informacije o vlasniku
                    </Typography>

                    <List dense disablePadding>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Person fontSize="small" color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={reservation.guestName}
                          secondary="Ime i prezime"
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>

                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Email fontSize="small" color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            typeof reservation.hostOfReservedEstate !==
                              "string" && reservation.hostOfReservedEstate.email
                          }
                          secondary="Email adresa"
                        />
                      </ListItem>

                      {typeof reservation.hostOfReservedEstate !== "string" &&
                        reservation.hostOfReservedEstate.phoneNumber && (
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Phone fontSize="small" color="action" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                reservation.hostOfReservedEstate.phoneNumber
                              }
                              secondary="Telefon"
                            />
                          </ListItem>
                        )}

                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Group fontSize="small" color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${reservation.guestCount} odraslih, ${reservation.childrenCount} djece`}
                          secondary="Broj osoba"
                        />
                      </ListItem>

                      {reservation.note && (
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Note fontSize="small" color="action" />
                          </ListItemIcon>
                          <ListItemText
                            primary={reservation.note}
                            secondary="Napomena"
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>

                {/* Dates Information */}
                <Card
                  sx={{
                    mb: 2,
                    bgcolor: alpha(
                      theme.palette.background.paper,
                      theme.palette.mode === "dark" ? 0.6 : 1
                    ),
                  }}
                >
                  <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <CalendarToday color="primary" />
                      Datumi boravka
                    </Typography>

                    <List dense disablePadding>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <AccessTime fontSize="small" color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${new Date(
                            reservation.startDate
                          ).toLocaleDateString("sr-Latn-RS")} → ${new Date(
                            reservation.endDate
                          ).toLocaleDateString("sr-Latn-RS")}`}
                          // secondary={`${reservation.nights} noći`}
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>

                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CalendarToday fontSize="small" color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={reservation.createdAt}
                          secondary="Datum kreiranja"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Box>

              {/* Right Column */}
              <Box>
                {/* Estate Information */}
                <Card
                  sx={{
                    mb: 2,
                    bgcolor: alpha(
                      theme.palette.background.paper,
                      theme.palette.mode === "dark" ? 0.6 : 1
                    ),
                  }}
                >
                  <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Home color="primary" />
                      Smještaj
                    </Typography>

                    <List dense disablePadding>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Home fontSize="small" color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={reservation.estateTitle}
                          secondary="Naziv smještaja"
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>

                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <LocationOn fontSize="small" color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            typeof reservation.estateReserved !== "string"
                              ? `${reservation.estateReserved.address.city}, ${reservation.estateReserved.address.country}`
                              : reservation.estateReserved
                          }
                          secondary="Grad"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card
                  sx={{
                    mb: 2,
                    bgcolor: alpha(
                      theme.palette.background.paper,
                      theme.palette.mode === "dark" ? 0.6 : 1
                    ),
                  }}
                >
                  <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                    <Typography
                      variant="h6"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Payment color="primary" />
                      Plaćanje i uslovi
                    </Typography>

                    <List dense disablePadding>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Euro fontSize="small" color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${reservation.totalPrice} €`}
                          secondary="Ukupna cijena"
                          primaryTypographyProps={{
                            fontWeight: 500,
                            fontSize: "1.1rem",
                          }}
                        />
                      </ListItem>

                      {reservation.rentalType === "Short Term" &&
                        reservation.pricePerNight && (
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Euro fontSize="small" color="action" />
                            </ListItemIcon>
                            <ListItemText
                              primary={`${reservation.pricePerNight} €`}
                              secondary="Cijena po noći"
                            />
                          </ListItem>
                        )}

                      {reservation.rentalType === "Long Term" &&
                        reservation.pricePerMonth && (
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Euro fontSize="small" color="action" />
                            </ListItemIcon>
                            <ListItemText
                              primary={`${reservation.pricePerMonth} €`}
                              secondary="Cijena po mjesecu"
                            />
                          </ListItem>
                        )}

                      {reservation.extraPeopleFee !== undefined && (
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Group fontSize="small" color="action" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${reservation.extraPeopleFee} €`}
                            secondary="Doplatak za dodatne osobe"
                          />
                        </ListItem>
                      )}

                      {reservation.childrenDiscount !== undefined && (
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Group fontSize="small" color="action" />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${reservation.childrenDiscount}%`}
                            secondary="Popust za djecu"
                          />
                        </ListItem>
                      )}

                      {reservation.unitCount !== undefined && (
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Home fontSize="small" color="action" />
                          </ListItemIcon>
                          <ListItemText
                            primary={reservation.unitCount}
                            secondary="Broj jedinica"
                          />
                        </ListItem>
                      )}

                      {reservation.isContractRequired && (
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <BeenhereIcon fontSize="small" color="action" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Ugovor obavezan"
                            secondary="Potrebno potpisivanje ugovora"
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Box>
        )}

        {tab === 1 && <UserReservationActions reservation={reservation} />}

        {tab === 2 && (
          <Box sx={{ p: 2 }}>
            {reservation.pendingChange || reservation.pendingContractChange ? (
              <Card>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Schedule color="primary" />
                    Aktivne promjene
                  </Typography>

                  {reservation.pendingChange && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Promjena datuma
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tip: <b>{reservation.pendingChange.type}</b>
                      </Typography>
                      {reservation.pendingChange.newStartDate && (
                        <Typography variant="body2" color="text.secondary">
                          Novi početak:{" "}
                          {new Date(
                            reservation.pendingChange.newStartDate
                          ).toLocaleDateString("sr-Latn-RS")}
                        </Typography>
                      )}
                      {reservation.pendingChange.newEndDate && (
                        <Typography variant="body2" color="text.secondary">
                          Novi kraj:{" "}
                          {new Date(
                            reservation.pendingChange.newEndDate
                          ).toLocaleDateString("sr-Latn-RS")}
                        </Typography>
                      )}

                      <Typography variant="body2" color="text.secondary">
                        Stari početak:{" "}
                        {new Date(reservation.startDate).toLocaleDateString(
                          "sr-Latn-RS"
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stari kraj:{" "}
                        {new Date(reservation.endDate).toLocaleDateString(
                          "sr-Latn-RS"
                        )}
                      </Typography>

                      {/* Cijene */}
                      {reservation.pendingChange.extraPrice !== undefined && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          Doplata za promjenu:{" "}
                          <b>{reservation.pendingChange.extraPrice} €</b>
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Ukupna cijena nakon promjene:{" "}
                        <b>{reservation.pendingChange.totalPrice} €</b>
                      </Typography>

                      {reservation.pendingChange.note && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          Napomena: {reservation.pendingChange.note}
                        </Typography>
                      )}
                    </Box>
                  )}

                  {reservation.pendingContractChange && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Promjena ugovora (business estate)
                      </Typography>

                      {reservation.pendingContractChange.newUnitCount !==
                        undefined && (
                        <Typography variant="body2" color="text.secondary">
                          Novi broj jedinica:{" "}
                          {reservation.pendingContractChange.newUnitCount}
                        </Typography>
                      )}
                      {reservation.unitCount !== undefined && (
                        <Typography variant="body2" color="text.secondary">
                          Stari broj jedinica: {reservation.unitCount}
                        </Typography>
                      )}
                      {reservation.pendingContractChange.note && (
                        <Typography variant="body2" color="text.secondary">
                          Napomena: {reservation.pendingContractChange.note}
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Paper elevation={2}>
                <Typography variant="body1" color="text.secondary">
                  Trenutno nema aktivnih promjena za ovu rezervaciju.
                </Typography>
              </Paper>
            )}
          </Box>
        )}
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

export default UserReservationModal;
