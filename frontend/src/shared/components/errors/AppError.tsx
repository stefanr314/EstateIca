import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface AppErrorProps {
  message?: string;
}

function AppError({ message }: AppErrorProps) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="40vh"
    >
      <Typography color="error" variant="body1">
        {message ?? "Došlo je do greške."}
      </Typography>
    </Box>
  );
}

export default AppError;
