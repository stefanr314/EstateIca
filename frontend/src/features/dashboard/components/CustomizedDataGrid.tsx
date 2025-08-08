import * as React from "react";
import { DataGrid, GridRowParams } from "@mui/x-data-grid";
import { columns, rows } from "../internals/data/gridData";
import ReservationModal, {
  Reservation,
} from "@/features/reservations/ReservationModal";

export default function CustomizedDataGrid() {
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<Reservation | null>(
    null
  );

  const handleRowClick = (params: GridRowParams) => {
    setSelectedRow(params.row as Reservation);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        onRowClick={handleRowClick}
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

      {selectedRow && (
        <ReservationModal
          open={open}
          onClose={handleClose}
          reservation={selectedRow}
        />
      )}
    </>
  );
}
