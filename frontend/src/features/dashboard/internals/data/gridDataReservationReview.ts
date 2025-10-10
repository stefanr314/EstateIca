import { CompletedReservationWithReviewRow } from "@/features/reservations/types";
import { GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { srLatn } from "date-fns/locale";

export const columnsResRev: GridColDef<CompletedReservationWithReviewRow>[] = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
    sortable: false,
  },
  {
    field: "estateTitle",
    headerName: "Smještaj",
    flex: 1,
    minWidth: 140,
  },
  {
    field: "estateType",
    headerName: "Tip smještaja",
    flex: 0.6,
    minWidth: 120,
  },
  {
    field: "rentalType",
    headerName: "Tip najma",
    flex: 0.6,
    minWidth: 120,
  },
  {
    field: "totalPrice",
    headerName: "Ukupna cijena (€)",
    flex: 0.6,
    minWidth: 120,
    type: "number",
    valueFormatter: (value: number) =>
      value !== undefined ? `${value.toFixed(2)} €` : "",
  },
  {
    field: "startDate",
    headerName: "Početak",
    flex: 0.6,
    minWidth: 130,
    type: "date",
    valueFormatter: (value, row) => {
      const isLongTerm = row.rentalType === "Long Term";
      if (!value) return "";

      return isLongTerm
        ? format(new Date(value), "MM yyyy", { locale: srLatn })
        : format(new Date(value), "dd.MM.yyyy", { locale: srLatn });
    },
  },
  {
    field: "endDate",
    headerName: "Kraj",
    flex: 0.6,
    minWidth: 130,
    valueFormatter: (value, row) => {
      const isLongTerm = row.rentalType === "Long Term";
      if (!value) return "";

      return isLongTerm
        ? format(new Date(value), "MM yyyy", { locale: srLatn })
        : format(new Date(value), "dd.MM.yyyy", { locale: srLatn });
    },
  },
  {
    field: "hasReview",
    headerName: "Recenzija",
    flex: 0.5,
    minWidth: 120,
    sortable: false,
    renderCell: (params) => (params.value ? "✔️ Postoji" : "📝 Nema recenzije"),
  },
  {
    field: "createdAt",
    headerName: "Kreirano",
    flex: 0.6,
    minWidth: 130,
    valueFormatter: (value) =>
      value ? format(new Date(value), "dd.MM.yyyy", { locale: srLatn }) : "",
  },
];
