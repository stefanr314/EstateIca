import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

function EstateDetailsFooter() {
  return (
    <Stack spacing={2} justifyContent="center" alignItems="stretch">
      <Grid container spacing={2} width="100%">
        <Box
          sx={{
            width: "100%",
            height: 500,
            bgcolor: "lightgray",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          Detalji recenzije
        </Box>
      </Grid>
      <Grid container spacing={2} width="100%">
        <Box
          sx={{
            width: "100%",
            height: 800,
            bgcolor: "lightgray",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          Google API
        </Box>
      </Grid>
      <Grid container spacing={2} width="100%">
        <Box
          sx={{
            width: "100%",
            height: 400,
            bgcolor: "violet",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          Vlasnik
        </Box>
      </Grid>
    </Stack>
  );
}

export default EstateDetailsFooter;
