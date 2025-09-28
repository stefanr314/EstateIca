import { useState } from "react";
import { useAppDispatch } from "@/app/store/hooks";
import { pushNotification } from "@/features/notifications/notificationSlice";

import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Paper,
  Stack,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Backdrop,
  CircularProgress,
} from "@mui/material";

import { IAddress } from "@/features/estates/types";
import { ResidentialEstateForm } from "./CreateResidentialEstateForm";
import { BusinessEstateForm } from "./CreateBusinessEstateForm";

import EstateLocationStep from "./CreateEstateLocationForm";
import EstateImagesUploader from "./CreateEstateImagesUploader";

import { sanitizeEstateData } from "@/shared/helper/sanitazeEstateData";
import { useCreateEstate } from "@/features/estates/hooks/useEstate";
import { useNavigate } from "react-router";

const steps = ["Tip nekretnine", "Detalji", "Lokacija", "Slike"];

export default function CreateEstatePage() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { mutate: createEstate, isPending: isCreatingEstate } =
    useCreateEstate();

  const [activeStep, setActiveStep] = useState(0);
  const [estateType, setEstateType] = useState<
    "ResidentialEstate" | "BusinessEstate" | null
  >(null);

  // lokalni podaci
  const [estateData, setEstateData] = useState<any>(null);
  const [address, setAddress] = useState<IAddress | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSaveDetails = (data: any) => {
    console.log("Step 2 data:", data);
    setEstateData((prev: any) => ({
      ...prev,
      ...data, // polja iz forme (title, description, itd.)
      ...(estateType === "BusinessEstate" && { rentalType: "Long Term" }),
    }));
    handleNext();
  };

  const handleFinishClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    if (!estateData || !address || !estateType)
      return dispatch(
        pushNotification({
          type: "error",
          message: "Nedostaju podaci o nekretnini ili lokaciji.",
        })
      );
    const sanitizedData = sanitizeEstateData(estateData);
    console.log("FINAL DATA", {
      ...sanitizedData,
      images,
      estateType,
      address,
    });

    createEstate(
      { type: estateType, data: { ...sanitizedData, address }, images },
      {
        onSuccess: () => {
          setActiveStep(0);
          setEstateType(null);
          setEstateData(null);
          setAddress(null);
          setImages([]);
          navigate("/dashboard/your-estates");
        },
      }
    );
  };

  return (
    <>
      <Paper sx={{ p: 4, minHeight: "80vh", width: "100%" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "primary.main" }}>
          Dodaj novu nekretninu
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step content */}
        {activeStep === 0 && (
          <Stack
            direction="row"
            spacing={4}
            justifyContent="center"
            alignItems={"center"}
            width={"100%"}
          >
            <Card
              onClick={() => {
                setEstateType("ResidentialEstate");
                handleNext();
              }}
              sx={{
                p: 4,
                flex: 1,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": { borderColor: "primary.main" },
              }}
              variant="outlined"
            >
              <Typography variant="h5">🏠 Stambeni</Typography>
              <Typography variant="body2" color="text.secondary">
                Stanovi, apartmani, sobe…
              </Typography>
            </Card>

            <Card
              onClick={() => {
                setEstateType("BusinessEstate");
                handleNext();
              }}
              sx={{
                p: 4,
                flex: 1,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": { borderColor: "primary.main" },
              }}
              variant="outlined"
            >
              <Typography variant="h5">🏢 Biznis</Typography>
              <Typography variant="body2" color="text.secondary">
                Kancelarije, poslovni prostori, hale…
              </Typography>
            </Card>
          </Stack>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Popunite detalje za{" "}
              {estateType === "ResidentialEstate" ? "stambeni" : "poslovni"}{" "}
              prostor
            </Typography>
            <Box sx={{ mt: 2 }}>
              {estateType === "ResidentialEstate" ? (
                <ResidentialEstateForm
                  onSubmit={handleSaveDetails}
                  initialValues={{ ...estateData }}
                />
              ) : (
                <BusinessEstateForm
                  onSubmit={handleSaveDetails}
                  initialValues={estateData}
                />
              )}
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button onClick={handleBack}>Nazad</Button>
              <Button
                variant="contained"
                sx={{ ml: 2 }}
                type="submit"
                form={
                  estateType === "ResidentialEstate"
                    ? "residential-form"
                    : "business-form"
                }
              >
                Nastavi
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 2 && (
          <Box width={"100%"}>
            <Typography variant="h6" gutterBottom>
              Lokacija nekretnine
            </Typography>
            <EstateLocationStep
              onSelect={setAddress}
              defaultAddress={address}
            />
            <Box sx={{ mt: 2 }}>
              <Button onClick={handleBack}>Nazad</Button>
              <Button
                variant="contained"
                sx={{ ml: 2 }}
                onClick={handleNext}
                disabled={!address}
              >
                Nastavi
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 3 && (
          <Box width={"100%"}>
            <Typography variant="h6" gutterBottom>
              Dodajte fotografije
            </Typography>
            <EstateImagesUploader onChange={setImages} images={images} />
            <Box sx={{ mt: 2 }}>
              <Button onClick={handleBack}>Nazad</Button>
              <Button
                variant="contained"
                sx={{ ml: 2 }}
                onClick={handleFinishClick}
              >
                Sačuvaj i završi
              </Button>
            </Box>
          </Box>
        )}

        {/* Confirm modal */}
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Potvrda kreiranja</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {images.length === 0 ? (
                <>
                  Niste dodali nijednu fotografiju. Vaš smještaj bez slika neće
                  biti potpun i može uticati na interesovanje gostiju. <br />
                  Da li ste sigurni da želite nastaviti bez slika?
                </>
              ) : (
                <>
                  Da li ste sigurni da želite završiti kreiranje ove nekretnine?
                </>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Odustani</Button>
            <Button variant="contained" onClick={handleConfirm}>
              Potvrdi
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>

      {/* Loader preko svega */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isCreatingEstate}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
