import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReservationState {
  estateId: string | null;
  estateType: "ResidentialEstate" | "BusinessEstate" | null;
  estateTitle: string | null;
  estateAddress: string | null;
  startDate: Date | null;
  endDate: Date | null;
  guestCount?: number;
  childrenCount?: number;
  unitCount?: number;
  totalPrice: number | null;
  note?: string;
}

const initialState: ReservationState = {
  estateId: null,
  estateType: null,
  estateTitle: null,
  estateAddress: null,
  startDate: null,
  endDate: null,
  guestCount: 0,
  unitCount: undefined,
  childrenCount: 0,
  totalPrice: null,
  note: "",
};

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    setReservation(state, action: PayloadAction<Partial<ReservationState>>) {
      return { ...state, ...action.payload };
    },
    resetReservation() {
      return initialState;
    },
  },
});

export const { setReservation, resetReservation } = reservationSlice.actions;
export default reservationSlice.reducer;
