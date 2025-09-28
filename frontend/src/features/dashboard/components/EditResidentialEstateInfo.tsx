// components/EditResidentialEstateInfo.tsize
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import Grid from "@mui/material/Grid";
import {
  TextField,
  Stack,
  Divider,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import GroupsIcon from "@mui/icons-material/Groups";
import EuroIcon from "@mui/icons-material/Euro";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import NotesIcon from "@mui/icons-material/Notes";
import GavelIcon from "@mui/icons-material/Gavel";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ShieldIcon from "@mui/icons-material/Shield";
import ApartmentIcon from "@mui/icons-material/Apartment";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

import {
  Amenities,
  CancellationPolicy,
  IResidentialEstate,
  ResidentialType,
} from "@/features/estates/types";
import AmenitiesChipArray from "@/features/estates/components/filter/AmenitiesChipArray";
import { AmenityKey } from "@/shared/constants/amenitiesMap";

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

export type ResidentialFormValues = {
  // IBaseEstate (dozvoljena polja)
  title: string;
  description: string;
  neighborhoodOverview?: string;
  notes?: string;
  houseRules?: string;
  transit?: string;
  access?: string;
  cancellationPolicy?: string;
  securityDeposit?: number;

  // IResidentialEstate (bez rentalType – koristimo ga iz estate props-a)
  bedrooms?: number;
  bathrooms?: number;
  beds: number;
  minimumStay: number;
  maximumStay?: number;
  pricePerNight?: number;
  pricePerMonth?: number;
  area?: number;
  residentialType: string; // možeš kasnije staviti pravi enum tip
  roomType?: string;
  guestIncluded: number;
  extraPeople?: number;
  petAllowance?: boolean;
  unitsAvailable?: number;
  amenities: AmenityKey[];
};

type Props = {
  estate: IResidentialEstate;
  register: UseFormRegister<ResidentialFormValues>;
  control: Control<ResidentialFormValues>;
  errors: FieldErrors<ResidentialFormValues>;
};

export default function EditResidentialEstateInfo({
  estate,
  register,
  control,
  errors,
}: Props) {
  const isShortTerm = estate.rentalType === "Short Term";

  return (
    <Stack spacing={3} divider={<Divider />} p={0.5}>
      {/* Basic */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            label="Naslov"
            placeholder="Amazing apartment..."
            fullWidth
            {...register("title", { required: "Naslov je obavezan" })}
            error={!!errors.title}
            helperText={errors.title?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TitleIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth error={!!errors.residentialType}>
            <InputLabel id="residential-type-label">Stambeni tip</InputLabel>
            <Select
              labelId="residential-type-label"
              {...register("residentialType", { required: "Tip je obavezan" })}
              defaultValue={estate.residentialType || ""}
              startAdornment={
                <InputAdornment position="start">
                  <ApartmentIcon fontSize="small" />
                </InputAdornment>
              }
            >
              {Object.values(ResidentialType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            {errors.residentialType && (
              <Typography variant="caption" color="error">
                {errors.residentialType.message}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Opis"
            multiline
            minRows={4}
            fullWidth
            {...register("description", {
              required: "Opis je obavezan",
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Layout & Stay */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            control={control}
            name="beds"
            rules={{
              required: "Broj kreveta je obavezan",
              min: { value: 0, message: "Min 0" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Broj kreveta"
                type="number"
                fullWidth
                error={!!errors.beds}
                helperText={errors.beds?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BedIcon fontSize="small" />
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
            name="bathrooms"
            render={({ field }) => (
              <TextField
                {...field}
                label="Broj kupatila"
                type="number"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BathtubIcon fontSize="small" />
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
            name="bedrooms"
            render={({ field }) => (
              <TextField
                {...field}
                label="Broj soba"
                type="number"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MeetingRoomIcon fontSize="small" />
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
            name="minimumStay"
            rules={{
              required: "Minimalni ostanak je obavezan",
              min: { value: 1, message: "Min 1" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Minimalni ostanak"
                type="number"
                fullWidth
                error={!!errors.minimumStay}
                helperText={errors.minimumStay?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TimelapseIcon fontSize="small" />
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
            name="maximumStay"
            render={({ field }) => (
              <TextField
                {...field}
                label="Maksimalni ostanak"
                type="number"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TimelapseIcon fontSize="small" />
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
            name="guestIncluded"
            rules={{
              required: "Dozvoljeni broj gostiju je obavezan",
              min: { value: 1, message: "Min 1" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Dozvoljeni broj gostiju je obavezan"
                type="number"
                fullWidth
                error={!!errors.guestIncluded}
                helperText={errors.guestIncluded?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GroupsIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Pricing & Area */}
      <Grid container spacing={2}>
        {isShortTerm ? (
          <Grid size={{ xs: 12, md: 4 }}>
            <Controller
              control={control}
              name="pricePerNight"
              rules={{ required: "Cijena po noćenju je obavezna." }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cijena po noćenju (€)"
                  type="number"
                  fullWidth
                  error={!!errors.pricePerNight}
                  helperText={errors.pricePerNight?.message}
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
        ) : (
          <Grid size={{ xs: 12, md: 4 }}>
            <Controller
              control={control}
              name="pricePerMonth"
              rules={{ required: "Cijena po mjesecu izdavanja je obavezna" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cijena po mjesecu (€)"
                  type="number"
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
        )}

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            control={control}
            name="area"
            render={({ field }) => (
              <TextField
                {...field}
                label="Površina (m²)"
                type="number"
                fullWidth
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
            name="extraPeople"
            render={({ field }) => (
              <TextField
                {...field}
                label="Dozvoljeni ekstra gosti"
                type="number"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GroupsIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Flags & Misc */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControlLabel
            control={
              <Controller
                control={control}
                name="petAllowance"
                render={({ field }) => (
                  <Checkbox
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            }
            label="Dozvoljeni kućni ljubimci"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            control={control}
            name="unitsAvailable"
            render={({ field }) => (
              <TextField
                {...field}
                label="Dostupne jedinice"
                type="number"
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

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            control={control}
            name="securityDeposit"
            render={({ field }) => (
              <TextField
                {...field}
                label="Depozit (€)"
                type="number"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ShieldIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Extended text sections */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Komšiluk"
            multiline
            minRows={3}
            fullWidth
            {...register("neighborhoodOverview", {
              setValueAs: (v) => (v === "" ? undefined : v),
            })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <NotesIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Posebne napomene"
            multiline
            minRows={3}
            fullWidth
            {...register("notes", {
              setValueAs: (v) => (v === "" ? undefined : v),
            })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <NotesIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Pravila kuće"
            multiline
            minRows={3}
            fullWidth
            {...register("houseRules", {
              setValueAs: (v) => (v === "" ? undefined : v),
            })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GavelIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Tranzit"
            multiline
            minRows={3}
            fullWidth
            {...register("transit", {
              setValueAs: (v) => (v === "" ? undefined : v),
            })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DirectionsTransitIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Pristup"
            multiline
            minRows={3}
            fullWidth
            {...register("access", {
              setValueAs: (v) => (v === "" ? undefined : v),
            })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth error={!!errors.cancellationPolicy}>
            <InputLabel id="cancellation-policy-label">
              Politika otkazivanja
            </InputLabel>
            <Select
              labelId="cancellation-policy-label"
              {...register("cancellationPolicy", {
                setValueAs: (v) => (v === "" ? undefined : v),
              })}
              defaultValue={estate.cancellationPolicy ?? ""}
              startAdornment={
                <InputAdornment position="start">
                  <GavelIcon fontSize="small" />
                </InputAdornment>
              }
            >
              {Object.values(CancellationPolicy).map((policy) => (
                <MenuItem key={policy} value={policy}>
                  {policy}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
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
            {Object.entries(residentialAmenitiesLabels).map(([key, val]) => (
              <MenuItem key={key} value={key}>
                {val}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </Stack>
  );
}
