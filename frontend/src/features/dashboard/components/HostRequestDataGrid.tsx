import { useState } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridRowClassNameParams } from "@mui/x-data-grid";
import { HostRequestRow } from "@/features/host-requests/types";
import {
  // dummyRows,
  columns as hostRequestColumns,
} from "../internals/data/gridDataHostRequests";
import { useGetAllHostRequests } from "@/features/host-requests/hook/useHostRequests";
import { useSearchParams } from "react-router";
import { GridPaginationModel } from "@mui/x-data-grid";
import HostRequestModal from "@/features/host-requests/HostRequestModal";
import { gray } from "@/shared/ui/theme";

export default function HostRequestDataGrid() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0, // ⚠️ DataGrid koristi zero-based index (0 = prva stranica)
    pageSize: 10,
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<HostRequestRow | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const { data: response, isLoading } = useGetAllHostRequests(
    paginationModel.page + 1,
    paginationModel.pageSize,
    searchParams
  );

  const totalRows = response?.totalCount || 0;
  const dataRows = response?.data || [];

  const handleRowClick = (params: any) => {
    if (!params.row.archived) {
      setSelectedRow(params.row as HostRequestRow);
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };

  const getRowClassName = (params: GridRowClassNameParams<HostRequestRow>) => {
    return params.row.archived ? "archived-row" : "";
  };

  return (
    <Box
      sx={{
        // width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      <DataGrid
        rows={dataRows}
        columns={hostRequestColumns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        loading={isLoading}
        rowCount={totalRows}
        getRowId={(row) => row._id}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        onRowClick={handleRowClick}
        getRowClassName={getRowClassName}
        disableRowSelectionOnClick
        // showToolbar
        sx={{
          cursor: "pointer",
          "& .archived-row": {
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? gray[300] : gray[700],
            pointerEvents: "none", // Make row non-clickable
            cursor: "not-allowed",
            "& .MuiDataGrid-cell": {
              color: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.text.disabled
                  : theme.palette.grey[600],
            },
          },
        }}
      />

      {selectedRow && (
        <HostRequestModal
          open={openModal}
          requestId={selectedRow._id}
          onClose={handleCloseModal}
        />
      )}
    </Box>
  );
}
