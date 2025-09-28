import {
  Grid,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Amenities } from "@/features/estates/types";

import EuroIcon from "@mui/icons-material/Euro";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LayersIcon from "@mui/icons-material/Layers";
import StairsIcon from "@mui/icons-material/Stairs";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import { useEffect } from "react";

// srpski prevodi za amenities specifične za business
const businessAmenitiesLabels: Partial<Record<Amenities, string>> = {
  [Amenities.Elevator]: "Lift",
  [Amenities.ParkingSpace]: "Parking mesto",
  [Amenities.KITCHENETTE]: "Čajna kuhinja",
  [Amenities.SECURITY]: "Sigurnost",
  [Amenities.CCTV]: "Video nadzor",
  [Amenities.RECEPTION]: "Recepcija",
  [Amenities.WHEELCHAIR_ACCESS]: "Pristup invalidima",
};

export function BusinessEstateForm({
  onSubmit,
  initialValues,
}: {
  onSubmit: (data: any) => void;
  initialValues?: any;
}) {
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      pricePerMonth: "",
      area: "",
      unitsAvailable: 1,
      intentedUse: "",
      floor: "",
      hasElevator: false,
      isGroundFloor: false,
      hasParking: false,
      internetReady: false,
      parkingSpaces: "",
      hasRestroom: false,
      ceilingHeight: "",
      minimumLeaseMonths: "",
      maximumLeaseMonths: "",
      amenities: [] as string[],
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return (
    <form id="business-form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* Basic info */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Naslov"
            {...register("title", { required: "Naslov je obavezan" })}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Opis"
            {...register("description", { required: "Opis je obavezan" })}
          />
        </Grid>

        {/* Price, Area, Units */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            type="number"
            fullWidth
            required
            label="Cijena po mesecu (€)"
            {...register("pricePerMonth", { required: "Cijena je obavezna" })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EuroIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              border: "2px solid",
              borderColor: "primary.main",
              borderRadius: 2,
              backgroundColor: "background.paper",
              boxShadow: 1,
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            type="number"
            fullWidth
            label="Površina (m²)"
            {...register("area", { required: "Površina je obavezna" })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SquareFootIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            type="number"
            fullWidth
            label="Dostupne jedinice"
            {...register("unitsAvailable")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ApartmentIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Intended use */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            select
            fullWidth
            label="Namjena prostora"
            defaultValue=""
            {...register("intentedUse", { required: "Namjena je obavezna" })}
          >
            <MenuItem value="retail">Trgovina</MenuItem>
            <MenuItem value="office">Kancelarija</MenuItem>
            <MenuItem value="warehouse">Magacin</MenuItem>
            <MenuItem value="hospitality">Usluge</MenuItem>
            <MenuItem value="other">Ostalo</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            type="number"
            fullWidth
            label="Sprat"
            {...register("floor")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LayersIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Flags */}
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControlLabel
            control={<Switch {...register("hasElevator")} />}
            label="Lift"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControlLabel
            control={<Switch {...register("isGroundFloor")} />}
            label="Prizemlje"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControlLabel
            control={<Switch {...register("hasParking")} />}
            label="Parking"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControlLabel
            control={<Switch {...register("internetReady")} />}
            label="Internet"
          />
        </Grid>

        {/* Parking spaces + restroom */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            type="number"
            fullWidth
            label="Parking mesta"
            {...register("parkingSpaces")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalParkingIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControlLabel
            control={<Switch {...register("hasRestroom")} />}
            label="Toalet"
          />
        </Grid>

        {/* Ceiling height + lease months */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            type="number"
            fullWidth
            label="Visina plafona (m)"
            {...register("ceilingHeight")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StairsIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            type="number"
            fullWidth
            label="Minimalni zakup (meseci)"
            {...register("minimumLeaseMonths")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            type="number"
            fullWidth
            label="Maksimalni zakup (meseci)"
            {...register("maximumLeaseMonths")}
          />
        </Grid>

        {/* Amenities */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            Poslovne pogodnosti
          </Typography>
          <Controller
            control={control}
            name="amenities"
            render={({ field }) => (
              <ToggleButtonGroup
                value={field.value || []}
                onChange={(_, newValues) => field.onChange(newValues)}
                color="primary"
              >
                {Object.entries(businessAmenitiesLabels).map(([key, label]) => (
                  <ToggleButton key={key} value={key}>
                    {label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}
          />
        </Grid>
      </Grid>
    </form>
  );
}
