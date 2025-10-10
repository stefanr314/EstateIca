import AppLoader from "@/shared/components/AppLoader";
import { useGetCompletedReservationsWithReviews } from "../reservations/hook/useReservations";
import AppError from "@/shared/components/errors/AppError";
import { Box, Stack, Typography } from "@mui/material";
import { DataGrid, GridRowParams } from "@mui/x-data-grid";
import { columnsResRev } from "../dashboard/internals/data/gridDataReservationReview";
import { CompletedReservationWithReviewRow } from "../reservations/types";
import { useState } from "react";
import ReviewModal from "./components/ReviewModal";

function ReservationReviewDataGridPage() {
  const {
    data: reservations,
    isPending,
    isError,
  } = useGetCompletedReservationsWithReviews();
  const rows = reservations ?? [];

  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);

  function handleRowClick(params: GridRowParams) {
    setSelectedRowId((params.row as CompletedReservationWithReviewRow).id);
    setReviewId((params.row as CompletedReservationWithReviewRow).reviewId);
    console.log(params.row.id, params.row.reviewId);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setSelectedRowId(null);
    setReviewId(null);
  }

  if (isPending) return <AppLoader loading={isPending} />;
  if (isError) return <AppError />;

  return (
    <>
      <Box sx={{ width: "100%", height: "70vh", mt: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6">Završene rezervacije</Typography>
        </Stack>
        <DataGrid
          rows={rows}
          columns={columnsResRev}
          getRowId={(row) => row.id}
          onRowClick={handleRowClick}
          disableRowSelectionOnClick
          disableColumnResize
          loading={isPending}
          pageSizeOptions={[5, 10, 20]}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
            cursor: "pointer",
            "& .MuiDataGrid-cell": { py: 1 },
          }}
        />
      </Box>
      {selectedRowId && (
        <ReviewModal
          open={open}
          onClose={handleClose}
          reservationId={selectedRowId}
          reviewId={reviewId}
        />
      )}
    </>
  );
}

export default ReservationReviewDataGridPage;
