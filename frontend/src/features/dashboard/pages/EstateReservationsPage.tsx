import { useGetEstateReservations } from "@/features/reservations/hook/useHostReservations";
import { Box } from "@mui/material";
import {
  DataGrid,
  GridPaginationModel,
  GridRowParams,
  GridSortModel,
} from "@mui/x-data-grid";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { getReservationColumns } from "../internals/data/gridData";
import HostReservationModal from "@/features/reservations/HostReservationModal";

function EstateReservationsPage() {
  const { estateId } = useParams<{ estateId: string }>();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0, // 0 = prva stranica
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "createdAt", sort: "desc" }, // default
  ]);

  const [searchParams, setSearchParams] = useSearchParams();
  const { data: estateReservations, isPending } = useGetEstateReservations(
    estateId!,
    paginationModel.page + 1,
    paginationModel.pageSize,
    searchParams,
    sortModel,
    { refetchOnMount: false, refetchOnWindowFocus: false }
  );

  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const reservationRows = estateReservations?.data || [];
  const totalRows = estateReservations?.meta.total || 0;

  const columns = getReservationColumns("estate");

  const handleRowClick = (params: GridRowParams) => {
    setSelectedRowId(params.row.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRowId(null);
  };
  if (!estateId)
    return <Box>Neispravni podaci o nekretnini, vratite se nazad...</Box>;
  return (
    <>
      <DataGrid
        rows={reservationRows}
        columns={columns}
        getRowId={(row) => row.id}
        loading={isPending}
        rowCount={totalRows}
        onRowClick={handleRowClick}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        sx={{
          cursor: "pointer",
        }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        disableRowSelectionOnClick
        slotProps={{
          filterPanel: {
            filterFormProps: {
              logicOperatorInputProps: {
                variant: "outlined",
                size: "small",
              },
              columnInputProps: {
                variant: "outlined",
                size: "small",
                sx: { mt: "auto" },
              },
              operatorInputProps: {
                variant: "outlined",
                size: "small",
                sx: { mt: "auto" },
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: "outlined",
                  size: "small",
                },
              },
            },
          },
        }}
      />

      {selectedRowId && (
        <HostReservationModal
          open={open}
          onClose={handleClose}
          reservationId={selectedRowId}
        />
      )}
    </>
  );
}

export default EstateReservationsPage;
