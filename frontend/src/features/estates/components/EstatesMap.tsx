import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import HomeIcon from "@mui/icons-material/Home";
import { Box, useColorScheme } from "@mui/material";

interface Props {
  coordinates: [number, number]; // [lng, lat]
}

export default function EstateMap({ coordinates }: Props) {
  const [lng, lat] = coordinates;

  const { mode } = useColorScheme();
  const isDarkMode = mode === "dark";
  return (
    <Map
      mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
      style={{ width: "100%", height: "100%" }}
      defaultCenter={{ lat, lng }}
      defaultZoom={14}
      gestureHandling={"cooperative"}
      colorScheme={isDarkMode ? "DARK" : "LIGHT"}
    >
      <AdvancedMarker position={{ lat, lng }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "primary.main", // koristi tvoj primary main
            color: "mint.main", // kontrastna mint boja
            borderRadius: 2,
            px: 1.5,
            py: 1,
            minWidth: 60,
            height: 60,
            boxShadow: 3,
            textAlign: "center",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-3px) scale(1.05)",
              boxShadow: 6,
            },
            position: "relative",
          }}
        >
          <HomeIcon sx={{ fontSize: 24, mb: 0.3 }} />

          {/* Tip marker */}
          <Box
            sx={{
              position: "absolute",
              bottom: -6,
              left: "50%",
              width: 0,
              height: 0,
              border: "6px solid",
              borderColor: "primary.main",
              transform: "translateX(-50%) rotate(45deg)",
              zIndex: -1,
            }}
          />
        </Box>
      </AdvancedMarker>
    </Map>
  );
}
