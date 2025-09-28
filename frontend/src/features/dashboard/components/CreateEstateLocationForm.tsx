import { useState } from "react";

import agent from "@/app/api/agent";

import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn"; // LocationPinIcon nije u MUI

import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";

import { useAppDispatch } from "@/app/store/hooks";
import { pushNotification } from "@/features/notifications/notificationSlice";
import LocationAddress from "@/shared/components/AutoCompleteAddress";
import { IAddress } from "@/features/estates/types";

interface Props {
  onSelect: (address: any) => void;
  defaultAddress: IAddress | null;
}

export default function EstateLocationStep({
  onSelect,
  defaultAddress,
}: Props) {
  const dispatch = useAppDispatch();
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [manualMode, setManualMode] = useState(false);

  // inicijalno Sarajevo
  const [coords, setCoords] = useState<[number, number]>([
    defaultAddress?.location.coordinates[0] || 18.4131,
    defaultAddress?.location.coordinates[1] || 43.8563,
  ]);
  const [manualFields, setManualFields] = useState({
    street: defaultAddress?.street || "",
    postalCode: defaultAddress?.postalCode || "",
    suburb: defaultAddress?.suburb || "",
  });

  const handlePlaceSelect = async (place: {
    description: string;
    place_id: string;
  }) => {
    const details = await agent.Location.getDetails(place.place_id);
    setSelectedPlace(details);
    setCoords(details.location.coordinates);
    onSelect(details);
  };

  const handleManualSubmit = () => {
    if (!selectedPlace)
      return dispatch(
        pushNotification({
          type: "error",
          message: "Prvo odaberite lokaciju iz pretrage.",
        })
      );
    const manualAddress = {
      ...selectedPlace,
      street: manualFields.street || selectedPlace.street,
      postalCode: manualFields.postalCode || selectedPlace.postalCode,
      suburb: manualFields.suburb || selectedPlace.suburb,
      location: { type: "Point", coordinates: coords },
    };
    setSelectedPlace(manualAddress);
    onSelect(manualAddress);
    dispatch(
      pushNotification({
        type: "success",
        message: "Ručna adresa je sačuvana.",
      })
    );
    setManualMode(false);
  };

  return (
    <Box width={"100%"}>
      <Grid container spacing={3}>
        {/* Lijeva kolona */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ mb: 2 }}>
            <LocationAddress
              onSelect={handlePlaceSelect}
              defaultValue={{
                description: defaultAddress
                  ? `${defaultAddress?.street}, ${defaultAddress?.city}, ${defaultAddress?.country} `
                  : "",
                place_id: defaultAddress?.placeId || "",
              }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {manualMode && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Ručni unos adrese
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Ulica"
                  fullWidth
                  value={manualFields.street}
                  onChange={(e) =>
                    setManualFields((f) => ({ ...f, street: e.target.value }))
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Poštanski broj"
                  fullWidth
                  value={manualFields.postalCode}
                  onChange={(e) =>
                    setManualFields((f) => ({
                      ...f,
                      postalCode: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Naselje / Suburb"
                  fullWidth
                  value={manualFields.suburb}
                  onChange={(e) =>
                    setManualFields((f) => ({ ...f, suburb: e.target.value }))
                  }
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button variant="outlined" onClick={handleManualSubmit}>
                  Potvrdi ručnu adresu
                </Button>
              </Grid>
            </Grid>
          )}

          <Button
            variant="text"
            onClick={() => setManualMode((prev) => !prev)}
            sx={{ mt: 1 }}
          >
            {manualMode
              ? "Koristi autocomplete adresu"
              : "Prepravi adresu ručno"}
          </Button>
        </Grid>

        {/* Desna kolona */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box
            sx={{
              width: "100%",
              height: 350,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Map
              mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
              style={{ width: "100%", height: "100%" }}
              center={{ lat: coords[1], lng: coords[0] }}
              zoom={14}
              onClick={(e) => {
                if (e.detail.latLng) {
                  const { lat, lng } = e.detail.latLng;
                  setCoords([lng, lat]);

                  if (selectedPlace) {
                    const updated = {
                      ...selectedPlace,
                      location: { type: "Point", coordinates: [lng, lat] },
                    };
                    setSelectedPlace(updated);
                    onSelect(updated);
                  }
                }
              }}
            >
              <AdvancedMarker position={{ lat: coords[1], lng: coords[0] }}>
                <LocationOnIcon color="primary" fontSize="large" />
              </AdvancedMarker>
            </Map>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
