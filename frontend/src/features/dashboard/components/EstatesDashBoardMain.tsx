import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

import { useNavigate } from "react-router-dom";

type Estate = {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  beds: number;
  rooms: number;
  isVisible: boolean;
};

const mockEstates: Estate[] = [
  {
    id: "1",
    title: "Modern Apartment in City Center",
    description: "Bright apartment with 2 bedrooms, near the main square.",
    image: "https://source.unsplash.com/400x250/?apartment",
    location: "Belgrade, Serbia",
    beds: 2,
    rooms: 3,
    isVisible: true,
  },
  {
    id: "2",
    title: "Cozy Cottage in the Mountains",
    description: "Peaceful getaway with fireplace and beautiful views.",
    image: "https://source.unsplash.com/400x250/?cabin",
    location: "Zlatibor, Serbia",
    beds: 3,
    rooms: 4,
    isVisible: false,
  },
];

export default function YourEstatesDashboard() {
  const navigate = useNavigate();

  const handleHideToggle = (id: string) => {
    // TODO: Call API to hide/show estate
    console.log("Toggle visibility for estate:", id);
  };

  const handleDelete = (id: string) => {
    // TODO: Call API to delete estate
    console.log("Delete estate:", id);
  };

  return (
    <Box sx={{ px: 3, pb: 6, pt: 3 }}>
      <Typography variant="h2" gutterBottom>
        Your Estates Mr. Rile
      </Typography>

      <Grid container spacing={3}>
        {mockEstates.map((estate) => (
          <Grid sx={{ xs: "12", sm: "6", md: "4" }} key={estate.id}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.01)",
                },
              }}
              onClick={() => navigate(`/dashboard/your-estates/${estate.id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={estate.image}
                alt={estate.title}
              />
              <CardContent>
                <Typography variant="h6">{estate.title}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {estate.description}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Typography variant="body2">🏙 {estate.location}</Typography>
                  <Typography variant="body2">🛏 {estate.beds} beds</Typography>
                  <Typography variant="body2">
                    🚪 {estate.rooms} rooms
                  </Typography>
                </Stack>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHideToggle(estate.id);
                  }}
                >
                  {estate.isVisible ? "Sakrij" : "Prikaži"}
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(estate.id);
                  }}
                >
                  Obriši
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
