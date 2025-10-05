import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { CalendarToday, AccessTime } from "@mui/icons-material";

interface Props {
  startDate: string;
  endDate: string;
  createdAt?: string;
}

export default function ReservationDatesCard({
  startDate,
  endDate,
  createdAt,
}: Props) {
  return (
    <Card>
      <CardContent sx={{ py: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          <CalendarToday color="primary" sx={{ mr: 1 }} />
          Datumi boravka
        </Typography>

        <List dense disablePadding>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <AccessTime fontSize="small" color="action" />
            </ListItemIcon>
            <ListItemText
              primary={`${new Date(startDate).toLocaleDateString(
                "sr-Latn-RS"
              )} → ${new Date(endDate).toLocaleDateString("sr-Latn-RS")}`}
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItem>

          {createdAt && (
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CalendarToday fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText
                primary={new Date(createdAt).toLocaleDateString("sr-Latn-RS")}
                secondary="Datum kreiranja"
              />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
}
