import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "../widgets/Layout";
import { ProtectedRoute } from "./ProtectedRoute";

import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { WatchlistPage } from "../pages/WatchlistPage";
import { StockDetailPage } from "../pages/StockDetailPage";
import { ProfilePage } from "../pages/ProfilePage";

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
          {
            path: "watchlists",
            element: <WatchlistPage />,
          },
          {
            path: "stocks/:ticker",
            element: <StockDetailPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
