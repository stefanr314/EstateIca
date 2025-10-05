import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Euro, Group, Payment, Home } from "@mui/icons-material";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import { IReservationPopulated } from "../types/index";

export default function ReservationPaymentCard({
  reservation,
}: {
  reservation: IReservationPopulated;
}) {
  return (
    <Card>
      <CardContent sx={{ py: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          <Payment color="primary" sx={{ mr: 1 }} />
          Plaćanje i uslovi
        </Typography>

        <List dense disablePadding>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Euro fontSize="small" color="action" />
            </ListItemIcon>
            <ListItemText
              primary={`${reservation.totalPrice} €`}
              secondary="Ukupna cijena"
              primaryTypographyProps={{ fontWeight: 500, fontSize: "1.1rem" }}
            />
          </ListItem>

          {reservation.pricePerNight && (
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Euro fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText
                primary={`${reservation.pricePerNight} €`}
                secondary="Cijena po noći"
              />
            </ListItem>
          )}

          {reservation.pricePerMonth && (
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Euro fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText
                primary={`${reservation.pricePerMonth} €`}
                secondary="Cijena po mjesecu"
              />
            </ListItem>
          )}

          {reservation.extraPeopleFee && (
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Group fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText
                primary={`${reservation.extraPeopleFee} €`}
                secondary="Doplatak za dodatne osobe"
              />
            </ListItem>
          )}

          {reservation.unitCount && (
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Home fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText
                primary={reservation.unitCount}
                secondary="Broj jedinica"
              />
            </ListItem>
          )}

          {reservation.isContractRequired && (
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <BeenhereIcon fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText
                primary="Ugovor obavezan"
                secondary="Potrebno potpisivanje ugovora"
              />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
}
