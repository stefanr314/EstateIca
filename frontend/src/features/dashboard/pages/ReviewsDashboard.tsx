import HostEstatesList from "@/features/estates/components/HostEstatesListDashboard";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";

function ReviewsDashboard() {
  return (
    <Stack gap={3}>
      <Typography variant="h2">Recenzije vasih smjestaja</Typography>
      <HostEstatesList
        navigateBasePath="/dashboard/reviews/estates"
        overlayText="Prikaži recenzije"
      />
    </Stack>
  );
}

export default ReviewsDashboard;
