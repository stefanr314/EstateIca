import { Snackbar, Alert } from "@mui/material";

import { removeNotification } from "@/features/notifications/notificationSlice";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { RootState } from "@/app/store/store";

export const ToastManager = () => {
  const notifications = useAppSelector(
    (state: RootState) => state.notification
  );
  const dispatch = useAppDispatch();

  return (
    <>
      {notifications.map((n) => (
        <Snackbar
          key={n.id}
          open
          autoHideDuration={3000}
          onClose={() => dispatch(removeNotification(n.id))}
        >
          <Alert
            severity={n.type}
            variant="filled"
            sx={{ width: "100%" }}
            onClose={() => dispatch(removeNotification(n.id))}
          >
            {n.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};
