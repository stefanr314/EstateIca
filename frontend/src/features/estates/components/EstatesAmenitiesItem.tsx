import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { amenitiesMap, AmenityKey } from "@/shared/constants/amenitiesMap"; // tvoj fajl
import { Item } from "./EstateDetailsMain";

interface Props {
  amenities: AmenityKey[];
}

const fakeAmentities: AmenityKey[] = [
  "Balcony",
  "AirConditioning",
  "CCTV",
  "Breakfast",
  "Gym",
  "Wifi",
  "Pool",
  "Pool",
  "Fireplace",
  "SmokeFree",
];

export default function EstateAmenitiesItem({ amenities }: Props) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);

  const visibleAmenities = amenities.slice(0, 6);
  const hasMore = amenities.length > 6;

  return (
    <>
      <Item elevation={4}>
        <Typography variant="h5" pb={1}>
          Sadrzaj nekretnine
        </Typography>
        <Divider />
        <Stack direction="row" flexWrap="wrap" gap={1} pt={2}>
          {visibleAmenities.map((key) => {
            const amenity = amenitiesMap[key];
            if (!amenity) return null;

            const Icon = amenity.icon;
            return (
              <Chip
                key={key}
                icon={<Icon fontSize="small" />}
                label={amenity.label}
                variant="outlined"
                color="primary"
                sx={{
                  fontSize: "1rem",
                  height: 40,
                  paddingX: 1.5,
                  ".MuiChip-icon": {
                    fontSize: "1.5rem",
                    color: "mint.dark",
                  },
                }}
              />
            );
          })}

          {hasMore && (
            <Button
              size="small"
              onClick={() => setOpen(true)}
              variant="outlined"
              sx={{ alignSelf: "center", ml: 1 }}
            >
              Prikaži sve
            </Button>
          )}
        </Stack>
      </Item>

      {/* Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={isSmall}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 2,
          }}
        >
          <Typography variant="h6">Sadržaji</Typography>
          <IconButton onClick={() => setOpen(false)} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack divider={<Divider flexItem />} spacing={1.5}>
            {amenities.map((key) => {
              const amenity = amenitiesMap[key];
              if (!amenity) return null;

              const Icon = amenity.icon;
              return (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    py: 1,
                  }}
                >
                  <Icon fontSize="small" color="primary" />
                  <Typography variant="body1" fontSize={"medium"}>
                    {amenity.label}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Zatvori
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
