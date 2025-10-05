import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { CheckCircle, Cancel, Schedule } from "@mui/icons-material";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import { ReservationStatus } from "../types";

interface Props {
  status: ReservationStatus;
}

export default function ReservationStatusCard({ status }: Props) {
  const getStatusIcon = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.CONFIRMED:
        return <CheckCircle color="success" />;
      case ReservationStatus.CANCELED:
        return <Cancel color="error" />;
      case ReservationStatus.PENDING:
        return <Schedule color="warning" />;
      case ReservationStatus.COMPLETED:
        return <BeenhereIcon color="info" />;
      default:
        return <Schedule />;
    }
  };

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.CONFIRMED:
        return "success";
      case ReservationStatus.CANCELED:
        return "error";
      case ReservationStatus.PENDING:
        return "warning";
      case ReservationStatus.COMPLETED:
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {getStatusIcon(status)}
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Status rezervacije
            </Typography>
            <Chip
              label={status}
              color={getStatusColor(status) as any}
              size="medium"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
