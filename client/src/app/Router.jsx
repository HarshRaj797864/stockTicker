import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "../widgets/Layout";

const HomePage = () => (
  <div className="text-2xl font-bold">Welcome to StockTicker Home</div>
);
const LoginPage = () => (
  <div className="text-2xl font-bold">
    <h1>Login</h1> 
    <p>Please Login to Continue</p>
  </div>
);

export const AppRouter = () => {
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
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
