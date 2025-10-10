import { useParams } from "react-router";
import {
  Box,
  Button,
  Grid,
  Typography,
  Avatar,
  Paper,
  Stack,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { getReviewsListInfiniteScroll } from "./hooks/useReviews";
import AppLoader from "@/shared/components/AppLoader";
import AppError from "@/shared/components/errors/AppError";
import { GridExpandMoreIcon } from "@mui/x-data-grid";

export default function ReviewsForEstatePage() {
  const { estateId } = useParams();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = getReviewsListInfiniteScroll(estateId!);

  if (isPending) return <AppLoader loading={isPending} />;
  if (isError) return <AppError />;

  const reviews = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <Box sx={{ px: 3, pb: 6, pt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Recenzije smještaja
      </Typography>

      {reviews.length === 0 && (
        <Typography variant="body1" color="text.secondary">
          Još uvijek nema recenzija za ovaj smještaj.
        </Typography>
      )}

      <Grid container spacing={2}>
        {reviews.map((review) => (
          <Grid size={{ xs: 12, sm: 6 }} key={review._id}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                height: "100%",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              {/* Avatar i ime korisnika */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={review.user?.profilePictureUrl}
                  alt={review.userFullName}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {review.userFullName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.createdAt ?? "").toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>

              {/* Glavna ocjena */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" fontWeight={600}>
                  {review.rating.overall.toFixed(1)}
                </Typography>
                <Rating value={review.rating.overall} max={10} readOnly />
              </Stack>

              {/* Komentar */}
              {review.comment && (
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 4,
                    overflow: "hidden",
                  }}
                >
                  {review.comment}
                </Typography>
              )}

              {/* Accordion za detaljne ocjene */}
              <Accordion
                elevation={0}
                sx={{
                  bgcolor: "transparent",
                  mt: 1,
                  "&:before": { display: "none" }, // uklanja default border
                }}
              >
                <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                  <Typography variant="body2" fontWeight={600}>
                    Prikaži detaljne ocjene
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1.5}>
                    {Object.entries(review.rating)
                      .filter(([key]) => key !== "overall")
                      .map(([key, value]) => (
                        <Stack
                          key={key}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            variant="body2"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {key}
                          </Typography>
                          <Rating value={value} max={10} readOnly />
                        </Stack>
                      ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {hasNextPage && (
        <Box textAlign="center" mt={3}>
          <Button
            variant="outlined"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Učitavanje..." : "Učitaj još"}
          </Button>
        </Box>
      )}
    </Box>
  );
}
