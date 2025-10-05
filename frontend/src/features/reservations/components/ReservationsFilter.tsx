import { useSearchParams } from "react-router";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { ReservationStatus } from "../types";

export default function ReservationFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // privremeni state da korisnik može podešavati filtere bez refetcha svaki put
  const [status, setStatus] = useState<ReservationStatus | "">(
    (searchParams.get("status") as ReservationStatus) || ""
  );
  const [startDate, setStartDate] = useState<Date | null>(
    searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : null
  );

  const handleApply = () => {
    const newParams = new URLSearchParams(searchParams);

    if (status) {
      newParams.set("status", status);
    } else {
      newParams.delete("status");
    }

    if (startDate) {
      newParams.set("startDate", startDate.toISOString().split("T")[0]);
    } else {
      newParams.delete("startDate");
    }

    if (endDate) {
      newParams.set("endDate", endDate.toISOString().split("T")[0]);
    } else {
      newParams.delete("endDate");
    }

    newParams.set("page", "1"); // reset paginacije na prvu
    setSearchParams(newParams);
  };

  const handleClear = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("status");
    newParams.delete("startDate");
    newParams.delete("endDate");
    newParams.set("page", "1");
    setSearchParams(newParams);

    setStatus("");
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filteri rezervacija
      </Typography>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="center"
      >
        {/* Status */}
        <TextField
          select
          label="Status"
          size="small"
          sx={{ minWidth: 180 }}
          value={status}
          onChange={(e) => setStatus(e.target.value as ReservationStatus)}
        >
          <MenuItem value="">Svi</MenuItem>
          <MenuItem value={ReservationStatus.CONFIRMED}>Potvrđene</MenuItem>
          <MenuItem value={ReservationStatus.PENDING}>Na čekanju</MenuItem>
          <MenuItem value={ReservationStatus.CANCELED}>Otkazane</MenuItem>
          <MenuItem value={ReservationStatus.COMPLETED}>Završene</MenuItem>
        </TextField>

        {/* Datumi */}
        <DatePicker
          label="Od"
          disableFuture
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          slotProps={{ textField: { size: "small" } }}
        />

        <DatePicker
          label="Do"
          disableFuture
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          slotProps={{ textField: { size: "small" } }}
          minDate={startDate || undefined} // 🚀 endDate nikad ne može biti prije startDate
        />

        {/* Dugmad */}
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={handleApply}>
            Primijeni
          </Button>
          <Button variant="outlined" onClick={handleClear}>
            Resetuj
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
