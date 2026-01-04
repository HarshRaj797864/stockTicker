import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../app/AuthContext";
import { Github, Menu, X } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLinkClick = () => setIsOpen(false);

  const navLinkClass = ({ isActive }) =>
    `transition-all duration-200 font-medium px-4 py-2 rounded-full cursor-pointer ${
      isActive
        ? "text-white !bg-white/10"
        : "text-white !bg-transparent hover:!bg-white/10"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block text-center text-lg font-medium py-3 rounded-xl transition-all ${
      isActive
        ? "text-[#A3FFEA] bg-white/5"
        : "text-gray-300 hover:text-white hover:bg-white/5"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 group cursor-pointer z-50"
          onClick={handleLinkClick}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/20">
            S
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            StockTicker
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {!user && (
            <a
              href="https://github.com/HarshRaj797864/stockTicker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-400 hover:!bg-pink-500/10 !bg-transparent p-2 rounded-full transition cursor-pointer"
            >
              <Github className="w-6 h-6" />
            </a>
          )}

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

              <div className="h-6 w-px bg-white/20 mx-2"></div>

              <Link
                to="/profile"
                className="text-sm font-medium text-white hover:!bg-white/10 !bg-transparent px-4 py-2 rounded-full transition cursor-pointer"
              >
                Hi, {user.name || "Trader"}
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

        <button
          onClick={toggleMenu}
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50 cursor-pointer"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-5">
          <NavLink to="/" className={mobileLinkClass} onClick={handleLinkClick}>
            Home
          </NavLink>

          {!user && (
            <a
              href="https://github.com/HarshRaj797864/stockTicker"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-pink-400 py-3 font-medium"
            >
              GitHub Repo
            </a>
          )}

          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={mobileLinkClass}
                onClick={handleLinkClick}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/watchlists"
                className={mobileLinkClass}
                onClick={handleLinkClick}
              >
                Watchlists
              </NavLink>

              <NavLink
                to="/profile"
                className={mobileLinkClass}
                onClick={handleLinkClick}
              >
                Profile ({user.name || "User"})
              </NavLink>

              <div className="h-px w-full bg-white/10 my-2"></div>

              <button
                onClick={() => {
                  logout();
                  handleLinkClick();
                }}
                className="w-full text-center text-red-400 font-bold py-3 uppercase tracking-widest hover:bg-red-500/10 rounded-xl transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={mobileLinkClass}
              onClick={handleLinkClick}
            >
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};
