import React from "react";
import { Box, Typography, IconButton, SxProps, Theme } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";

type SizeType = "small" | "medium" | "large";

interface GuestsCounterProps {
  adults: number;
  children: number;
  onAdultsChange: (val: number) => void;
  onChildrenChange: (val: number) => void;
  size?: SizeType;
  sx?: SxProps<Theme>; // za dodatne stilove ako treba
}

const sizes = {
  small: {
    icon: 20,
    button: 28,
    font: 13,
    spacing: 1,
  },
  medium: {
    icon: 24,
    button: 32,
    font: 15,
    spacing: 2,
  },
  large: {
    icon: 28,
    button: 40,
    font: 17,
    spacing: 2.5,
  },
};

const GuestsCounter: React.FC<GuestsCounterProps> = ({
  adults,
  children,
  onAdultsChange,
  onChildrenChange,
  size = "medium",
  sx,
}) => {
  const mainTheme = useTheme();
  const config = sizes[size];

  return (
    <Box p={1} sx={sx}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={config.spacing}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: config.font,
            paddingRight: `calc(30 * ${config.spacing}px) `,
          }}
        >
          {"Odrasli"}
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            onClick={() => onAdultsChange(Math.max(0, adults - 1))}
            disabled={adults === 0 || (adults === 1 && children > 0)}
            sx={{
              width: config.button,
              height: config.button,
              border: "1px solid #ccc",
              p: "1px",
              color: mainTheme.palette.secondary.dark,
              "&:disabled": {
                color: mainTheme.palette.grey[500],
              },
            }}
          >
            <RemoveIcon sx={{ fontSize: config.icon }} />
          </IconButton>

          <Typography
            sx={{
              fontSize: config.font,
              width: 20,
              textAlign: "center",
            }}
          >
            {adults}
          </Typography>

          <IconButton
            onClick={() => onAdultsChange(Math.min(adults + 1, 10))}
            disabled={adults === 10}
            sx={{
              width: config.button,
              height: config.button,
              border: "1px solid #ccc",
              p: "4px",
              color: mainTheme.palette.secondary.dark,
            }}
          >
            <AddIcon sx={{ fontSize: config.icon }} />
          </IconButton>
        </Box>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={config.spacing}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: config.font,
            paddingRight: `calc(30 * ${config.spacing}px) `,
          }}
        >
          {"Djeca"}
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            onClick={() => onChildrenChange(Math.max(0, children - 1))}
            disabled={children === 0}
            sx={{
              width: config.button,
              height: config.button,
              border: "1px solid #ccc",
              p: "1px",
              color: mainTheme.palette.secondary.dark,
              "&:disabled": {
                color: mainTheme.palette.grey[500],
              },
            }}
          >
            <RemoveIcon sx={{ fontSize: config.icon }} />
          </IconButton>

          <Typography
            sx={{
              fontSize: config.font,
              width: 20,
              textAlign: "center",
            }}
          >
            {children}
          </Typography>

          <IconButton
            onClick={() => {
              adults === 0 && onAdultsChange(1);
              onChildrenChange(Math.min(children + 1, 10));
            }}
            disabled={children === 10}
            sx={{
              width: config.button,
              height: config.button,
              border: "1px solid #ccc",
              p: "4px",
              color: mainTheme.palette.secondary.dark,
            }}
          >
            <AddIcon sx={{ fontSize: config.icon }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default GuestsCounter;
