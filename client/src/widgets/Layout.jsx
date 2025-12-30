// define frame
import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="py-6 text-center text-gray-400 text-sm border-t">
        © 2025 StockTicker Pro
      </footer>
    </div>
  );
};
