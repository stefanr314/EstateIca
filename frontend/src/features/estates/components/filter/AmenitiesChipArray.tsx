import { amenitiesMap } from "@/shared/constants/amenitiesMap";
import { Amenities } from "@/features/estates/types";
import { Box, Chip } from "@mui/material";

type Props = {
  selectedAmenities: Amenities[];
  setSelectedAmenities: React.Dispatch<React.SetStateAction<Amenities[]>>;
};

export default function AmenitiesChipArray({
  selectedAmenities,
  setSelectedAmenities,
}: Props) {
  const toggleAmenity = (key: Amenities) => {
    setSelectedAmenities((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        listStyle: "none",
        p: 0.5,
        m: 0,
      }}
      component="ul"
    >
      {Object.entries(amenitiesMap).map(([key, { label, icon }]) => {
        const enumKey = key as Amenities;
        const selected = selectedAmenities.includes(enumKey);
        const Icon = icon;
        return (
          <li key={key} style={{ margin: 4 }}>
            <Chip
              icon={<Icon />}
              label={label}
              variant={selected ? "filled" : "outlined"}
              color={selected ? "primary" : "default"}
              onClick={() => toggleAmenity(enumKey)}
              sx={{
                fontSize: "1rem",
                height: 40,
                px: 1.5,
                ".MuiChip-icon": {
                  fontSize: "1.5rem",
                  color: selected ? "white" : "mint.dark",
                },
              }}
            />
          </li>
        );
      })}
    </Box>
  );
}
