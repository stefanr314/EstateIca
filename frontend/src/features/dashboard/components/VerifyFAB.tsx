import { Fab } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { selectUser } from "@/features/auth/authSlice";
import { verificationSender } from "@/features/auth/authSlice";
import { pushNotification } from "@/features/notifications/notificationSlice";

function VerifyFab() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  if (!user || user.isVerified) return null;

  const handleClick = async () => {
    try {
      await dispatch(verificationSender({ email: user.email })).unwrap();
      dispatch(
        pushNotification({
          type: "info",
          message: "Provjerite svoj email i kliknite na verifikacioni link.",
        })
      );
    } catch (err) {
      dispatch(
        pushNotification({
          type: "error",
          message: "Slanje verifikacionog maila nije uspjelo.",
        })
      );
    }
  };

  return (
    <Fab
      variant="extended"
      color="primary"
      onClick={handleClick}
      sx={{ position: "fixed", bottom: 16, right: 16 }}
    >
      <VerifiedIcon sx={{ mr: 1 }} />
      Verifikuj nalog
    </Fab>
  );
}

export default VerifyFab;
