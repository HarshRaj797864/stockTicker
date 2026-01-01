import { render, screen } from "@testing-library/react";
import { AppRouter } from "../app/Router.jsx";
import { describe, it, expect } from "vitest";
import { AuthProvider } from "../app/AuthContext.jsx";

describe("AppRouter", () => {
  it("renders HomePage at the root route", async () => {
    render(
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    );

    expect(
      await screen.findByText(/Master the market/i)
    ).toBeInTheDocument();
  });

  it("renders LoginPage at /login", async () => {
    render(<AppRouter />);
  });
});
