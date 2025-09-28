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
  Divider,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import {
  ResidentialType,
  RoomType,
  Amenities,
  CancellationPolicy,
} from "@/features/estates/types";

import EuroIcon from "@mui/icons-material/Euro";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import HotelIcon from "@mui/icons-material/Hotel";
import GroupIcon from "@mui/icons-material/Group";
import { useEffect } from "react";

// srpski prevodi za amenities
const residentialAmenitiesLabels: Partial<Record<Amenities, string>> = {
  [Amenities.AirConditioning]: "Klima",
  [Amenities.Heating]: "Grijanje",
  [Amenities.Kitchen]: "Kuhinja",
  [Amenities.TV]: "TV",
  [Amenities.Wifi]: "WiFi",
  [Amenities.Parking]: "Parking",
  [Amenities.Pool]: "Bazen",
  [Amenities.Gym]: "Teretana",
  [Amenities.Balcony]: "Balkon",
  [Amenities.Garden]: "Bašta",
  [Amenities.Fireplace]: "Kamin",
  [Amenities.Laundry]: "Vešeraj",
  [Amenities.BBQ]: "Roštilj",
};

export function ResidentialEstateForm({
  onSubmit,
  initialValues,
}: {
  onSubmit: (data: any) => void;
  initialValues?: any; // iz roditelja šalješ estateData
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // base
      title: "",
      description: "",
      hidden: false,
      neighborhoodOverview: "",
      notes: "",
      houseRules: "",
      transit: "",
      access: "",
      cancellationPolicy: "",
      securityDeposit: "",

      // residential specific
      rentalType: "",
      bedrooms: "",
      bathrooms: "",
      beds: 1,
      minimumStay: 1,
      maximumStay: "",
      pricePerNight: "",
      pricePerMonth: "",
      area: "",
      amenities: [] as string[],
      residentialType: "",
      roomType: "",
      guestIncluded: 1,
      extraPeople: "",
      petAllowance: false,
      unitsAvailable: 1,
    },
  });

  const rentalType = watch("rentalType");

  console.log("Initial values:", initialValues);

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return (
    <form id="residential-form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* Rental type (OBAVEZNO) */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="rentalType"
            control={control}
            rules={{ required: "Odaberite tip najma" }}
            render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <InputLabel id="rental-type-label">Tip najma</InputLabel>
                <Select
                  {...field}
                  labelId="rental-type-label"
                  value={field.value || ""} // fallback na '' da ne puca
                >
                  <MenuItem value="">-- Odaberite --</MenuItem>
                  <MenuItem value="Short Term">Kratkoročno (po noći)</MenuItem>
                  <MenuItem value="Long Term">Dugoročno (po mjesecu)</MenuItem>
                </Select>
                {fieldState.error && (
                  <FormHelperText>{fieldState.error.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        {/* Naslov, opis (OBAVEZNO) */}
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            fullWidth
            label="Naslov"
            {...register("title", { required: "Naslov je obavezan" })}
            error={!!errors.title}
            helperText={errors.title?.message as string}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            fullWidth
            label="Opis"
            multiline
            minRows={4}
            {...register("description", { required: "Opis je obavezan" })}
            error={!!errors.description}
            helperText={errors.description?.message as string}
          />
        </Grid>

        <Divider style={{ width: "100%" }} />

        {/* Osnovne brojke */}
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            required
            type="number"
            fullWidth
            label="Kreveti"
            {...register("beds", { required: "Obavezno" })}
            error={!!errors.beds}
            helperText={errors.beds?.message as string}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            type="number"
            fullWidth
            label="Spavaće sobe"
            {...register("bedrooms")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HotelIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            type="number"
            fullWidth
            label="Kupatila"
            {...register("bathrooms")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BathtubIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            type="number"
            fullWidth
            label="Površina (m²)"
            {...register("area")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SquareFootIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Trajanje boravka (min je OBAVEZAN) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            required
            type="number"
            fullWidth
            label="Minimalan boravak (noći)"
            {...register("minimumStay", { required: "Obavezno" })}
            error={!!errors.minimumStay}
            helperText={errors.minimumStay?.message as string}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            type="number"
            fullWidth
            label="Maksimalan boravak (noći)"
            {...register("maximumStay")}
          />
        </Grid>

        {rentalType === "Short Term" && (
          <Grid size={{ xs: 12 }}>
            <TextField
              required
              type="number"
              fullWidth
              label="Cijena po noći (€)"
              {...register("pricePerNight", {
                required: "Obavezno za kratkoročni najam",
              })}
              error={!!errors.pricePerNight}
              helperText={
                (errors.pricePerNight?.message as string) ||
                "Obavezno kad je tip najma 'Short Term'"
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EuroIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                border: "1.5px solid",
                borderColor: "primary.main",
                borderRadius: 2,
                bgcolor: "background.paper",
                "&:hover": {
                  borderColor: "primary.dark",
                },
                "& .MuiInputBase-input": {
                  fontWeight: 600,
                },
              }}
            />
          </Grid>
        )}

        {rentalType === "Long Term" && (
          <Grid size={{ xs: 12 }}>
            <TextField
              required
              type="number"
              fullWidth
              label="Cijena po mjesecu (€)"
              {...register("pricePerMonth", {
                required: "Obavezno za dugoročni najam",
              })}
              error={!!errors.pricePerMonth}
              helperText={
                (errors.pricePerMonth?.message as string) ||
                "Obavezno kad je tip najma 'Long Term'"
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EuroIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                border: "1.5px solid",
                borderColor: "primary.main",
                borderRadius: 2,
                bgcolor: "background.paper",
                "&:hover": {
                  borderColor: "primary.dark",
                },
                "& .MuiInputBase-input": {
                  fontWeight: 600,
                },
              }}
            />
          </Grid>
        )}

        {/* Gosti */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            required
            type="number"
            fullWidth
            label="Broj uključenih gostiju"
            {...register("guestIncluded", { required: "Obavezno" })}
            error={!!errors.guestIncluded}
            helperText={errors.guestIncluded?.message as string}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GroupIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            type="number"
            fullWidth
            label="Dodatni gosti"
            {...register("extraPeople")}
          />
        </Grid>

        {/* Tipovi */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            control={control}
            name="residentialType"
            render={({ field }) => (
              <TextField
                select
                required
                fullWidth
                label="Tip stambenog prostora"
                value={field.value || ""}
                onChange={field.onChange}
                error={!!errors.residentialType}
                helperText={errors.residentialType?.message as string}
              >
                {Object.values(ResidentialType).map((val) => (
                  <MenuItem key={val} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            control={control}
            name="roomType"
            render={({ field }) => (
              <TextField
                select
                fullWidth
                label="Tip sobe"
                value={field.value || ""}
                onChange={field.onChange}
              >
                {Object.values(RoomType).map((val) => (
                  <MenuItem key={val} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* Politike / depozit */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            control={control}
            name="cancellationPolicy"
            render={({ field }) => (
              <TextField
                select
                fullWidth
                label="Politika otkazivanja"
                value={field.value || ""}
                onChange={field.onChange}
              >
                {Object.values(CancellationPolicy).map((val) => (
                  <MenuItem key={val} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            type="number"
            fullWidth
            label="Sigurnosni depozit (€)"
            {...register("securityDeposit")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EuroIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Ostalo (tekstualna polja) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Opis komšiluka"
            multiline
            minRows={2}
            {...register("neighborhoodOverview")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Napomene"
            multiline
            minRows={2}
            {...register("notes")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Kućni red"
            multiline
            minRows={2}
            {...register("houseRules")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Prevoz / Transit"
            multiline
            minRows={2}
            {...register("transit")}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Pristup smještaju"
            multiline
            minRows={2}
            {...register("access")}
          />
        </Grid>

        {/* Flagovi */}
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControlLabel
            control={<Switch {...register("petAllowance")} />}
            label="Dozvoljeni ljubimci"
          />
        </Grid>
        {/* <Grid size={{ xs: 12, md: 4 }}>
          <FormControlLabel
            control={<Switch {...register("hidden")} />}
            label="Sakrij oglas"
          />
        </Grid> */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            type="number"
            fullWidth
            label="Dostupne jedinice"
            {...register("unitsAvailable")}
          />
        </Grid>

        {/* Amenity check (multi) – koristićemo “comma separated” da ga lako pošalješ */}
        <Grid size={{ xs: 12 }}>
          <Controller
            control={control}
            name="amenities"
            render={({ field }) => (
              <TextField
                select
                fullWidth
                SelectProps={{ multiple: true }}
                label="Pogodnosti"
                value={field.value || []}
                onChange={field.onChange}
                helperText="Drži Ctrl / Cmd za više izbora"
              >
                {Object.entries(residentialAmenitiesLabels).map(
                  ([key, val]) => (
                    <MenuItem key={key} value={key}>
                      {val}
                    </MenuItem>
                  )
                )}
              </TextField>
            )}
          />
        </Grid>
      </Grid>
    </form>
  );
}
