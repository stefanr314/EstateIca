import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Home, LocationOn } from "@mui/icons-material";

export default function ReservationEstateCard({
  estateTitle,
  address,
}: {
  estateTitle: string;
  address?: { city?: string; country?: string };
}) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ py: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          <Home color="primary" sx={{ mr: 1 }} />
          Smještaj
        </Typography>
        <List dense disablePadding>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Home fontSize="small" color="action" />
            </ListItemIcon>
            <ListItemText
              primary={estateTitle}
              secondary="Naziv smještaja"
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItem>
          {address && (
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LocationOn fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText
                primary={`${address.city ?? ""}, ${address.country ?? ""}`}
                secondary="Lokacija"
              />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
}
