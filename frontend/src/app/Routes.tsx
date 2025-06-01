// src/app/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "../features/home/Home";
import { RouterProvider } from "react-router";
import PageNotFound from "../shared/pages/PageNotFound";
import Error from "../shared/pages/Error";
import Blog from "@/shared/pages/Blog";
import Album from "@/shared/pages/Album";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/blog",
    // errorElement: <Error />,
    element: <Blog />,
  },
  {
    path: "/album",
    // errorElement: <Error />,
    element: <Album />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
