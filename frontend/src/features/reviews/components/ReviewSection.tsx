// import { Box, Grid, Typography, Rating, Divider, Stack } from "@mui/material";
// import { SubRatings } from "./SubRatings";

// interface ReviewSectionProps {
//   averageRating: {
//     overall: number;
//     cleanliness: number;
//     amenities: number;
//     host: number;
//     location: number;
//   };
//   reviewsCount: number;
// }

// export default function ReviewSection({
//   averageRating,
//   reviewsCount,
// }: ReviewSectionProps) {
//   if (reviewsCount === 0) {
//     return (
//       <Box display={"flex"} justifyContent="center" alignItems="center" p={4}>
//         <Typography variant="h6" color="text.secondary" textAlign="center">
//           Nema dostupnih recenzija
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         width: "100%",
//         p: { xs: 2, md: 4 },
//         borderRadius: 3,
//         bgcolor: "background.paper",
//         boxShadow: 2,
//       }}
//     >
//       <Grid container spacing={4} alignItems="flex-start">
//         {/* LEFT: Overall Rating */}
//         <Grid size={{ xs: 12, md: 5 }}>
//           <Stack alignItems="center" spacing={2}>
//             <Typography variant="h5" fontWeight={700}>
//               Ocjene gostiju
//             </Typography>

//             <Stack direction="row" alignItems="center" spacing={1}>
//               <Typography variant="h2" fontWeight={700} color="primary.main">
//                 {averageRating.overall.toFixed(1)}
//               </Typography>
//               <Typography variant="h6" color="text.secondary">
//                 /10
//               </Typography>
//             </Stack>

//             <Rating
//               value={averageRating.overall}
//               max={10}
//               precision={0.5}
//               readOnly
//               sx={{ fontSize: 32, color: "primary.main" }}
//             />

//             <Typography variant="body2" color="text.secondary">
//               Na osnovu {reviewsCount} recenzija
//             </Typography>
//           </Stack>
//         </Grid>

//         {/* RIGHT: Sub-ratings */}
//         <Grid size={{ xs: 12, md: 7 }} flex={1} width={"100%"}>
//           <SubRatings averageRating={averageRating} />
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }
import {
  Box,
  Grid,
  Typography,
  Rating,
  Divider,
  Stack,
  Avatar,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getReviewsListInfiniteScroll } from "../hooks/useReviews";
import { SubRatings } from "./SubRatings";
import { ReviewEstate } from "../types";
import { Item } from "@/features/estates/components/EstateDetailsMain";
interface ReviewSectionProps {
  estateId: string;
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
  estateId,
  averageRating,
  reviewsCount,
}: ReviewSectionProps) {
  // Infinite Query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    getReviewsListInfiniteScroll(estateId);

  if (reviewsCount === 0) {
    return (
      <Item elevation={4} sx={{ width: "100%" }}>
        <Typography variant="h5" color="text.secondary" textAlign="center">
          Nema dostupnih recenzija
        </Typography>
      </Item>
    );
  }

  return (
    <Item
      elevation={4}
      sx={{
        width: "100%",
        p: { xs: 2, md: 4 },
      }}
    >
      <Grid container spacing={4} alignItems="flex-start">
        {/* LEFT: Overall Rating */}
        <Grid
          sx={{
            xs: 12,
            md: 5,
            display: { xs: "flex", lg: "flex" },
            flexDirection: "column",
            alignItems: { xs: "center", lg: "center" },
            order: { xs: 0, md: 0, lg: 0 },
          }}
        >
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
        <Grid
          sx={{
            xs: 12,
            md: 7,
            flex: { xs: "0 0 auto", md: "1 1 auto", lg: 1 },
            width: "100%",
          }}
        >
          <SubRatings averageRating={averageRating} />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Lista pojedinačnih recenzija */}
      <Stack spacing={2}>
        {data?.pages.map((page, i) =>
          page.data.map((review: ReviewEstate) => (
            <Accordion key={review._id} disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={review.user.profilePictureUrl}
                    alt={review.userFullName}
                  />
                  <Box>
                    <Typography fontWeight={600}>
                      {review.userFullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {review.comment?.slice(0, 100)}
                      {review.comment && review.comment.length > 100 && "..."}
                    </Typography>
                    <Typography variant="caption" color="primary">
                      Ocjena: {review.rating.overall}/10
                    </Typography>
                  </Box>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  <Rating
                    value={review.rating.overall}
                    max={10}
                    precision={0.5}
                    readOnly
                  />
                  <Typography variant="body1">{review.comment}</Typography>

                  <Divider />

                  <Typography variant="subtitle2">
                    Čistoća: {review.rating.cleanliness}/10
                  </Typography>
                  <Typography variant="subtitle2">
                    Lokacija: {review.rating.location}/10
                  </Typography>
                  <Typography variant="subtitle2">
                    Domaćin: {review.rating.host}/10
                  </Typography>
                  <Typography variant="subtitle2">
                    Sadržaji: {review.rating.amenities}/10
                  </Typography>
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Stack>

      {/* Load More dugme */}
      {hasNextPage && (
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Učitavanje..." : "Prikaži više recenzija"}
        </Button>
      )}
    </Item>
  );
}
