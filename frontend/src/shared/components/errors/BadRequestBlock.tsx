import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface BadRequestBlockProps {
  message?: string;
}

function BadRequestBlock({ message }: BadRequestBlockProps) {
  return (
    <Box textAlign="center" py={8}>
      <Typography variant="h4" gutterBottom>
        400 - Neispravan zahtjev
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {message ?? "Poslali ste neispravan zahtjev. Pokušajte ponovo."}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.location.reload()}
      >
        Pokušaj ponovo
      </Button>
    </Box>
  );
}

export default BadRequestBlock;
