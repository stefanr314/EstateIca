import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Person, Email, Phone, Group, Note } from "@mui/icons-material";

interface PersonData {
  name?: string;
  email?: string;
  phone?: string;
  guests?: number;
  children?: number;
  note?: string;
}

interface Props {
  title: string;
  person: PersonData;
}

export default function ReservationPersonCard({ title, person }: Props) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ py: 2 }}>
        <Typography
          variant="h6"
          sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
        >
          <Person color="primary" />
          {title}
        </Typography>

        <List dense disablePadding>
          {person.name && (
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Person fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText
                primary={person.name}
                secondary="Ime i prezime"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
          )}

          {person.email && (
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Email fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText primary={person.email} secondary="Email adresa" />
            </ListItem>
          )}

          {person.phone && (
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Phone fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText primary={person.phone} secondary="Telefon" />
            </ListItem>
          )}

          {(person.guests !== undefined || person.children !== undefined) && (
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Group fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText
                primary={`${person.guests ?? 0} odraslih, ${
                  person.children ?? 0
                } djece`}
                secondary="Broj osoba"
              />
            </ListItem>
          )}

          {person.note && (
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Note fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText primary={person.note} secondary="Napomena" />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
}
