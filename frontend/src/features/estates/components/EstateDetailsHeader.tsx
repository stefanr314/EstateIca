import { Grid, Box, Typography, Skeleton } from "@mui/material";
import Button from "@mui/material/Button";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";

interface EstateDetailsHeaderProps {
  title: string;
  images: { url: string; fileId: string; _id: string }[];
}

// helper
function getIKUrl(url: string, w: number, h: number, q = 90) {
  if (!url) return "";
  return `${url}?tr=w-${w * 2},h-${h * 2},fo-auto,q-${q},e-sharpen,c-at_max`;
}

function ImageWithSkeleton({
  src,
  alt,
  sx,
  onClick,
}: {
  src: string;
  alt: string;
  sx?: any;
  onClick?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
      {!loaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{ borderRadius: 2, position: "absolute", inset: 0 }}
        />
      )}
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        sx={{
          ...sx,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
        onClick={onClick}
      />
    </Box>
  );
}

export default function EstateDetailsHeader({
  title,
  images,
}: EstateDetailsHeaderProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (!images || images.length === 0) {
    return (
      <Grid container direction={"column"} spacing={2}>
        <Grid sx={{ xs: 12 }}>
          <Typography variant="h4">{title}</Typography>
        </Grid>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={300}
          sx={{
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Trenutno nema dostupnih slika za ovu nekretninu
          </Typography>
        </Box>
      </Grid>
    );
  }

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
          <ImageWithSkeleton
            src={getIKUrl(images?.[0]?.url ?? "", 800, 480)}
            alt={title}
            onClick={() => navigate(`/estate/${id}/album`)}
            sx={{
              objectFit: "cover",
              height: 480,
              width: "100%",
              borderRadius: 2,
              cursor: "pointer",
            }}
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
            display: { xs: "none", md: "block" },
          }}
        >
          <Box
            display="grid"
            width="100%"
            gridTemplateColumns="1fr 1fr"
            gridTemplateRows="1fr 1fr"
            gap={2}
            height={480}
          >
            {images.slice(1, 5).map((img, idx) => (
              <ImageWithSkeleton
                key={img._id}
                src={getIKUrl(img.url, 400, 240)}
                alt={`${title} - ${idx + 2}`}
                onClick={() => navigate(`/estate/${id}/album`)}
                sx={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                  borderRadius: 2,
                }}
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
