import { GridColDef } from "@mui/x-data-grid";
import { Reservation } from "@/features/reservations/ReservationModal";

// Mock data for reservations
export const rows: Reservation[] = [
  {
    id: "1",
    status: "confirmed",
    createdAt: "2024-01-15",
    checkIn: "2024-02-01",
    checkOut: "2024-02-05",
    nights: 4,
    guestName: "Marko Petrović",
    guestEmail: "marko.petrovic@email.com",
    guestPhone: "+381 60 123 4567",
    guestCount: { adults: 2, children: 1, infants: 0 },
    notes: "Rano check-in ako je moguće",
    estateTitle: "Modern Apartman u centru",
    estateAddress: "Knez Mihailova 15, Beograd",
    estateThumbnailUrl:
      "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36",
    totalPrice: 320,
    cancellationPolicy: "flexible",
    paymentStatus: "unpaid",
  },
  {
    id: "2",
    status: "pending",
    createdAt: "2024-01-16",
    checkIn: "2024-02-10",
    checkOut: "2024-02-12",
    nights: 2,
    guestName: "Ana Jovanović",
    guestEmail: "ana.jovanovic@email.com",
    guestCount: { adults: 1, children: 0 },
    estateTitle: "Vikendica na Zlatiboru",
    estateAddress: "Zlatibor bb, Zlatibor",
    estateThumbnailUrl:
      "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36",
    totalPrice: 180,
    cancellationPolicy: "moderate",
    paymentStatus: "unpaid",
  },
  {
    id: "3",
    status: "cancelled",
    createdAt: "2024-01-14",
    checkIn: "2024-01-25",
    checkOut: "2024-01-28",
    nights: 3,
    guestName: "Petar Nikolić",
    guestEmail: "petar.nikolic@email.com",
    guestPhone: "+381 64 987 6543",
    guestCount: { adults: 3, children: 2 },
    estateTitle: "Kuća sa bazenom",
    estateAddress: "Novi Sad, Fruška Gora",
    estateThumbnailUrl:
      "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36",
    totalPrice: 450,
    cancellationPolicy: "strict",
    paymentStatus: "unpaid",
  },
  {
    id: "4",
    status: "confirmed",
    createdAt: "2024-01-17",
    checkIn: "2024-02-15",
    checkOut: "2024-02-20",
    nights: 5,
    guestName: "Marija Đorđević",
    guestEmail: "marija.djordjevic@email.com",
    guestCount: { adults: 2, children: 0 },
    notes: "Posebne zahtjeve za parking",
    estateTitle: "Studio apartman",
    estateAddress: "Dorćol, Beograd",
    estateThumbnailUrl:
      "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36",
    totalPrice: 280,
    cancellationPolicy: "flexible",
    paymentStatus: "unpaid",
  },
  {
    id: "5",
    status: "pending",
    createdAt: "2024-01-18",
    checkIn: "2024-02-25",
    checkOut: "2024-02-27",
    nights: 2,
    guestName: "Stefan Popović",
    guestEmail: "stefan.popovic@email.com",
    guestCount: { adults: 1, children: 0 },
    estateTitle: "Kabina u prirodi",
    estateAddress: "Tara, Nacionalni park",
    estateThumbnailUrl:
      "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36",
    totalPrice: 160,
    cancellationPolicy: "moderate",
    paymentStatus: "unpaid",
  },
];

export const columns: GridColDef[] = [
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
        confirmed: "#4caf50",
        pending: "#ff9800",
        cancelled: "#f44336",
      };
      return (
        <div
          style={{
            backgroundColor:
              statusColors[params.value as keyof typeof statusColors] || "#ccc",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "500",
            textTransform: "capitalize",
          }}
        >
          {params.value}
        </div>
      );
    },
  },
  {
    field: "guestName",
    headerName: "Gost",
    width: 150,
  },
  {
    field: "estateTitle",
    headerName: "Smještaj",
    width: 200,
  },
  {
    field: "checkIn",
    headerName: "Check-in",
    width: 120,
    type: "date",
    valueFormatter: (params: any) => {
      return new Date(params.value).toLocaleDateString("sr-RS");
    },
  },
  {
    field: "checkOut",
    headerName: "Check-out",
    width: 120,
    type: "date",
    valueFormatter: (params: any) => {
      return new Date(params.value).toLocaleDateString("sr-RS");
    },
  },
  {
    field: "nights",
    headerName: "Noći",
    width: 80,
    type: "number",
  },
  {
    field: "guestCount",
    headerName: "Gosti",
    width: 100,
    renderCell: (params) => {
      const { adults, children, infants } = params.value;
      return `${adults}${children > 0 ? `+${children}` : ""}${
        infants > 0 ? `+${infants}` : ""
      }`;
    },
  },
  {
    field: "totalPrice",
    headerName: "Cena",
    width: 100,
    type: "number",
    valueFormatter: (params: any) => {
      return `€${params.value}`;
    },
  },
  {
    field: "paymentStatus",
    headerName: "Plaćanje",
    width: 100,
    renderCell: (params) => {
      return (
        <div
          style={{
            backgroundColor: params.value === "paid" ? "#4caf50" : "#ff9800",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "500",
            textTransform: "capitalize",
          }}
        >
          {params.value === "paid" ? "Plaćeno" : "Neplaćeno"}
        </div>
      );
    },
  },
  {
    field: "createdAt",
    headerName: "Kreirano",
    width: 120,
    type: "date",
    valueFormatter: (params: any) => {
      return new Date(params.value).toLocaleDateString("sr-RS");
    },
  },
];
