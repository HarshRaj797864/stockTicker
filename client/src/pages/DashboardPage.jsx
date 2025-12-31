import React, { useEffect, useState } from "react";
import { api } from "../shared/lib/api"; 


export const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
      <div className="p-8 bg-white rounded-lg shadow border border-gray-200 text-center">
        <p className="text-gray-500">Loading market data...</p>
        
      </div>
    </div>
  );
};
