import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MainHostReservationPage from "../components/MainHostReservationDashboard";

function HostReservationDashboard() {
  return (
    <Stack gap={2} width={"100%"}>
      <Typography variant="h1">Rezervacije vasih nekretnina</Typography>
      <MainHostReservationPage />
    </Stack>
  );
}

export default HostReservationDashboard;
