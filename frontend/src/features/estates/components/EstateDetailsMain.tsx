import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { Paper, styled, useMediaQuery } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",

  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

function EstateDetailsMain() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Grid container spacing={3}>
      <Grid flex={1}>
        <Stack
          spacing={2}
          sx={{
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          <Item elevation={4} sx={{ height: 200 }}>
            Detalji Nekretnine
          </Item>
          <Item elevation={4} sx={{ height: 300 }}>
            Detalji Nekretnine
          </Item>
          <Item elevation={4} sx={{ height: 300 }}>
            Detalji Nekretnine
          </Item>
          <Item elevation={4} sx={{ height: 500 }}>
            Detalji Nekretnine
          </Item>
          <Item sx={{ height: 600 }}>
            Ovdje možete pronaći sve relevantne informacije o nekretnini.
          </Item>
        </Stack>
      </Grid>
      <Grid flex={1} sx={{ display: { xs: "none", md: "block" } }}>
        <Box
          sx={{
            position: "sticky",
            top: "25%",
            padding: 2,
            bgcolor: "secondary.main",
            height: "30rem",
          }}
        >
          <Typography variant="h5">Rezervisi Kartica</Typography>
          <Typography variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>
        </Box>
      </Grid>
      {!isMobile && (
        <Item
          sx={{
            position: "fixed",
            width: "100%",
            left: 0,
            bottom: 0,
            padding: 2,
            bgcolor: "secondary.main",
            height: "5rem",
          }}
        >
          Rezervisi Kartica
        </Item>
      )}
    </Grid>
  );
}

export default EstateDetailsMain;
