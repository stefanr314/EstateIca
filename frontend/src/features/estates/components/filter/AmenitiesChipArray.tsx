import * as React from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

// import {
//   AcUnit,
//   Elevator,
//   Kitchen,
//   LocalParking,
//   Wifi,
// } from "@mui/icons-material";
import { amenitiesMap, AmenityKey } from "@/shared/constants/amenitiesMap";

// interface ChipData {
//   key: number;
//   label: string;
//   icon: React.ReactElement;
// }

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function AmenitiesChipArray({
  selectedAmenities,
  setSelectedAmenities,
}: {
  selectedAmenities: AmenityKey[];
  setSelectedAmenities: React.Dispatch<React.SetStateAction<AmenityKey[]>>;
}) {
  // const [chipData, setChipData] = React.useState<readonly ChipData[]>([
  //   { key: 0, label: "WiFi", icon: <Wifi /> },
  //   { key: 1, label: "Parking", icon: <LocalParking /> },
  //   { key: 2, label: "Air Conditioning", icon: <AcUnit /> },
  //   { key: 3, label: "Kitchen", icon: <Kitchen /> },
  //   { key: 4, label: "Elevator", icon: <Elevator /> },
  // ]);

  const toggleAmenity = (key: AmenityKey) => {
    setSelectedAmenities((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  //   const handleDelete = (chipToDelete: ChipData) => () => {
  //     setChipData((chips) =>
  //       chips.filter((chip) => chip.key !== chipToDelete.key)
  //     );
  //   };

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
        const selected = selectedAmenities.includes(key as AmenityKey);
        const Icon = icon;
        return (
          <ListItem key={key}>
            <Chip
              icon={<Icon />}
              label={label}
              variant={selected ? "filled" : "outlined"}
              color={selected ? "primary" : "default"}
              onClick={() => toggleAmenity(key as AmenityKey)}
              sx={{
                fontSize: "1rem",
                height: 40,
                paddingX: 1.5,
                ".MuiChip-icon": {
                  fontSize: "1.5rem",
                  color: selected ? "white" : "mint.dark",
                },
              }}
            />
          </ListItem>
        );
      })}
    </Box>
  );
}
