import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../app/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `transition-all duration-200 font-medium px-4 py-2 rounded-full cursor-pointer ${
      isActive
        ? "text-white !bg-white/10"
        : "text-white !bg-transparent hover:!bg-white/10"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/20">
            S
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            StockTicker
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
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

              <div className="h-6 w-px bg-white/20 mx-2 hidden md:block"></div>

              <Link
                to="/profile"
                className="text-sm font-medium text-white hidden md:block hover:!bg-white/10 !bg-transparent px-4 py-2 rounded-full transition cursor-pointer"
              >
                Hi, {user.name || user.email}
              </Link>

              <button
                onClick={logout}
                className="cursor-pointer text-sm font-medium text-red-500 hover:!bg-red-500/10 hover:text-red-400 !bg-transparent px-4 py-2 rounded-full transition-colors"
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
