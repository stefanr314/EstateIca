import { Drawer, Button } from "@mui/material";
import { useState } from "react";
import ReservationCard from "./ReservationCardEstateDetails";
import { Item } from "@/features/estates/components/EstateDetailsMain";

interface MobileReservationProps {
  startDate: Date | null;
  endDate: Date | null;
  guestCount?: number;
  childrenCount?: number;
  isDisabled: boolean;
  isLongTermEstate?: boolean;
}

function MobileReservation({
  startDate,
  endDate,
  guestCount,
  childrenCount,
  isDisabled = false,
  isLongTermEstate,
}: MobileReservationProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Fixed button na dnu */}
      <Item
        sx={{
          position: "fixed",
          width: "100%",
          left: 0,
          bottom: 0,
          p: 2,
          bgcolor: "secondary.main",
          zIndex: 1200,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => setOpen(true)}
        >
          Prikaži rezervaciju
        </Button>
      </Item>

      {/* Drawer sa karticom */}
      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 2,
            maxHeight: "90vh",
          },
        }}
      >
        <ReservationCard
          defaultStartDate={startDate}
          defaultEndDate={endDate}
          isDisabled={isDisabled}
          guestCount={guestCount}
          childrenCount={childrenCount}
          isLongTermEstate={isLongTermEstate}
        />
      </Drawer>
    </>
  );
}

export default MobileReservation;
