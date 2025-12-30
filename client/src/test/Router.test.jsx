import { render, screen } from "@testing-library/react";
import { AppRouter } from "../app/Router.jsx";
import { describe, it, expect } from "vitest";

describe("AppRouter", () => {
  it("renders HomePage at the root route", async () => {
    render(<AppRouter />);

    expect(
      await screen.findByText(/Welcome to StockTicker/i)
    ).toBeInTheDocument();
  });

  it("renders LoginPage at /login", async () => {
    render(<AppRouter />);
  });
});
