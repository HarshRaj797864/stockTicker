import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouter } from "./app/Router.jsx";
import { AuthProvider } from "./app/AuthContext.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {FaviconGenerator} from "./assets/Svg.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FaviconGenerator/>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter/>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
