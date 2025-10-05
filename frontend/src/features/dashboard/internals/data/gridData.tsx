// features/reservations/internals/data/getReservationColumns.ts
import { GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import { getSmartMonthCount } from "@/shared/helper/getSmartMonthCalculator";
import { ReservationStatus } from "@/features/reservations/types";

type ColumnVariant = "user" | "estate"; // user = prikaz za gosta, estate = prikaz za hosta

export const getReservationColumns = (variant: ColumnVariant): GridColDef[] => {
  const participantColumn =
    variant === "user"
      ? {
          field: "hostName",
          headerName: "Vlasnik",
          width: 120,
        }
      : {
          field: "guestName",
          headerName: "Gost",
          width: 120,
        };

  return [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      sortable: false,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const statusColors = {
          [ReservationStatus.CONFIRMED]: "success.light",
          [ReservationStatus.PENDING]: "warning.main",
          [ReservationStatus.CANCELED]: "error.main",
          [ReservationStatus.COMPLETED]: "info.dark",
        };
        return (
          <Box
            sx={{
              bgcolor:
                statusColors[params.value as ReservationStatus] || grey[300],
              color: "black",
              px: 0.5,
              borderRadius: 5,
              fontWeight: 500,
              textTransform: "capitalize",
              textAlign: "center",
            }}
          >
            {params.value}
          </Box>
        );
      },
    },
    {
      field: "estateTitle",
      headerName: "Smještaj",
      width: 150,
    },
    participantColumn, // 👈 dinamična kolona
    {
      field: "startDate",
      headerName: "Dolazak",
      width: 120,
      type: "date",
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString("sr-RS") : "—",
    },
    {
      field: "endDate",
      headerName: "Odlazak",
      width: 120,
      type: "date",
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString("sr-RS") : "—",
    },
    {
      field: "stayDuration",
      headerName: "Boravak",
      width: 140,
      valueGetter: (value, row) => {
        if (!row?.startDate || !row?.endDate) return "—";
        const start = new Date(row.startDate);
        const end = new Date(row.endDate);

        if (row.rentalType === "Long Term") {
          const months = getSmartMonthCount(start, end);
          return `${months} mj`;
        } else {
          const days = Math.ceil(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
          );
          return days > 0 ? `${days} noći` : "—";
        }
      },
    },
    {
      field: "guests",
      headerName: "Gosti",
      width: 80,
      valueGetter: (value, row) => {
        if (!row?.guestCount && !row?.childrenCount) return "—";
        const adults = row.guestCount ?? 0;
        const children = row.childrenCount ?? 0;
        return adults > 0
          ? `${adults}${children > 0 ? `+${children}` : ""}`
          : "—";
      },
    },
    {
      field: "totalPrice",
      headerName: "Ukupna cijena",
      width: 100,
      type: "number",
      valueFormatter: (params) => `€${params}`,
    },
    {
      field: "rentalType",
      headerName: "Tip boravka",
      width: 100,
    },
    {
      field: "note",
      headerName: "Napomena",
      width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
          title={params.value || "—"}
        >
          {params.value || "—"}
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Kreirano",
      width: 120,
      type: "date",
      valueFormatter: (value) => new Date(value).toLocaleDateString("sr-RS"),
    },
  ];
};
