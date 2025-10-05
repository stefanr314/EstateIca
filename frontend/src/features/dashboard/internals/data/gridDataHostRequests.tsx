import { HostRequestRow } from "@/features/host-requests/types";
import { Box, Chip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export const columns: GridColDef<HostRequestRow>[] = [
  { field: "user", headerName: "ID korisnika", width: 200 },
  {
    field: "requestedType",
    headerName: "Tip zahtjeva",
    width: 150,
    type: "singleSelect",
    valueOptions: ["regular", "business", "both"],
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    type: "singleSelect",
    valueOptions: ["pending", "rejected", "approved"],
    renderCell: (
      params: GridRenderCellParams<
        HostRequestRow,
        "pending" | "rejected" | "approved"
      >
    ) => {
      let color: "warning" | "error" | "success" | "default";
      switch (params.value) {
        case "pending":
          color = "warning";
          break;
        case "rejected":
          color = "error";
          break;
        case "approved":
          color = "success";
          break;
        default:
          color = "default";
      }
      return <Chip label={params.value} color={color} size="small" />;
    },
  },
  { field: "archived", headerName: "Arhiviran", type: "boolean", width: 100 },
  { field: "reason", headerName: "Razlog", width: 250 },
  {
    field: "adminComment",
    headerName: "Odgovor administratora",
    width: 300,
    renderCell: (params: GridRenderCellParams<HostRequestRow, string>) => (
      <Box
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
        }}
      >
        {params.value}
      </Box>
    ),
  },
  {
    field: "createdAt",
    headerName: "Kreiran",
    type: "string",
    width: 180,
  },
  {
    field: "updatedAt",
    headerName: "Azuriran",
    valueFormatter: (params: any) =>
      new Date(params.value as string).toLocaleString("sr-Latn"),
    width: 180,
  },
];
