import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Layout = () => {
  return (
    
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-pink-500 selection:text-white">
      <Navbar /> 
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 relative">
        <Outlet /> 
      </main>

      
      <footer className="py-8 text-center text-gray-600 text-sm">
        © 2025 StockTicker
      </footer>
    </div>
  );
};
