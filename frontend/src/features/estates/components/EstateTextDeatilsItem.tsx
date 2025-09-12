import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotesIcon from "@mui/icons-material/Notes";
import RuleIcon from "@mui/icons-material/Rule";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import PolicyIcon from "@mui/icons-material/Policy";
import { IBusinessEstate, IResidentialEstate } from "../types";
import { Item } from "./EstateDetailsMain";

interface Props {
  estate: IResidentialEstate | IBusinessEstate;
}

const LINE_CLAMP = 3; // koliko linija prikazati u previewu

export default function EstateTextDetailsItem({ estate }: Props) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const fields = useMemo(
    () => [
      {
        key: "description",
        label: "Opis",
        icon: <DescriptionIcon fontSize="small" />,
      },
      {
        key: "neighborhoodOverview",
        label: "Komšiluk",
        icon: <LocationOnIcon fontSize="small" />,
      },
      { key: "notes", label: "Napomene", icon: <NotesIcon fontSize="small" /> },
      {
        key: "houseRules",
        label: "Pravila kuće",
        icon: <RuleIcon fontSize="small" />,
      },
      {
        key: "transit",
        label: "Transport",
        icon: <DirectionsTransitIcon fontSize="small" />,
      },
      {
        key: "access",
        label: "Pristup",
        icon: <VpnKeyIcon fontSize="small" />,
      },
      {
        key: "cancellationPolicy",
        label: "Politika otkazivanja",
        icon: <PolicyIcon fontSize="small" />,
      },
    ],
    []
  );

  const [open, setOpen] = useState(false);

  const toStr = (val: any) =>
    val === null || val === undefined ? "" : String(val);

  // provjera da li postoji ijedan duži tekst
  const hasLongText = fields.some((f) => {
    const text = toStr((estate as any)[f.key]);
    return text.length > 200; // prag za "prikaži sve"
  });

  return (
    <>
      <Item elevation={4} sx={{ p: 2 }}>
        <Typography variant="h5" pb={2}>
          Detalji nekretnine
        </Typography>
        <Divider />
        <Stack spacing={2} pt={1}>
          {fields.map((f) => {
            const text = toStr((estate as any)[f.key]).trim();
            if (!text) return null;

            return (
              <Box
                key={f.key}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "flex-start",
                  py: 1,
                  borderBottom: (theme) =>
                    `1px dashed ${theme.palette.divider}`,
                  "&:last-of-type": { borderBottom: "none" },
                }}
              >
                {/* Ikonica */}
                <Box sx={{ mt: "2px", color: "primary.main" }}>{f.icon}</Box>

                {/* Text */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ mb: 0.5 }}
                  >
                    {f.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      display: "-webkit-box",
                      WebkitLineClamp: LINE_CLAMP,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                    }}
                  >
                    {text}
                  </Typography>
                </Box>
              </Box>
            );
          })}

          {/* samo jedan globalni "Prikaži sve" */}
          {hasLongText && (
            <Box sx={{ mt: 1, textAlign: "right" }}>
              <Button size="small" onClick={() => setOpen(true)}>
                Prikaži sve
              </Button>
            </Box>
          )}
        </Stack>
      </Item>

      {/* Jedan veliki modal za sve fieldove */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={isSmall}
        maxWidth="md"
        fullWidth
        aria-labelledby="estate-details-dialog-title"
      >
        <DialogTitle
          id="estate-details-dialog-title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography variant="h6">Detaljan opis</Typography>
          <IconButton onClick={() => setOpen(false)} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={3}>
            {fields.map((f) => {
              const text = toStr((estate as any)[f.key]).trim();
              if (!text) return null;

              return (
                <Box key={f.key}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    {f.label}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ whiteSpace: "pre-line", color: "text.primary" }}
                  >
                    {text}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Zatvori
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
