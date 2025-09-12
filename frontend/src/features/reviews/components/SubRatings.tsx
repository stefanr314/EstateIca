import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import CleanHandsIcon from "@mui/icons-material/CleanHands";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { gray } from "@/shared/ui/theme";

function SubRatingItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Stack spacing={0.5} width={"100%"}>
      <Stack direction="row" spacing={1} alignItems="center">
        {icon}
        <Typography variant="body2" flex={1}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={600} color="mint.main">
          {value.toFixed(1)}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={(value / 10) * 100}
        sx={(theme) => ({
          height: 8,
          borderRadius: 5,
          bgcolor: gray[200],
          "& .MuiLinearProgress-bar": {
            bgcolor: "mint.dark",
          },
          ...theme.applyStyles("dark", {
            bgcolor: gray[700],
            "& .MuiLinearProgress-bar": {
              bgcolor: "mint.light",
            },
          }),
        })}
      />
    </Stack>
  );
}

export function SubRatings({ averageRating }: { averageRating: any }) {
  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      <Box sx={{ width: "100%" }}>
        <SubRatingItem
          label="Čistoća"
          value={averageRating.cleanliness}
          icon={<CleanHandsIcon color="primary" />}
        />
      </Box>
      <Box sx={{ width: "100%" }}>
        <SubRatingItem
          label="Sadržaji"
          value={averageRating.amenities}
          icon={<HomeIcon color="primary" />}
        />
      </Box>
      <Box sx={{ width: "100%" }}>
        <SubRatingItem
          label="Domaćin"
          value={averageRating.host}
          icon={<PersonIcon color="primary" />}
        />
      </Box>
      <Box sx={{ width: "100%" }}>
        <SubRatingItem
          label="Lokacija"
          value={averageRating.location}
          icon={<LocationOnIcon color="primary" />}
        />
      </Box>
    </Stack>
  );
}
