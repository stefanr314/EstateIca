import { useAppDispatch } from "@/app/store/hooks";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useLocation, useNavigate } from "react-router";
import { verifyUser } from "./authSlice";
import { pushNotification } from "../notifications/notificationSlice";

function VerifyAccountPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(search).get("token");
  const dispatch = useAppDispatch();

  async function handleVerify() {
    try {
      if (token) {
        await dispatch(verifyUser({ token })).unwrap();
        dispatch(
          pushNotification({
            type: "success",
            message: "Uspjesno ste verifikovali svoj nalog",
          })
        );
      }
    } catch (error: any) {
      dispatch(
        pushNotification({
          type: "error",
          message: error || "Desila se greska prilikom verifikacije naloga",
        })
      );
    } finally {
      navigate("/dashboard", { replace: true });
    }
  }

  return (
    <Box
      height={"100vh"}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card>
        <CardHeader
          title={"Verifikujte svoj nalog"}
          sx={{ textAlign: "center", color: "text.primary", pb: 2 }}
        />
        <CardContent>
          <Typography color="text.primary" variant="body1">
            Klikom na dugme ispod verifikujte svoj nalog.
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            py: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button variant="outlined" onClick={handleVerify}>
            Verifikuj
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default VerifyAccountPage;
