import {
  Stack,
  Typography,
  Select,
  MenuItem,
  Divider,
  FormHelperText,
} from "@mui/material";
import { Item } from "./EstateDetailsMain";

interface GuestSelectorProps {
  maxGuests: number;
  guestCount: number;
  setGuestCount: (count: number) => void;
  childrenCount: number;
  setChildrenCount: (count: number) => void;
}

export const GuestSelector = ({
  maxGuests,
  guestCount,
  setGuestCount,
  childrenCount,
  setChildrenCount,
}: GuestSelectorProps) => {
  const total = guestCount + childrenCount;
  const isOverLimit = total > maxGuests;

  const handleGuestChange = (val: number) => {
    setGuestCount(val);
    if (val + childrenCount > maxGuests) {
      setChildrenCount(maxGuests - val); // auto-reduce djecu
    }
  };

  const handleChildrenChange = (val: number) => {
    setChildrenCount(val);
    if (guestCount + val > maxGuests) {
      setGuestCount(Math.max(1, maxGuests - val)); // auto-reduce odrasle (bar 1)
    }
  };

  return (
    <Item elevation={4} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5" pb={1}>
        Broj gostiju
      </Typography>
      <Divider />

      <Stack direction="row" gap={4} alignItems="center" pt={1}>
        {/* Odrasli */}
        <Stack direction="column" gap={0.5}>
          <Stack direction="row" gap={1} alignItems="center">
            <Typography variant="body2">Odrasli:</Typography>
            <Select
              value={guestCount}
              onChange={(e) => handleGuestChange(Number(e.target.value))}
              sx={{ minWidth: 80 }}
            >
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map((val) => (
                <MenuItem
                  key={val}
                  value={val}
                  disabled={val + childrenCount > maxGuests}
                >
                  {val}
                </MenuItem>
              ))}
            </Select>
          </Stack>
          {guestCount < 1 && (
            <FormHelperText error>
              Mora biti bar jedan odrasli gost
            </FormHelperText>
          )}
        </Stack>

        {/* Djeca */}
        <Stack direction="column" gap={0.5}>
          <Stack direction="row" gap={1} alignItems="center">
            <Typography variant="body2">Djeca:</Typography>
            <Select
              value={childrenCount}
              onChange={(e) => handleChildrenChange(Number(e.target.value))}
              sx={{ minWidth: 80 }}
            >
              {Array.from({ length: maxGuests }, (_, i) => i).map((val) => (
                <MenuItem
                  key={val}
                  value={val}
                  disabled={guestCount + val > maxGuests}
                >
                  {val}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Stack>
      </Stack>

      {/* Generalni feedback */}
      {isOverLimit && (
        <FormHelperText error>
          Ukupan broj gostiju ne smije biti veći od {maxGuests}.
        </FormHelperText>
      )}
    </Item>
  );
};
