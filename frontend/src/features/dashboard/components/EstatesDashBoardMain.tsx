import { useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { usePersonalEstates } from "@/features/estates/hooks/useEstate";
import { AllPersonalEstatesData } from "@/features/estates/types";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import AppLoader from "@/shared/components/AppLoader";

import AddHomeIcon from "@mui/icons-material/AddHome";

const limit = 9;

export default function YourEstatesDashboard() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const { data: response, isLoading } = usePersonalEstates(
    page,
    limit,
    searchParams
  );

  const personalEstates: AllPersonalEstatesData[] = response?.data || [];
  const totalCount = response?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  if (isLoading) return <AppLoader loading={isLoading} />;

  return (
    <Box sx={{ px: 3, pb: 6, pt: 3 }}>
      <Stack
        direction="row"
        justifyContent="end"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard/your-estates/create")}
          endIcon={<AddHomeIcon />}
        >
          + Dodaj nekretninu
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {personalEstates.map((estate) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={estate._id}>
            <Card
              sx={{
                height: "100%", // sve kartice iste visine
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.01)" },
              }}
              onClick={() => navigate(`/dashboard/your-estates/${estate._id}`)}
            >
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    estate.images?.[0]?.url ||
                    "https://via.placeholder.com/400x250?text=No+Image"
                  }
                  alt={estate.title}
                  sx={{
                    filter: estate.hidden
                      ? "grayscale(100%) brightness(60%)"
                      : "none",
                  }}
                />
                {estate.hidden && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "white",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    Sakriveno
                  </Box>
                )}
              </Box>

              {/* 📌 content se širi, actions pada na dno */}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" noWrap>
                  {estate.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 3, // max 3 linije
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {estate.description}
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ mt: 1, flexWrap: "wrap" }}
                >
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

              <CardActions>
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/your-estates/${estate._id}`);
                  }}
                >
                  Uredi
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      )}
    </Box>
  );
}
