import { Item } from "./EstateDetailsMain";
import { Stack, Typography, Divider, useTheme } from "@mui/material";
import EuroIcon from "@mui/icons-material/Euro";
import SavingsIcon from "@mui/icons-material/Savings";
import CalculateIcon from "@mui/icons-material/Calculate";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useAppDispatch } from "@/app/store/hooks";
import { useEffect, useMemo } from "react";
import { setReservation } from "@/features/reservations/reservationSlice";

interface EstatePriceCardProps {
  rentalType: "Short Term" | "Long Term";
  price: number; // cijena po noći ili mjesecu
  securityDeposit?: number;
  stayLength: number; // broj dana ili mjeseci (zavisno od rentalType)
  guestIncluded?: number;
  extraPeople?: number;
  guestCount: number;
  childrenCount: number;
}

const EXTRA_FEE_PER_EXTRAGUEST = 5; //isto kao na bekendu
const CHILDREN_DISCOUNT = 4;

export function EstatePriceCard({
  rentalType,
  price,
  securityDeposit,
  stayLength,
  guestIncluded = 0,
  guestCount,
  extraPeople = 0,
  childrenCount,
}: EstatePriceCardProps) {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  //memoizacija kako ovaj derived state ne bi izazivao previse re rendera
  const priceDetails = useMemo(() => {
    const basePrice = price * stayLength;

    const totalGuests = guestCount + childrenCount;
    let extraFee = 0;
    let discount = 0;

    if (
      extraPeople &&
      totalGuests > guestIncluded &&
      totalGuests - guestIncluded <= extraPeople
    ) {
      extraFee = EXTRA_FEE_PER_EXTRAGUEST * (totalGuests - guestIncluded);
    }

    if (childrenCount > 0) {
      discount = CHILDREN_DISCOUNT;
    }

    return {
      basePrice,
      extraFee,
      discount,
      totalPrice: basePrice + extraFee - discount,
    };
  }, [
    price,
    stayLength,
    guestCount,
    childrenCount,
    extraPeople,
    guestIncluded,
  ]);

  useEffect(() => {
    dispatch(setReservation({ totalPrice: priceDetails.totalPrice }));
  }, [dispatch, priceDetails.totalPrice]);

  return (
    <Item
      elevation={4}
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
      }}
    >
      {/* Naslov */}
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Cijena
      </Typography>
      <Divider />

      {/* Osnovna cijena */}
      <Stack direction="row" spacing={1} alignItems="center">
        <EuroIcon sx={{ color: theme.palette.success.main }} fontSize="small" />
        <Typography variant="body1" color="text.primary">
          <strong>{price.toLocaleString("de-DE")} €</strong> /{" "}
          {rentalType === "Short Term" ? "noć" : "mjesec"}
        </Typography>
      </Stack>

      {/* Depozit */}
      {securityDeposit !== undefined && (
        <Stack direction="row" spacing={1} alignItems="center">
          <SavingsIcon
            sx={{ color: theme.palette.warning.main }}
            fontSize="small"
          />
          <Typography variant="body2" color="text.secondary">
            Depozit: {securityDeposit.toLocaleString("sr-RS")} €
          </Typography>
        </Stack>
      )}

      {/* Dodatni troškovi */}
      {priceDetails.extraFee > 0 && (
        <Stack direction="row" spacing={1} alignItems="center">
          <AddIcon sx={{ color: theme.palette.error.main }} fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            Doplata za dodatne goste: +{priceDetails.extraFee} €
          </Typography>
        </Stack>
      )}

      {/* Popust za djecu */}
      {priceDetails.discount > 0 && (
        <Stack direction="row" spacing={1} alignItems="center">
          <RemoveIcon
            sx={{ color: theme.palette.info.main }}
            fontSize="small"
          />
          <Typography variant="body2" color="text.secondary">
            Popust za djecu: −{priceDetails.discount} €
          </Typography>
        </Stack>
      )}

      {/* Ukupno */}
      <Divider sx={{ my: 1 }} />
      <Stack direction="row" spacing={1} alignItems="center">
        <CalculateIcon
          sx={{ color: theme.palette.info.main }}
          fontSize="small"
        />
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Ukupno: {priceDetails.totalPrice.toLocaleString("sr-RS")} €
        </Typography>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        ({stayLength} {rentalType === "Short Term" ? "noći" : "mjeseci"})
      </Typography>
    </Item>
  );
}
