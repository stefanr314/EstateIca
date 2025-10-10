import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  Rating,
  Stack,
  Paper,
  Grid,
} from "@mui/material";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateReviewForReservation,
  useGetReviewDetails,
} from "@/features/reviews/hooks/useReviews";
import AppLoader from "@/shared/components/AppLoader";
import AppError from "@/shared/components/errors/AppError";
import { CreateReviewDto, createReviewDto } from "../types";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  reviewId: string | null;
  reservationId?: string;
}

export default function ReviewModal({
  open,
  onClose,
  reviewId,
  reservationId,
}: ReviewModalProps) {
  const hasReview = !!reviewId;

  const {
    data: review,
    isPending,
    isError,
    error,
  } = useGetReviewDetails(reviewId);
  const createReviewMutation = useCreateReviewForReservation();

  const { control, handleSubmit, reset } = useForm<CreateReviewDto>({
    resolver: zodResolver(createReviewDto),
    defaultValues: {
      rating: {
        overall: 0,
        cleanliness: 0,
        amenities: 0,
        host: 0,
        location: 0,
      },
      comment: "",
    },
  });

  // Ako je edit / pregled, napuni polja
  useEffect(() => {
    if (review) {
      reset({
        rating: review.rating,
        comment: review.comment,
      });
    }
    if (!open) {
      reset({
        rating: {
          overall: 0,
          cleanliness: 0,
          amenities: 0,
          host: 0,
          location: 0,
        },
        comment: "",
      });
    }
  }, [review, reset, open]);

  function onSubmit(data: CreateReviewDto) {
    console.log("OKE");
    if (!reservationId) return;
    createReviewMutation.mutate({ reservationId, body: data });
    onClose();
  }
  // console.error(error);

  if (hasReview && isPending) return <AppLoader loading={isPending} />;
  if (hasReview && isError) return <AppError message={error.message} />;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {hasReview ? "Detalji recenzije" : "Ostavi recenziju"}
      </DialogTitle>

      <DialogContent dividers>
        {hasReview ? (
          <Paper elevation={2} sx={{ p: 2 }}>
            {/* 🏡 Naslov smještaja */}
            <Typography variant="h6" gutterBottom>
              {review?.estate?.title || "Nepoznat smještaj"}
            </Typography>

            {/* 🧍‍♂️ Korisnik i datumi */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="body2" color="text.secondary">
                Korisnik:{" "}
                <strong>
                  {review?.user?.firstName} {review?.user?.lastName}
                </strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(
                  review?.reservation?.startDate ?? ""
                ).toLocaleDateString()}{" "}
                –{" "}
                {new Date(
                  review?.reservation?.endDate ?? ""
                ).toLocaleDateString()}
              </Typography>
            </Stack>

            {/* ⭐ Ocjene */}
            <Typography variant="h6" gutterBottom>
              Ocjene
            </Typography>
            <Stack
              spacing={1.5}
              sx={{
                mb: 2,
                "& .MuiTypography-root": { textTransform: "capitalize" },
              }}
            >
              {Object.keys(createReviewDto.shape.rating.shape).map((key) => (
                <Stack
                  key={key}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2">{key}</Typography>
                  <Rating
                    value={
                      review?.rating[key as keyof CreateReviewDto["rating"]]
                    }
                    max={10}
                    sx={{ color: "primary.main" }}
                    readOnly
                  />
                </Stack>
              ))}
            </Stack>

            {/* 💬 Komentar */}
            <Typography variant="h6" gutterBottom>
              Komentar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {review?.comment?.trim() ? review.comment : "Bez komentara"}
            </Typography>

            {/* 🕒 Datum kreiranja */}
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ display: "block", mt: 2, textAlign: "right" }}
            >
              Dodano:{" "}
              {review?.createdAt
                ? new Date(review.createdAt).toLocaleString()
                : "Nepoznato"}
            </Typography>
          </Paper>
        ) : (
          <form
            id="reviewForm"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)(e);
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Ocijenite različite aspekte smještaja
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              {Object.keys(createReviewDto.shape.rating.shape).map((key) => (
                <Grid size={{ xs: 12, sm: 6 }} key={key}>
                  <Controller
                    name={`rating.${key as keyof CreateReviewDto["rating"]}`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <Box>
                        <Typography
                          sx={{ mb: 0.5, textTransform: "capitalize" }}
                        >
                          {key}
                        </Typography>
                        <Rating
                          value={field.value}
                          max={10}
                          onChange={(_, val) => field.onChange(val)}
                        />
                        {fieldState.error && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 0.5, display: "block" }}
                          >
                            {fieldState.error.message ||
                              "Ovo polje je obavezno"}
                          </Typography>
                        )}
                      </Box>
                    )}
                  />
                </Grid>
              ))}
            </Grid>

            <Controller
              name="comment"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Komentar"
                  multiline
                  minRows={3}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
          </form>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Zatvori</Button>
        {!hasReview && (
          <Button
            variant="contained"
            form="reviewForm"
            type="submit"
            disabled={createReviewMutation.isPending}
          >
            Pošalji recenziju
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
