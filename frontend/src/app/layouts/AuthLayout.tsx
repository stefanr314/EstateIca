import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../store/hooks";
import { selectIsAuthenticated } from "@/features/auth/authSlice";
import { Backdrop, CircularProgress } from "@mui/material";

function AuthLayout() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { status } = useAppSelector((state) => state.auth);

  // ⏳ Dok traje inicijalizacija ili fetch usera
  if (status === "loading" || status === "idle") {
    return (
      <Backdrop
        open
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  // ❌ Ako je fetchCurrentUser failovao ili nema usera
  if (status === "failed" || !isAuthenticated) {
    return <Navigate to="/sign-up" replace />;
  }

  return <Outlet />;
}

export default AuthLayout;
