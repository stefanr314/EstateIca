import { Stack, Typography, Divider, useTheme } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import ApartmentIcon from "@mui/icons-material/Apartment";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import PetsIcon from "@mui/icons-material/Pets";
import TagIcon from "@mui/icons-material/Tag"; // za units available
import { Item } from "./EstateDetailsMain";
import { green } from "@/shared/ui/theme";

interface PropertyDetailsItemProps {
  guestCapacity?: number;
  extraPeople?: number;
  beds?: number;
  bathrooms?: number;

  roomType?: string;
  rentalType?: "Short Term" | "Long Term";
  residentialType?: string;
  area?: number;
  petAllowance?: boolean;
  unitsAvailable?: number;
}

export function PropertyDetailsItem({
  guestCapacity = 4,
  extraPeople = 2,
  beds = 2,
  bathrooms = 1,

  roomType = "Apartment",
  rentalType = "Short Term",
  residentialType = "Urban",
  area = 45,
  petAllowance = true,
  unitsAvailable = 5,
}: PropertyDetailsItemProps) {
  const theme = useTheme();

  //   const iconColor = theme.palette.mode === "dark" ? "#ccc" : "#555";
  const iconColor = theme.palette.primary.main;

  return (
    <Item
      elevation={4}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Typography variant="h5">Detalji broja gostiju</Typography>
      <Divider />
      {/* Guest Info */}
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <PeopleIcon fontSize="small" sx={{ color: iconColor }} />
        <Typography variant="body2" color="text.primary">
          <strong>{guestCapacity}</strong> broj gostiju
          {extraPeople > 0 && (
            <span style={{ color: theme.palette.text.secondary }}>
              {" "}
              + {extraPeople} ekstra gosti
            </span>
          )}
        </Typography>
      </Stack>

      {/* Room Details */}
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Stack direction="row" spacing={1}>
          <BedIcon fontSize="small" sx={{ color: iconColor }} />
          <BathtubIcon fontSize="small" sx={{ color: iconColor }} />
        </Stack>
        <Typography variant="body2" color="text.primary">
          <strong>{beds}</strong> kreveta, <strong>{bathrooms}</strong>{" "}
          kupatila,
        </Typography>
      </Stack>

      {/* Property Type */}
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <ApartmentIcon fontSize="small" sx={{ color: iconColor }} />
        <Typography variant="body2" color="text.primary">
          <strong>{roomType}</strong> • {rentalType} • {residentialType} tip
          smjestaja
        </Typography>
      </Stack>

      {/* Location */}
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <SquareFootIcon fontSize="small" sx={{ color: iconColor }} />
        <Typography variant="body2" color="text.primary">
          <strong>{area}</strong> m2 povrsina
        </Typography>
      </Stack>

      <Divider />

      {/* Additional Info */}
      <Stack direction="row" justifyContent="space-between" pt={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <PetsIcon
            fontSize="small"
            sx={{ color: petAllowance ? green[300] : "#888" }}
          />
          <Typography
            variant="body2"
            sx={{ color: petAllowance ? green[500] : "#888" }}
          >
            {petAllowance ? "Ljubimci dozvoljeni" : "Ljubimci nisu dozvoljeni"}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <TagIcon fontSize="small" sx={{ color: iconColor }} />
          <Typography variant="body2" color="text.primary">
            <strong>{unitsAvailable}</strong> dostupne jedinice
          </Typography>
        </Stack>
      </Stack>
    </Item>
  );
}
