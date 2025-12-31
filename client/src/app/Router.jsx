import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "../widgets/Layout";
import { ProtectedRoute } from "./ProtectedRoute";

import { HomePage } from "../pages/HomePage/ui/HomePage";
import { LoginPage } from "../pages/LoginPage/ui/LoginPage";
import { RegisterPage } from "../pages/RegisterPage/ui/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage/ui/DashboardPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
        ],
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
