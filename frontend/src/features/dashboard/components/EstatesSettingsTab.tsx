import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Stack,
  IconButton,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RangeCalendar from "@/shared/components/calendar/RangeCalendar";
import MonthRangeCalendarDual from "@/shared/components/calendar/MonthRangeCalendar";
import { useAppDispatch } from "@/app/store/hooks";
import { pushNotification } from "@/features/notifications/notificationSlice";
import { useLockDatesByHost } from "@/features/reservations/hook/useReservations";
import {
  useDeleteEstate,
  useToggleEstateVisibility,
} from "@/features/estates/hooks/useEstate";
import { useNavigate } from "react-router-dom";

type Props = {
  estateId: string;
  hidden: boolean;
  rentalType: "Short Term" | "Long Term";
  blockedDates:
    | {
        type: "RESERVATION" | "LOCK";
        startDate: Date;
        endDate: Date;
      }[]
    | undefined;
};

export default function EstateSettingsTab({
  estateId,
  hidden,
  rentalType,
  blockedDates,
}: Props) {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [visibilityOpen, setVisibilityOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [password, setPassword] = useState("");

  const { mutate: deleteEstate, isPending: isDeletingEstate } =
    useDeleteEstate(estateId);
  const { mutate: lockDates, isPending: isLockingDates } =
    useLockDatesByHost(estateId);
  const { mutate: toggleVisibility, isPending: isTogglingVisibility } =
    useToggleEstateVisibility(estateId);

  const handleToggleVisibility = () => {
    toggleVisibility();
    setVisibilityOpen(false);
    console.log("toggleVisibility estateId:", estateId);
  };

  const handleDeleteEstate = () => {
    deleteEstate(password, {
      onSuccess: () => {
        navigate("/dashboard/your-estates");
      },
    });
    setDeleteOpen(false);
  };

  const handleLockDates = () => {
    if (!startDate || !endDate) {
      dispatch(
        pushNotification({
          type: "warning",
          message: "Oba datuma moraju biti odabrana.",
        })
      );
      return;
    }
    if (startDate && endDate) {
      console.log(
        "lockDates estateId:",
        estateId,
        "period:",
        startDate,
        "->",
        endDate
      );
      lockDates({ startDate, endDate, note: "Zaključano iz podešavanja" });
      setStartDate(null);
      setEndDate(null);
    }
  };

  // broj dana ako su oba datuma selektovana
  const daysCount =
    startDate && endDate
      ? Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
      : null;

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent sx={{ p: 0.5 }}>
        <Stack spacing={4}>
          {/* 1. Blokirani datumi */}
          <Typography variant="h6" gutterBottom>
            Podešavanja dostupnosti - zaključajte datume
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box flex={7}>
                {rentalType === "Short Term" ? (
                  <RangeCalendar
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    blockedDates={blockedDates}
                  />
                ) : (
                  <MonthRangeCalendarDual
                    startMonth={startDate}
                    endMonth={endDate}
                    setStartMonth={setStartDate}
                    setEndMonth={setEndDate}
                    blockedDates={blockedDates}
                  />
                )}
              </Box>

              <Box flex={3}>
                {/* Read-only preview sa brojem dana i X */}
                <TextField
                  label="Odabrani period"
                  value={
                    startDate && endDate
                      ? `${startDate.toLocaleDateString()} – ${endDate.toLocaleDateString()} (${daysCount} dana)`
                      : "Nije odabran period"
                  }
                  InputProps={{
                    readOnly: true,
                    endAdornment: (startDate || endDate) && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setStartDate(null);
                            setEndDate(null);
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLockDates}
                disabled={!startDate || !endDate || isLockingDates}
              >
                Zaključaj datume
              </Button>
            </Box>
          </Box>

          <Divider />

          {/* 2. Vidljivost */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" gutterBottom display={"inline-block"}>
              Vidljivost oglasa
            </Typography>
            <Button
              variant="contained"
              color={hidden ? "success" : "warning"}
              onClick={() => setVisibilityOpen(true)}
              disabled={isTogglingVisibility}
            >
              {hidden ? "Prikaži oglas" : "Sakrij oglas"}
            </Button>
          </Box>

          <Divider />

          {/* 3. Danger Zone */}
          <Box
            sx={(theme) => ({
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.grey[200],
              //   border: "1px solid",
              //   borderColor: "error.main",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              ...theme.applyStyles("dark", {
                backgroundColor: theme.palette.grey[900],
              }),
            })}
          >
            <Typography
              variant="h6"
              sx={{
                color: "error.main",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              Danger Zone
            </Typography>

            <Typography variant="body1">
              ⚠️ Brisanje oglasa je <strong>trajna i nepovratna akcija</strong>.
              Ako postoje aktivne rezervacije, brisanje neće biti dozvoljeno.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => setDeleteOpen(true)}
                sx={{
                  fontWeight: "bold",
                  px: 3,
                  "&:hover": { bgcolor: "error.dark" },
                }}
              >
                Obriši oglas
              </Button>
            </Box>
          </Box>
        </Stack>
      </CardContent>

      {/* Modal za vidljivost */}
      <Dialog open={visibilityOpen} onClose={() => setVisibilityOpen(false)}>
        <DialogTitle>Promjena vidljivosti</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Da li ste sigurni da želite {hidden ? "prikazati" : "sakriti"} ovaj
            oglas?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVisibilityOpen(false)}>Otkaži</Button>
          <Button onClick={handleToggleVisibility} autoFocus>
            Potvrdi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal za brisanje */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Brisanje oglasa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Da li ste sigurni da želite obrisati ovaj oglas? Ova akcija je
            nepovratna.
          </DialogContentText>
          <TextField
            margin="normal"
            label="Unesite lozinku za potvrdu"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Otkaži</Button>
          <Button
            onClick={handleDeleteEstate}
            color="error"
            variant="contained"
            disabled={isDeletingEstate || password.length === 0}
          >
            Trajno obriši
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
