import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationToast {
  id: string;
  type: "info" | "success" | "error" | "warning";
  message: string;
}

const initialState: NotificationToast[] = [];

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    pushNotification(
      state,
      action: PayloadAction<Omit<NotificationToast, "id">>
    ) {
      const id = Date.now().toString();
      state.push({ id, ...action.payload });
    },
    removeNotification(state, action: PayloadAction<string>) {
      return state.filter((n) => n.id !== action.payload);
    },
  },
});

export const { pushNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
