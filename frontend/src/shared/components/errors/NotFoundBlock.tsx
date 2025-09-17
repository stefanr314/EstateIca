import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

interface NotFoundBlockProps {
  message?: string;
}

function NotFoundBlock({ message }: NotFoundBlockProps) {
  const navigate = useNavigate();
  return (
    <Box textAlign="center" py={8}>
      <Typography variant="h4" gutterBottom>
        404 - Nije pronađeno
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {message ?? "Traženi resurs nije pronađen."}
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Povratak na početnu
      </Button>
    </Box>
  );
}

export default NotFoundBlock;
