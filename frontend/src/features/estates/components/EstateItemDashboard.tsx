import {
  Box,
  Typography,
  Stack,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { AllPersonalEstatesData } from "../types";

interface EstateItemProps {
  estate: AllPersonalEstatesData;
  onClick: (id: string) => void;
  overlayText?: string; //
}

export default function EstateItem({
  estate,
  onClick,
  overlayText = "Prikazi rezervacije",
}: EstateItemProps) {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "stretch",
        height: 140,
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
        "&:hover .overlay": { opacity: 1 },
      }}
      onClick={() => onClick(estate._id)}
    >
      {/* Slika lijevo */}
      <CardMedia
        component="img"
        image={
          estate.images?.[0]?.url ||
          "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt={estate.title}
        sx={{
          width: 200,
          objectFit: "cover",
        }}
      />

      {/* Tekst desno */}
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom noWrap>
          {estate.title}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ color: "text.secondary" }}>
          <Typography variant="body2">
            📍 {estate.address.city}, {estate.address.country}
          </Typography>
          <Typography variant="body2">🏷 {estate.rentalType}</Typography>
          <Typography variant="body2">
            🏠{" "}
            {estate.estateType === "ResidentialEstate"
              ? "Stambena"
              : "Poslovna"}
          </Typography>
        </Stack>
      </CardContent>

      {/* Hover overlay */}
      <Box
        className="overlay"
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0, 0, 0, 0.500)",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0,
          transition: "opacity 0.3s",
          fontWeight: 600,
          fontSize: "1.2rem",
        }}
      >
        {overlayText}
      </Box>
    </Card>
  );
}
