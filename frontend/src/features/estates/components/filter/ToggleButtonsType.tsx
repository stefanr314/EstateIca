import * as React from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

// import ApartmentIcon from "@mui/icons-material/Apartment";
// import HouseIcon from "@mui/icons-material/House";

// import BedIcon from "@mui/icons-material/Bed";
// import FilterNoneIcon from "@mui/icons-material/FilterNone";
// import { ErrorBoundary } from "react-error-boundary";

export default function ToggleButtonsType({
  type,
  setType,
}: {
  type: string | null;
  setType: (type: string | null) => void;
}) {
  const handleType = (
    event: React.MouseEvent<HTMLElement>,
    newType: string | null
  ) => {
    setType(newType);
  };

  return (
    <ToggleButtonGroup
      value={type}
      exclusive
      onChange={handleType}
      aria-label="type residential"
    >
      <ToggleButton value="any" aria-label="any type">
        {/* <FilterNoneIcon fontSize="large" /> */}
        Bilo koji tip
      </ToggleButton>
      <ToggleButton value="apartment" aria-label="apartment type">
        {/* <ApartmentIcon color="primary" fontSize="large" /> */}
        APARTMAN
      </ToggleButton>
      <ToggleButton value="room" aria-label="room type">
        {/* <BedIcon color="secondary" fontSize="large" /> */}
        SOBA
      </ToggleButton>
      <ToggleButton value="house" aria-label="house type">
        {/* <HouseIcon sx={{ color: "mint.main" }} fontSize="large" /> */}
        KUĆA
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
