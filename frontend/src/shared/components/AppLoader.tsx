import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";

interface AppLoaderProps {
  loading: boolean;
  text?: string;
  delay?: number; // Delay in milliseconds before the loader appears
}

export default function AppLoader({
  loading,
  text,
  delay = 800,
}: AppLoaderProps) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="40vh"
      flexDirection="column"
    >
      <Fade
        in={loading}
        style={{
          transitionDelay: loading ? `${delay}ms` : "0ms",
        }}
        unmountOnExit
      >
        <CircularProgress aria-label={text || "Loading"} />
      </Fade>
      {text && (
        <Fade
          in={loading}
          style={{
            transitionDelay: loading ? `${delay}ms` : "0ms",
          }}
          unmountOnExit
        >
          <Typography sx={{ mt: 2 }}>{text}</Typography>
        </Fade>
      )}
    </Box>
  );
}
