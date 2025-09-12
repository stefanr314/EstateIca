import { Grid, Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { useNavigate, useParams } from "react-router";

interface EstateDetailsHeaderProps {
  title: string;
  images: { url: string; fileId: string; _id: string }[];
}

// helper
function getIKUrl(url: string, w: number, h: number, q = 90) {
  if (!url) return "";
  return `${url}?tr=w-${w * 2},h-${h * 2},fo-auto,q-${q},e-sharpen,c-at_max`;
}

export default function EstateDetailsHeader({
  title,
  images,
}: EstateDetailsHeaderProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <Grid container direction={"column"} spacing={2}>
      {/* Naslov */}
      <Grid sx={{ xs: 12 }}>
        <Typography variant="h4">{title}</Typography>
      </Grid>

      {/* Glavni red: Leva + Desna strana */}
      <Grid container spacing={3} sx={{ position: "relative" }}>
        {/* Leva polovina (1 velika slika) */}
        <Grid flex={1} sx={{ xs: 6, display: "inline-flex" }}>
          <Box
            component="img"
            src={getIKUrl(images?.[0]?.url ?? "", 800, 480)}
            alt={title}
            loading="lazy"
            decoding="async"
            sx={{
              objectFit: "cover",
              height: 480,
              width: "100%",
              borderRadius: 2,
              cursor: "pointer",
            }}
            onClick={() => navigate(`/estate/${id}/album`)}
          />
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
            {images.slice(1, 5).map((img, idx) => (
              <Box
                key={idx}
                component="img"
                src={getIKUrl(img.url, 400, 240)}
                alt={`${title} - ${idx + 2}`}
                sx={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                  borderRadius: 2,
                }}
                onClick={() => navigate(`/estate/${id}/album`)}
              />
            ))}
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
