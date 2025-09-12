import { Box, Grid, Typography, Rating, Divider, Stack } from "@mui/material";
import { SubRatings } from "./SubRatings";

interface ReviewSectionProps {
  averageRating: {
    overall: number;
    cleanliness: number;
    amenities: number;
    host: number;
    location: number;
  };
  reviewsCount: number;
}

export default function ReviewSection({
  averageRating,
  reviewsCount,
}: ReviewSectionProps) {
  if (reviewsCount === 0) {
    return (
      <Box display={"flex"} justifyContent="center" alignItems="center" p={4}>
        <Typography variant="h6" color="text.secondary" textAlign="center">
          Nema dostupnih recenzija
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 2, md: 4 },
        borderRadius: 3,
        bgcolor: "background.paper",
        boxShadow: 2,
      }}
    >
      <Grid container spacing={4} alignItems="flex-start">
        {/* LEFT: Overall Rating */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack alignItems="center" spacing={2}>
            <Typography variant="h5" fontWeight={700}>
              Ocjene gostiju
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h2" fontWeight={700} color="primary.main">
                {averageRating.overall.toFixed(1)}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                /10
              </Typography>
            </Stack>

            <Rating
              value={averageRating.overall}
              max={10}
              precision={0.5}
              readOnly
              sx={{ fontSize: 32, color: "primary.main" }}
            />

            <Typography variant="body2" color="text.secondary">
              Na osnovu {reviewsCount} recenzija
            </Typography>
          </Stack>
        </Grid>

        {/* RIGHT: Sub-ratings */}
        <Grid size={{ xs: 12, md: 7 }} flex={1} width={"100%"}>
          <SubRatings averageRating={averageRating} />
        </Grid>
      </Grid>
    </Box>
  );
}
