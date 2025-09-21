import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "../features/home/Home";
import { RouterProvider } from "react-router";
import PageNotFound from "../shared/pages/PageNotFound";
import Error from "../shared/pages/Error";
import Blog from "@/shared/pages/Blog";
import Album from "@/features/estates/Album";
import Estates from "@/features/estates/Estates";
import EstateDetails from "@/features/estates/EstateDetails";
import SignIn from "@/features/auth/SignIn";
import SignUp from "@/features/auth/SignUp";
import Dashboard from "@/features/dashboard/Dashboard";
import HomePage from "@/features/dashboard/pages/HomePage";
import EstatesDashboard from "@/features/dashboard/pages/EstatesDashboard";
import UserProfileDashboard from "@/features/dashboard/pages/UserProfileDashboard";
import ReservationsDashboard from "@/features/dashboard/pages/ReservationsDashboard";
import ReviewsDashboard from "@/features/dashboard/pages/ReviewsDashboard";
import EditEstatePage from "@/features/dashboard/components/EditEstate";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { srLatn } from "date-fns/locale";
import AuthLayout from "./layouts/AuthLayout";
import { useAuthInit } from "./hook/useAuthInit";
import VerifyAccountPage from "@/features/auth/VerifyAccount";
import ResetPassword from "@/features/auth/ResetPassword";
import SignedInLayout from "./layouts/SignedInLayout";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/estates/:type",
        element: <Estates />,
      },
      {
        path: "/estate/:id",
        element: <EstateDetails />,
      },

      // {
      //   path: "/businesses",
      //   element: <Estates />,
      // },
    ],
  },
  {
    path: "/blog",
    errorElement: <Error />,
    element: <Blog />,
  },
  {
    path: "/estate/:id/album",
    errorElement: <Error />,
    element: <Album />,
  },
  {
    element: <SignedInLayout />,
    children: [
      {
        path: "/sign-in",
        errorElement: <Error />,
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        errorElement: <Error />,
        element: <SignUp />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
  },

  {
    element: <AuthLayout />,
    errorElement: <Error />,
    children: [
      {
        element: <Dashboard />, // layout (sidebar, navbar, outlet)
        path: "/dashboard",
        children: [
          { index: true, element: <HomePage /> },
          { path: "your-estates", element: <EstatesDashboard /> },
          { path: "your-estates/:estateId", element: <EditEstatePage /> },
          { path: "profile", element: <UserProfileDashboard /> },
          { path: "reservations", element: <ReservationsDashboard /> },
          { path: "reviews", element: <ReviewsDashboard /> },
        ],
      },
      {
        element: <VerifyAccountPage />,
        path: "/verify-account",
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

const AppRoutes: React.FC = () => {
  useAuthInit(); //kako se ne bi resetovao redux svaki put kada se manuelno osvjezi stranica

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={srLatn}>
      <RouterProvider router={router}></RouterProvider>
    </LocalizationProvider>
  );
};

export default AppRoutes;
