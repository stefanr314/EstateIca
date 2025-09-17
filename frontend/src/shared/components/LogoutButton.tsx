import { logoutUser } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/store/hooks";
import { Button } from "@mui/material";

export default function LogoutButton() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/", { replace: true });
  };

  return (
    <Button variant="outlined" onClick={handleLogout}>
      Izloguj se
    </Button>
  );
}
