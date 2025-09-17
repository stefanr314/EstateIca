import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../../features/user/userSlice";
import notificationReducer from "@/features/notifications/notificationSlice";
import authReducer from "@/features/auth/authSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
