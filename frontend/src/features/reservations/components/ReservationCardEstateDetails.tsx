import {
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  FormControl,
  Typography,
  Stack,
} from "@mui/material";
import { CalendarMonth, Group } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";

interface ReservationCardProps {
  defaultStartDate?: Date | null;
  defaultEndDate?: Date | null;
  isDisabled: boolean;
  guestCount?: number;
  isLongTermEstate?: boolean;
}

export default function ReservationCard({
  defaultStartDate = null,
  defaultEndDate = null,
  isDisabled = false,
  guestCount,
  isLongTermEstate = false,
}: ReservationCardProps) {
  const handleReservation = () => {
    console.log("Reservation details:", {
      defaultStartDate,
      defaultEndDate,
      guestCount,
    });
  };

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        mx: "auto",
        background: "background.paper",
        borderRadius: 3,
        p: 9,
      }}
    >
      <CardHeader
        title={
          <Typography variant="h4" align="center" color="text.primary">
            Rezerviši svoj smještaj
          </Typography>
        }
        sx={{ pb: 4 }}
      />

      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
        {/* Date Range Section */}
        <Stack direction="row" spacing={2}>
          <DatePicker
            label="Dolazak"
            value={defaultStartDate}
            readOnly
            views={
              isLongTermEstate ? ["month", "year"] : ["day", "month", "year"]
            }
            slotProps={{
              textField: {
                fullWidth: true,
                InputLabelProps: { shrink: true },
                InputProps: {
                  startAdornment: (
                    <CalendarMonth
                      fontSize="small"
                      color="action"
                      sx={{ mr: 1 }}
                    />
                  ),
                  endAdornment: null,
                },
              },
            }}
          />
          <DatePicker
            label="Odlazak"
            value={defaultEndDate}
            readOnly
            views={
              isLongTermEstate ? ["month", "year"] : ["day", "month", "year"]
            }
            slotProps={{
              textField: {
                fullWidth: true,
                InputLabelProps: { shrink: true },
                InputProps: {
                  startAdornment: (
                    <CalendarMonth
                      fontSize="small"
                      color="action"
                      sx={{ mr: 1 }}
                    />
                  ),
                  endAdornment: null,
                },
              },
            }}
          />
        </Stack>

        {/* Guest Count */}
        {guestCount && (
          <FormControl fullWidth>
            <TextField
              label="Gosti"
              value={guestCount}
              slotProps={{
                input: {
                  readOnly: true,
                  startAdornment: <Group fontSize="small" sx={{ mr: 1 }} />,
                },
              }}
            />
          </FormControl>
        )}

        {/* Reserve Button */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={isDisabled}
          sx={(theme) => ({
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: "1rem",
            transition: "all 0.2s ease-in-out",

            background:
              "linear-gradient(135deg, hsl(125, 60%, 42%) 0%, hsl(150, 55%, 50%) 100%)",
            "&:hover": {
              background:
                "linear-gradient(135deg, hsl(125, 65%, 35%) 0%, hsl(150, 50%, 40%) 100%)",
              transform: "translateY(-2px) scale(1.02)", // lagano podizanje i povećanje
              boxShadow: theme.shadows[10], // jači shadow da naglasi hover
            },

            "&:active": {
              transform: "translateY(0) scale(0.98)", // klik - blagi pritisak
              boxShadow: theme.shadows[1],
            },

            "&.Mui-disabled": {
              pointerEvents: "auto", // omogući hover i kursor
              cursor: "not-allowed",

              backgroundColor: theme.palette.grey[300],
              color: theme.palette.grey[600],
              backgroundImage: "none",
              border: "none",
              boxShadow: theme.shadows[1],

              "&:hover": {
                boxShadow: theme.shadows[5],
                cursor: "not-allowed",
                backgroundColor: theme.palette.grey[300],
                transform: "none", // nema animacije kad je disabled
              },

              ...theme.applyStyles("dark", {
                backgroundColor: theme.palette.grey[700],
                color: theme.palette.grey[200],
                "&:hover": {
                  backgroundColor: theme.palette.grey[700],
                  boxShadow: theme.shadows[10],
                },
              }),
            },
          })}
          onClick={handleReservation}
        >
          Reserve Now
        </Button>

        {/* Helper text when disabled */}
        {isDisabled && (
          <Typography variant="body2" color="error.light" align="center">
            {!defaultStartDate || !defaultEndDate
              ? "Molimo Vas odaberite datume dolaska i odlaska kako biste izvršili rezervaciju."
              : "Odabrani raspon datuma nije validan. Povesti računa o maksimalnoj i minimalnoj dužini rentanja."}
          </Typography>
        )}

        {/* Info */}
        {/* <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ pt: 1 }}
        >
          Nece Vam biti naplaceno jos uvijek.
        </Typography> */}
      </CardContent>
    </Card>
  );
}
