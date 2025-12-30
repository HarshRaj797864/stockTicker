import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppRouter } from "./app/Router.jsx";
import { AuthProvider } from "./app/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter/>
    </AuthProvider>
  </StrictMode>
);
