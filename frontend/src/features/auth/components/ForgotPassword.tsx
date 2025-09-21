import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useAppDispatch } from "@/app/store/hooks";
import { pushNotification } from "@/features/notifications/notificationSlice";
import { forgotPasswordSender } from "../authSlice";

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({
  open,
  handleClose,
}: ForgotPasswordProps) {
  const [email, setEmail] = React.useState("");
  const dispatch = useAppDispatch();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (email.length === 0)
      return dispatch(
        pushNotification({ type: "warning", message: "Unesite email adresu." })
      );
    try {
      await dispatch(forgotPasswordSender({ email }));
      dispatch(
        pushNotification({
          type: "info",
          message: "Mejl uspješno poslat, provjerite svoje poštansko sanduče.",
        })
      );
    } catch (error: any) {
      dispatch(
        pushNotification({
          type: "error",
          message: error,
        })
      );
    } finally {
      handleClose();
    }
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: { backgroundImage: "none" },
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Zaboravio si lozinku?</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          <DialogContentText>
            Unesite svoju email adresu i na nju cemo Vam poslati link za
            kreiranje nove lozinke.
          </DialogContentText>
          <OutlinedInput
            autoFocus
            required
            margin="dense"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            label="Email address"
            placeholder="Email address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleClose}>Otkaži</Button>
          <Button
            variant="contained"
            type="submit"
            disabled={email.length === 0}
          >
            Pošalji
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
