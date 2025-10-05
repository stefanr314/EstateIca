import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Backdrop,
  CircularProgress,
} from "@mui/material";

import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { RootState } from "@/app/store/store";
import { useCreateReservation } from "./hook/useReservations";
import {
  CreateBusinessReservation,
  CreateResidentialReservation,
} from "./types";
import { pushNotification } from "../notifications/notificationSlice";

const steps = ["Pregled rezervacije", "Potvrda", "Rezultat"];

const UserReservationCreation: React.FC = () => {
  const { mutate: createReservation, isPending: isCreating } =
    useCreateReservation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const reservationInfo = useAppSelector(
    (state: RootState) => state.reservation
  );

  const [activeStep, setActiveStep] = useState(0);
  const [reservationNote, setReservationNote] = useState("");
  const [flag, setFlag] = useState(false);

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate(-1);
    } else if (activeStep === steps.length - 1) {
      // disable back on last step
      return;
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleCreateResidentialReservation = () => {
    if (
      !reservationInfo.startDate ||
      !reservationInfo.endDate ||
      !reservationInfo.guestCount ||
      !reservationInfo.estateId
    )
      return;

    const body: CreateResidentialReservation = {
      startDate: reservationInfo.startDate,
      endDate: reservationInfo.endDate,
      guestCount: reservationInfo.guestCount,
      childrenCount: reservationInfo.childrenCount || undefined,
      note: reservationNote || undefined,
    };

    createReservation(
      {
        type: "residential",
        estateId: reservationInfo.estateId,
        body,
      },
      {
        onSuccess: () => {
          setFlag(true);
          handleNext();
        },
      }
    );
  };

  const handleCreateBusinessReservation = () => {
    if (
      !reservationInfo.startDate ||
      !reservationInfo.endDate ||
      !reservationInfo.unitCount ||
      !reservationInfo.estateId
    ) {
      return;
    }

    const body: CreateBusinessReservation = {
      startDate: reservationInfo.startDate,
      endDate: reservationInfo.endDate,
      unitCount: reservationInfo.unitCount,
      note: reservationNote || undefined,
    };

    createReservation(
      {
        type: "business",
        estateId: reservationInfo.estateId,
        body,
      },
      {
        onSuccess: () => {
          setFlag(true);
          handleNext();
        },
      }
    );
  };

  if (
    !flag &&
    (!reservationInfo.estateId ||
      !reservationInfo.startDate ||
      !reservationInfo.endDate)
  ) {
    return (
      <Box sx={{ height: "100vh", p: 5, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          Rezervacija nije validna 🚫
        </Typography>
        <Button onClick={() => navigate("/")}>Nazad na početnu</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Top AppBar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Estatica
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main layout */}
      <Grid container sx={{ p: 3 }} spacing={3}>
        {/* Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sažetak rezervacije
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Placeholder info */}
              <Typography>
                📅 Datumi:{" "}
                {reservationInfo.startDate?.toLocaleDateString("sr-Latn")} -{" "}
                {reservationInfo.endDate?.toLocaleDateString("sr-Latn")}
              </Typography>
              {reservationInfo.guestCount && (
                <Typography>
                  👥 Gosti: {reservationInfo.guestCount} odrasla,{" "}
                  {reservationInfo.childrenCount &&
                  reservationInfo.childrenCount === 1
                    ? "1 dijete"
                    : `${reservationInfo.childrenCount} djece`}
                </Typography>
              )}
              {reservationInfo.unitCount && (
                <Typography>
                  🔢 Broj jedinica za vas biznis smjestaj:{" "}
                  {reservationInfo.unitCount}
                </Typography>
              )}

              <Typography>
                Jedinstveni broj smještaja: {reservationInfo.estateId}
              </Typography>
              <Typography>
                🏠 Smještaj: {reservationInfo.estateTitle}
              </Typography>
              <Typography>
                📍 Adresa smještaj: {reservationInfo.estateAddress}
              </Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h5" color="primary">
                € {reservationInfo.totalPrice}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ukupna cijena
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Stepper + main content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Divider sx={{ my: 2 }} />

              {/* Content by step */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Pregledaj svoju rezervaciju
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Ako ti nešto ne odgovara, možeš se vratiti na detalje
                    smještaja.
                  </Typography>

                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ mr: 2 }}
                  >
                    Nazad
                  </Button>
                  <Button variant="contained" onClick={handleNext}>
                    Nastavi
                  </Button>
                </Box>
              )}

              {activeStep === 1 && (
                <Box>
                  {/* Backdrop dok traje mutacija */}
                  <Backdrop
                    sx={{
                      color: "primary.main",
                      zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={isCreating}
                  >
                    <CircularProgress color="inherit" />
                  </Backdrop>
                  <Typography variant="h6" gutterBottom>
                    Potvrdi rezervaciju
                  </Typography>

                  <Divider />

                  <Typography variant="body2" gutterBottom>
                    Unesi opcionu poruku prilikom kreiranja rezervacije
                  </Typography>
                  <TextField
                    id="outlined-multiline-static"
                    label="Dodatne napomene"
                    placeholder="Dodatne napomene..."
                    value={reservationNote}
                    onChange={(e) => setReservationNote(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                  />

                  <Divider />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Klikom na dugme ispod potvrđuješ kreiranje rezervacije.
                  </Typography>

                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ mr: 2 }}
                  >
                    Nazad
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    disabled={!reservationInfo.estateType}
                    onClick={
                      reservationInfo.estateType === "ResidentialEstate"
                        ? handleCreateResidentialReservation
                        : reservationInfo.estateType === "BusinessEstate"
                        ? handleCreateBusinessReservation
                        : () => {
                            console.error(reservationInfo);
                            dispatch(
                              pushNotification({
                                type: "error",
                                message: "Polja nisu validna",
                              })
                            );
                          }
                    }
                  >
                    Kreiraj rezervaciju
                  </Button>
                </Box>
              )}

              {activeStep === 2 && (
                <Box textAlign="center" sx={{ py: 5 }}>
                  <Typography variant="h5" gutterBottom>
                    🎉 Rezervacija kreirana!
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Više informacija o samom rezervaciji pogledaj unutar Vašeg
                    kontrolnog panela.
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={() => {
                      setFlag(false);
                      navigate("/dashboard/reservations");
                    }}
                  >
                    Moje rezervacije
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserReservationCreation;
