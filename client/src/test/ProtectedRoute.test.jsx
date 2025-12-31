import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../app/ProtectedRoute";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockUseAuth = vi.fn();

vi.mock("../app/AuthContext", async () => {
  const actual = await vi.importActual("../app/AuthContext");
  return {
    ...actual,
    useAuth: () => mockUseAuth(),
  };
});

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to login if user is null", () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: false });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/login" element={<h1>Login Page</h1>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<h1>Secret Content</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Secret Content")).not.toBeInTheDocument();
  });

  it("renders content if user exists", () => {
    mockUseAuth.mockReturnValue({
      user: { email: "test@test.com" },
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<h1>Secret Content</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("Secret Content")).toBeInTheDocument();
  });
});
