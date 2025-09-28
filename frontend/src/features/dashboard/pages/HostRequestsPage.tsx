import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import HostRequestDataGrid from "../components/HostRequestDataGrid";

function HostRequestsPage() {
  return (
    <Stack width={"100%"} maxWidth={"xl"} gap={2}>
      <Typography variant="h1">Pregledajte zahtjeve</Typography>;
      <HostRequestDataGrid />
    </Stack>
  );
}

export default HostRequestsPage;
