import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../app/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `transition-colors duration-200 ${
      isActive
        ? "text-primary font-semibold border-b-2 border-primary"
        : "text-base-content/70 hover:text-primary"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-base-100 border-b border-base-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="text-xl font-bold text-base-content tracking-tight">
            StockTicker
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          {user ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>

              <NavLink to="/watchlists" className={navLinkClass}>
                Watchlists
              </NavLink>

              <Link
                to="/profile"
                className="text-sm text-base-content/80 hidden md:block border-l pl-6 ml-2 hover:text-primary transition"
              >
                Hi, {user.name || user.email}
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};
