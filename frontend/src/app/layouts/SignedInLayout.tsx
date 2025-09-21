import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/app/store/hooks";
import { selectIsAuthenticated } from "@/features/auth/authSlice";
import { CircularProgress, Backdrop } from "@mui/material";

function SignedInLayout() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { status } = useAppSelector((s) => s.auth);

  // cekaj dok auth init ne završi (da se ne desi prerani redirect)
  if (status === "loading") {
    return (
      <Backdrop
        open
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default SignedInLayout;
