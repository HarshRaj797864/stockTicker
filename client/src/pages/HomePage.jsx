import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../shared/ui/Button"; 

export const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
        Master the Market with <span className="text-blue-600">StockTicker</span>
      </h1>
      <p className="text-xl text-gray-500 max-w-2xl">
        Real-time tracking, smart watchlists, and powerful analytics for the modern investor.
      </p>
      <div className="flex gap-4">
        <Link to="/register">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link to="/login">
          <Button variant="outline" size="lg">Login</Button>
        </Link>
      </div>
    </div>
  );
};
