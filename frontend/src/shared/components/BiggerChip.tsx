import Chip from "@mui/material/Chip";
import { ChipProps } from "@mui/material/Chip";

export const BigChip = (props: ChipProps) => (
  <Chip
    {...props}
    sx={{
      fontSize: "1rem",
      height: 40,
      paddingX: 1.5,
      ".MuiChip-icon": { fontSize: "1.5rem" },
      ...props.sx, // omogućava dodatne stilove ako ti zatrebaju
    }}
  />
);
