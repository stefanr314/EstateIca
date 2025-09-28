import { HostRequestRow } from "@/features/host-requests/types";
import { Box, Chip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

// export const dummyRows: HostRequestRow[] = [
//   {
//     id: "1",
//     user: "jlsadfjklasdf",
//     requestedType: "regular",
//     status: "pending",
//     archived: false,
//     reason:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto voluptate magni dolore quam libero eaque consequuntur iure adipisci cum, minus sit pariatur maxime enim maiores quo aperiam accusamus eius? Nisi?",
//     adminComment:
//       "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laudantium ullam adipisci id quod a iusto quos cupiditate nobis quasi. Laboriosam adipisci non, praesentium dolorum atque veniam inventore tempore nemo dolore.lorem lorem lorem lorem rosa odorata est",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "2",
//     user: "jlsadfjklasdf",
//     requestedType: "business",
//     status: "rejected",
//     archived: true,
//     reason:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto voluptate magni dolore quam libero eaque consequuntur iure adipisci cum, minus sit pariatur maxime enim maiores quo aperiam accusamus eius? Nisi?",
//     adminComment:
//       "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laudantium ullam adipisci id quod a iusto quos cupiditate nobis quasi. Laboriosam adipisci non, praesentium dolorum atque veniam inventore tempore nemo dolore.lorem lorem lorem lorem rosa odorata est",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: "3",
//     user: "jsadlfjasloe",
//     requestedType: "regular",
//     status: "approved",
//     archived: false,
//     reason:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto voluptate magni dolore quam libero eaque consequuntur iure adipisci cum, minus sit pariatur maxime enim maiores quo aperiam accusamus eius? Nisi?",
//     adminComment:
//       "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laudantium ullam adipisci id quod a iusto quos cupiditate nobis quasi. Laboriosam adipisci non, praesentium dolorum atque veniam inventore tempore nemo dolore.lorem lorem lorem lorem rosa odorata est",
//     createdAt: new Date(+10),
//     updatedAt: new Date(),
//   },
//   {
//     id: "4",
//     user: "dasfdsafsdfas",
//     requestedType: "regular",
//     status: "pending",
//     archived: false,
//     reason:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto voluptate magni dolore quam libero eaque consequuntur iure adipisci cum, minus sit pariatur maxime enim maiores quo aperiam accusamus eius? Nisi?",
//     adminComment:
//       "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laudantium ullam adipisci id quod a iusto quos cupiditate nobis quasi. Laboriosam adipisci non, praesentium dolorum atque veniam inventore tempore nemo dolore.lorem lorem lorem lorem rosa odorata est",
//     createdAt: new Date(+5),
//     updatedAt: new Date(),
//   },
//   {
//     id: "5",
//     user: "jlsadfjklasdf",
//     requestedType: "regular",
//     status: "rejected",
//     archived: true,
//     reason:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto voluptate magni dolore quam libero eaque consequuntur iure adipisci cum, minus sit pariatur maxime enim maiores quo aperiam accusamus eius? Nisi?",
//     adminComment:
//       "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laudantium ullam adipisci id quod a iusto quos cupiditate nobis quasi. Laboriosam adipisci non, praesentium dolorum atque veniam inventore tempore nemo dolore.lorem lorem lorem lorem rosa odorata est",
//     createdAt: new Date(+2),
//     updatedAt: new Date(),
//   },
// ];

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
