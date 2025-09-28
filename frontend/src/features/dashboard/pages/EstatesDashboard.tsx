import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import YourEstatesDashboard from "../components/EstatesDashBoardMain";

function EstatesDashboard() {
  return (
    <Stack width={"100%"}>
      <Typography variant="h2">Vaše nekretnine</Typography>
      <YourEstatesDashboard />
    </Stack>
  );
}

export default EstatesDashboard;
