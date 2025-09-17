import { Navigate, Outlet, useNavigate } from "react-router";
import { useAppSelector } from "../store/hooks";
import { selectIsAuthenticated } from "@/features/auth/authSlice";

function AuthLayout() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to="/sign-up" replace />;

  return <Outlet />;
}

export default AuthLayout;
