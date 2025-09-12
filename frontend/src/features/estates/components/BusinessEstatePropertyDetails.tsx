import {
  Stack,
  Typography,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LayersIcon from "@mui/icons-material/Layers";
import ElevatorIcon from "@mui/icons-material/MoveUp";
import HeightIcon from "@mui/icons-material/Height";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import WcIcon from "@mui/icons-material/Wc";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import WifiIcon from "@mui/icons-material/Wifi";
import TagIcon from "@mui/icons-material/Tag";
import { useState } from "react";
import { Item } from "./EstateDetailsMain";

interface BusinessPropertyDetailsProps {
  unitsAvailable?: number;
  area: number;
  intentedUse: "retail" | "office" | "warehouse" | "hospitality" | "other";
  floor?: number;
  hasElevator?: boolean;
  isGroundFloor?: boolean;
  ceilingHeight?: number;
  hasParking?: boolean;
  parkingSpaces?: number;
  hasRestroom?: boolean;
  minimumLeaseMonths?: number;
  maximumLeaseMonths?: number;
  airConditioning?: boolean;
  internetReady?: boolean;
}

export function BusinessPropertyDetails({
  unitsAvailable = 1,
  area,
  intentedUse,
  floor,
  hasElevator,
  isGroundFloor,
  ceilingHeight,
  hasParking,
  parkingSpaces,
  hasRestroom,
  minimumLeaseMonths,
  maximumLeaseMonths,
  airConditioning,
  internetReady,
}: BusinessPropertyDetailsProps) {
  const theme = useTheme();
  const iconColor = theme.palette.primary.main;
  const [open, setOpen] = useState(false);

  return (
    <Item
      elevation={4}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5">Detalji poslovnog prostora</Typography>
      <Divider />

      {/* Osnovni info */}
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <ApartmentIcon sx={{ color: iconColor }} fontSize="small" />
        <Typography variant="body2" color="text.primary">
          Namjena: <strong>{intentedUse}</strong>
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1.5}>
        <SquareFootIcon sx={{ color: iconColor }} fontSize="small" />
        <Typography variant="body2" color="text.primary">
          Površina: <strong>{area} m²</strong>
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1.5}>
        <TagIcon sx={{ color: iconColor }} fontSize="small" />
        <Typography variant="body2" color="text.primary">
          Jedinica dostupnih: <strong>{unitsAvailable}</strong>
        </Typography>
      </Stack>

      <Divider />

      {/* Dugme za modal */}
      <Button
        variant="outlined"
        size="small"
        onClick={() => setOpen(true)}
        sx={{ alignSelf: "flex-start" }}
      >
        Prikaži više detalja
      </Button>

      {/* Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Detalji prostora</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            {floor !== undefined && (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <LayersIcon fontSize="small" sx={{ color: iconColor }} />
                <Typography variant="body2">Sprat: {floor}</Typography>
              </Stack>
            )}
            {isGroundFloor && (
              <Typography variant="body2">Nalazi se u prizemlju</Typography>
            )}
            {hasElevator && (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <ElevatorIcon fontSize="small" sx={{ color: iconColor }} />
                <Typography variant="body2">Zgrada ima lift</Typography>
              </Stack>
            )}
            {ceilingHeight && (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <HeightIcon fontSize="small" sx={{ color: iconColor }} />
                <Typography variant="body2">
                  Visina plafona: {ceilingHeight} m
                </Typography>
              </Stack>
            )}
            {hasParking && (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <LocalParkingIcon fontSize="small" sx={{ color: iconColor }} />
                <Typography variant="body2">
                  Parking: {parkingSpaces || 0} mjesta
                </Typography>
              </Stack>
            )}
            {hasRestroom && (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <WcIcon fontSize="small" sx={{ color: iconColor }} />
                <Typography variant="body2">Ima toalet</Typography>
              </Stack>
            )}
            {(minimumLeaseMonths || maximumLeaseMonths) && (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <CalendarMonthIcon fontSize="small" sx={{ color: iconColor }} />
                <Typography variant="body2">
                  Najam: {minimumLeaseMonths || "?"} -{" "}
                  {maximumLeaseMonths || "?"} mjeseci
                </Typography>
              </Stack>
            )}
            {airConditioning && (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <AcUnitIcon fontSize="small" sx={{ color: iconColor }} />
                <Typography variant="body2">Klimatizacija</Typography>
              </Stack>
            )}
            {internetReady && (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <WifiIcon fontSize="small" sx={{ color: iconColor }} />
                <Typography variant="body2">Internet priključak</Typography>
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Zatvori</Button>
        </DialogActions>
      </Dialog>
    </Item>
  );
}
