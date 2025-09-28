import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CustomizedDataGrid from "../components/CustomizedDataGrid";

function ReservationsDashboard() {
  return (
    <Stack gap={2} width={"100%"}>
      <Typography variant="h1">Vaše rezervacije</Typography>
      <CustomizedDataGrid />
    </Stack>
  );
}

export default ReservationsDashboard;
