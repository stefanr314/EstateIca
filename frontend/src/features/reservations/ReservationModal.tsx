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
  Avatar,
  useTheme,
  useMediaQuery,
  IconButton,
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
import ListSubheader from "@mui/material/ListSubheader";

export interface Reservation {
  id: string;
  status: string;
  createdAt: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  guestCount: { adults: number; children: number; infants?: number };
  notes?: string;
  estateTitle: string;
  estateAddress: string;
  estateThumbnailUrl?: string;
  totalPrice: number;
  cancellationPolicy?: string;
  paymentStatus: "unpaid";
}

interface Props {
  open: boolean;
  onClose: () => void;
  reservation: Reservation;
}

const ReservationModal: React.FC<Props> = ({ open, onClose, reservation }) => {
  const [tab, setTab] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const handleTab = (_: React.SyntheticEvent, newVal: number) => setTab(newVal);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle color="success" />;
      case "cancelled":
        return <Cancel color="error" />;
      case "pending":
        return <Schedule color="warning" />;
      default:
        return <Schedule />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "cancelled":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isMobile ? "xs" : isTablet ? "md" : "lg"}
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            maxHeight: "90vh",
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
          <Typography variant="h6">Rezervacija #{reservation.id}</Typography>
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
        <Tab label="Historija" />
      </Tabs>

      <Divider />

      <DialogContent sx={{ p: 0 }}>
        {tab === 0 && (
          <Box sx={{ p: 2 }}>
            {/* Status Card */}
            <Card sx={{ mb: 2, bgcolor: "background.default" }}>
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
                {/* Guest Information */}
                <Card sx={{ mb: 2 }}>
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
                      Informacije o gostu
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
                          primary={reservation.guestEmail}
                          secondary="Email adresa"
                        />
                      </ListItem>

                      {reservation.guestPhone && (
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Phone fontSize="small" color="action" />
                          </ListItemIcon>
                          <ListItemText
                            primary={reservation.guestPhone}
                            secondary="Telefon"
                          />
                        </ListItem>
                      )}

                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Group fontSize="small" color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${
                            reservation.guestCount.adults
                          } odraslih, ${reservation.guestCount.children} djece${
                            reservation.guestCount.infants
                              ? `, ${reservation.guestCount.infants} bebe`
                              : ""
                          }`}
                          secondary="Broj osoba"
                        />
                      </ListItem>

                      {reservation.notes && (
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Note fontSize="small" color="action" />
                          </ListItemIcon>
                          <ListItemText
                            primary={reservation.notes}
                            secondary="Napomena"
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>

                {/* Dates Information */}
                <Card>
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
                          primary={`${reservation.checkIn} → ${reservation.checkOut}`}
                          secondary={`${reservation.nights} noći`}
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
                <Card sx={{ mb: 2 }}>
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
                          primary={reservation.estateAddress}
                          secondary="Adresa"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
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
                      Plaćanje
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

                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Payment fontSize="small" color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Chip
                              label={
                                reservation.paymentStatus === "unpaid"
                                  ? "Neplaćeno"
                                  : "Plaćeno"
                              }
                              color={
                                reservation.paymentStatus === "unpaid"
                                  ? "warning"
                                  : "success"
                              }
                              size="small"
                            />
                          }
                          secondary="Status plaćanja"
                        />
                      </ListItem>

                      {reservation.cancellationPolicy && (
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Cancel fontSize="small" color="action" />
                          </ListItemIcon>
                          <ListItemText
                            primary={reservation.cancellationPolicy}
                            secondary="Politika otkazivanja"
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

        {tab === 1 && (
          <Box sx={{ p: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
            >
              <AccessTime color="primary" />
              Historija aktivnosti rezervacije:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (još nema logova u ovoj verziji)
            </Typography>
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

export default ReservationModal;
