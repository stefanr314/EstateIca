import React from "react";
import {
  Box,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import CottageIcon from "@mui/icons-material/Cottage";
import HouseIcon from "@mui/icons-material/House";
import BedIcon from "@mui/icons-material/Bed";
import BusinessIcon from "@mui/icons-material/Business";
import VillaIcon from "@mui/icons-material/Villa";

interface FilterBarProps {
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
  stayType: string;
  onStayTypeChange: (type: string) => void;
}

const estateTypes = [
  {
    value: "apartment",
    icon: <ApartmentIcon />,
    tooltip: "Apartmani",
  },
  {
    value: "cabin",
    icon: <HolidayVillageIcon />,
    tooltip: "Kabine",
  },
  {
    value: "cottage",
    icon: <CottageIcon />,
    tooltip: "Vikendice",
  },
  {
    value: "house",
    icon: <HouseIcon />,
    tooltip: "Kuće",
  },
  {
    value: "room",
    icon: <BedIcon />,
    tooltip: "Sobe",
  },
  {
    value: "multi_unit",
    icon: <BusinessIcon />,
    tooltip: "Multi Unit",
  },
  {
    value: "studio",
    icon: <VillaIcon />,
    tooltip: "Studio",
  },
];

const FilterBar: React.FC<FilterBarProps> = ({
  selectedType,
  onTypeChange,
  stayType,
  onStayTypeChange,
}) => {
  const theme = useTheme();

  const handleTypeClick = (type: string) => {
    onTypeChange(selectedType === type ? null : type);
  };

  const handleStayTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newStayType: string
  ) => {
    if (newStayType !== null) {
      onStayTypeChange(newStayType);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 4,
        p: 2,
        borderRadius: 2,
        backgroundColor: theme.palette.background.default,

        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {/* Property Type Icons */}
      <Box
        sx={{
          display: "flex",
          gap: 2.5,
          alignItems: "center",
        }}
      >
        {estateTypes.map((type) => (
          <Tooltip key={type.value} title={type.tooltip} placement="bottom">
            <IconButton
              onClick={() => handleTypeClick(type.value)}
              size="large"
              sx={{
                p: 1,
                borderRadius: 1,
                color:
                  selectedType === type.value
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                backgroundColor:
                  selectedType === type.value
                    ? theme.palette.primary.main + "15"
                    : "transparent",
                "&:hover": {
                  backgroundColor:
                    selectedType === type.value
                      ? theme.palette.primary.main + "25"
                      : theme.palette.action.hover,
                },
                minWidth: 40,
                minHeight: 40,
              }}
            >
              {type.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>

      {/* Stay Type Toggle */}
      <ToggleButtonGroup
        value={stayType}
        exclusive
        onChange={handleStayTypeChange}
        size="small"
        sx={{
          "& .MuiToggleButton-root": {
            px: 2,
            py: 0.5,
            fontSize: "0.875rem",
            fontWeight: 500,
            textTransform: "none",
            border: `1px solid ${theme.palette.divider}`,
            "&.Mui-selected": {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            },
          },
        }}
      >
        <ToggleButton value="any">Sve</ToggleButton>
        <ToggleButton value="short_term">Kratkoročno</ToggleButton>
        <ToggleButton value="long_term">Dugoročno</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default FilterBar;
