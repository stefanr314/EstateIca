import { Item } from "./EstateDetailsMain";
import { Stack, Typography, Divider, useTheme } from "@mui/material";
import EuroIcon from "@mui/icons-material/Euro";
import SavingsIcon from "@mui/icons-material/Savings";
import CalculateIcon from "@mui/icons-material/Calculate";

interface EstatePriceCardProps {
  rentalType: "Short Term" | "Long Term";
  price: number; // cijena po noći ili mjesecu
  securityDeposit?: number;
  stayLength: number; // broj dana ili mjeseci (zavisno od rentalType)
}

export function EstatePriceCard({
  rentalType,
  price,
  securityDeposit,
  stayLength,
}: EstatePriceCardProps) {
  const theme = useTheme();

  // izračun cijene
  const totalPrice = price * stayLength;

  return (
    <Item
      elevation={4}
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
      }}
    >
      {/* Naslov */}
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Cijena
      </Typography>
      <Divider />

      {/* Osnovna cijena */}
      <Stack direction="row" spacing={1} alignItems="center">
        <EuroIcon sx={{ color: theme.palette.success.main }} fontSize="small" />
        <Typography variant="body1" color="text.primary">
          <strong>{price.toLocaleString("de-DE")} €</strong> /{" "}
          {rentalType === "Short Term" ? "noć" : "mjesec"}
        </Typography>
      </Stack>

      {/* Depozit */}
      {securityDeposit !== undefined && (
        <Stack direction="row" spacing={1} alignItems="center">
          <SavingsIcon
            sx={{ color: theme.palette.warning.main }}
            fontSize="small"
          />
          <Typography variant="body2" color="text.secondary">
            Depozit: {securityDeposit.toLocaleString("de-DE")} €
          </Typography>
        </Stack>
      )}

      {/* Ukupno */}
      <Divider sx={{ my: 1 }} />
      <Stack direction="row" spacing={1} alignItems="center">
        <CalculateIcon
          sx={{ color: theme.palette.info.main }}
          fontSize="small"
        />
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Ukupno: {totalPrice.toLocaleString("sr-SR")} €
        </Typography>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        ({stayLength} {rentalType === "Short Term" ? "noći" : "mjeseci"})
      </Typography>
    </Item>
  );
}
