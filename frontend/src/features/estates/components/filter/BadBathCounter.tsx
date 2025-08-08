import { Box, IconButton, Typography, useTheme } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

export default function BedBathCounter({
  beds,
  setBeds,
  baths,
  setBaths,
}: {
  beds: number;
  setBeds: React.Dispatch<React.SetStateAction<number>>;
  baths: number;
  setBaths: React.Dispatch<React.SetStateAction<number>>;
}) {
  const theme = useTheme();

  const handleChange = (type: "beds" | "baths", delta: -1 | 1) => () => {
    if (type === "beds") {
      setBeds((prev) => Math.max(0, prev + delta));
    } else {
      setBaths((prev) => Math.max(0, prev + delta));
    }
  };

  const renderRow = (label: string, value: number, type: "beds" | "baths") => (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      paddingY={1}
    >
      <Typography fontSize="1.1rem" fontWeight={500}>
        {label}
      </Typography>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton
          onClick={handleChange(type, -1)}
          disabled={value === 0}
          color="primary"
          sx={{
            border: `1px solid ${theme.palette.grey[400]}`,
            borderRadius: 2,
            width: 36,
            height: 36,
          }}
        >
          <RemoveIcon />
        </IconButton>
        <Typography
          fontSize="1.1rem"
          width={60}
          textAlign="center"
          sx={{ overflowWrap: "break-word" }}
        >
          {value !== 0 ? `${value}+` : "Neodređeno"}
        </Typography>
        <IconButton
          onClick={handleChange(type, 1)}
          color="primary"
          sx={{
            border: `1px solid ${theme.palette.grey[400]}`,
            borderRadius: 2,
            width: 36,
            height: 36,
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {renderRow("Broj kreveta", beds, "beds")}
      {renderRow("Broj kupatila", baths, "baths")}
    </Box>
  );
}
