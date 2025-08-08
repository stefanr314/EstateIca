import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CustomizedDataGrid from "../components/CustomizedDataGrid";

function ReservationsDashboard() {
  return (
    <Stack gap={2} width={"100%"}>
      <Typography variant="h2">Your Reservations</Typography>
      <CustomizedDataGrid />
    </Stack>
  );
}

export default ReservationsDashboard;
