import { Grid, Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { useNavigate, useParams } from "react-router";

export default function EstateDetailsHeader() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  return (
    <Grid container direction={"column"} spacing={2}>
      {/* Naslov */}
      <Grid sx={{ xs: 12 }}>
        <Typography variant="h4">Estate Title</Typography>
      </Grid>

      {/* Glavni red: Leva + Desna strana */}
      <Grid container spacing={3} sx={{ position: "relative" }}>
        {/* Leva polovina (1 velika slika) */}
        <Grid flex={1} sx={{ xs: 6, display: "inline-flex" }}>
          <Box
            sx={{
              bgcolor: "blueviolet",
              height: 480,
              width: "100%",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            Leva slika
          </Box>
        </Grid>

        {/* Desna polovina (4 male slike raspoređene 2x2) */}

        <Grid
          flex={1}
          container
          spacing={2}
          sx={{
            xs: 12,
            md: 6,

            display: {
              xs: "none", // sakrij na malim ekranima
              md: "block", // prikaži na md i većim
            },
          }}
        >
          <Box
            display="grid"
            width={"100%"}
            gridTemplateColumns="1fr 1fr"
            gridTemplateRows="1fr 1fr"
            gap={2}
            height={480}
          >
            <Box
              bgcolor="lightblue"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              1
            </Box>
            <Box
              bgcolor="lightgreen"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              2
            </Box>
            <Box
              bgcolor="lightcoral"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              3
            </Box>
            <Box
              bgcolor="khaki"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              4
            </Box>
          </Box>
        </Grid>
        {/* Button for opening album */}
        <Button
          variant="outlined"
          color="primary"
          endIcon={<PhotoLibraryIcon />}
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 10,
            bgcolor: "white",
            boxShadow: 2,
            borderRadius: 2,
          }}
          onClick={() => navigate(`/estate/${id}/album`)}
        >
          Album slika
        </Button>
      </Grid>
    </Grid>
  );
}
