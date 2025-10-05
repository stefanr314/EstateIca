import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CustomizedDataGrid from "../components/CustomizedDataGrid";
import ReservationFilters from "@/features/reservations/components/ReservationsFilter";

function ReservationsDashboard() {
  return (
    <Stack gap={2} width={"100%"}>
      <Typography variant="h1">Vaše napravljene rezervacije</Typography>
      <ReservationFilters />
      <CustomizedDataGrid />
    </Stack>
  );
}

export default ReservationsDashboard;
