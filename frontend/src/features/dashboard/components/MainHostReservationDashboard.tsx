import HostEstatesList from "@/features/estates/components/HostEstatesListDashboard";
import { Box, Typography, Paper, Divider } from "@mui/material";

export default function MainHostReservationPage() {
  return (
    <Paper sx={{ p: 4, minHeight: "80vh" }}>
      {/* 📌 Filter sekcija (sutra dodaješ Chipove/Tabs)
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filteri rezervacija
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            minHeight: "40px", // da ostane prostor i kad filtera nema
          }}
        >
          //TODO: Dodaj filtere ovdje
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} /> */}

      {/* 📌 Naslov */}
      <Typography
        variant="h5"
        sx={{ color: "primary.main", fontWeight: 600, mb: 3 }}
      >
        Najprije odaberite nekretninu za koju želite da vidite rezervacije
      </Typography>

      {/* 📌 Lista korisnikovih estate-ova */}
      <HostEstatesList navigateBasePath="/dashboard/reservations/estates" />
    </Paper>
  );
}
