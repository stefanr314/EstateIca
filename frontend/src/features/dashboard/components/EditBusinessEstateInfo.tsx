import Grid from "@mui/material/Grid";
import {
  Stack,
  Divider,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Switch,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { IBusinessEstate, Amenities } from "@/features/estates/types";

import EuroIcon from "@mui/icons-material/Euro";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LayersIcon from "@mui/icons-material/Layers";
import StairsIcon from "@mui/icons-material/Stairs";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// srpski prevodi za amenities
const businessAmenitiesLabels: Partial<Record<Amenities, string>> = {
  [Amenities.Elevator]: "Lift",
  [Amenities.Dishwasher]: "Mašina za sudove",
  [Amenities.Microwave]: "Mikrovalna",
  [Amenities.ParkingSpace]: "Parking mesto",
  [Amenities.KITCHENETTE]: "Čajna kuhinja",
  [Amenities.SECURITY]: "Sigurnost",
  [Amenities.CCTV]: "Video nadzor",
  [Amenities.RECEPTION]: "Recepcija",
  [Amenities.WHEELCHAIR_ACCESS]: "Pristup za invalidska kolica",
} as const;

export type BusinessFormValues = Omit<
  IBusinessEstate,
  "host" | "images" | "address" | "estateType" | "rentalType"
>;

export default function EditBusinessEstateInfo({
  estate,
  register,
  control,
  errors,
}: {
  estate: IBusinessEstate;
  register: UseFormRegister<BusinessFormValues>;
  control: Control<BusinessFormValues>;
  errors: FieldErrors<BusinessFormValues>;
}) {
  return (
    <Stack spacing={3} divider={<Divider />} sx={{ p: 2 }}>
      {/* Basic info */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            label="Naslov"
            fullWidth
            {...register("title", { required: "Naslov je obavezan" })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Opis"
            fullWidth
            multiline
            minRows={4}
            {...register("description", { required: "Opis je obavezan" })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </Grid>
      </Grid>

      {/* Numbers */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            control={control}
            name="pricePerMonth"
            rules={{ required: "Cijena po mjesecu je obavezna" }}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Mesečna naknada (€)"
                fullWidth
                error={!!errors.pricePerMonth}
                helperText={errors.pricePerMonth?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EuroIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            control={control}
            name="area"
            rules={{ required: "Površina je obavezna" }}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Površina (m²)"
                fullWidth
                error={!!errors.area}
                helperText={errors.area?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SquareFootIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            control={control}
            name="unitsAvailable"
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Dostupne jedinice"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ApartmentIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Intended use */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel id="intended-use-label">Namena</InputLabel>
            <Select
              labelId="intended-use-label"
              defaultValue={estate.intentedUse}
              {...register("intentedUse", { required: "Namena je obavezna" })}
            >
              <MenuItem value="retail">Trgovina</MenuItem>
              <MenuItem value="office">Kancelarija</MenuItem>
              <MenuItem value="warehouse">Skladište</MenuItem>
              <MenuItem value="hospitality">Usluge</MenuItem>
              <MenuItem value="other">Ostalo</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            control={control}
            name="floor"
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Sprat"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LayersIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Flags kao Switch */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Controller
            control={control}
            name="hasElevator"
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Lift"
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Controller
            control={control}
            name="isGroundFloor"
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Prizemlje"
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Controller
            control={control}
            name="hasParking"
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Parking"
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Controller
            control={control}
            name="internetReady"
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Internet"
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Ceiling + restroom + AC */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            control={control}
            name="ceilingHeight"
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Visina plafona (m)"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <StairsIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            control={control}
            name="hasRestroom"
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Toalet"
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            control={control}
            name="airConditioning"
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Klima"
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Lease months + parking spaces */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            control={control}
            name="minimumLeaseMonths"
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Minimalni zakup (meseci)"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            control={control}
            name="maximumLeaseMonths"
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Maksimalni zakup (meseci)"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            control={control}
            name="parkingSpaces"
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Broj parking mesta"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalParkingIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Amenities */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Poslovne pogodnosti
          </Typography>
          <Controller
            control={control}
            name="amenities"
            render={({ field }) => (
              <ToggleButtonGroup
                value={field.value || []}
                onChange={(_, newValues) => field.onChange(newValues)}
                aria-label="business-amenities"
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
    </Stack>
  );
}
