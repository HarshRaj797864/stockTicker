import React from "react";
import { useAuth } from "../app/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "../shared/lib/api";

const useWatchlistCount = () => {
  return useQuery({
    queryKey: ["watchlists"],
    queryFn: async () => {
      const res = await api.get("/watchlists");
      return res.data;
    },
  });
};

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { data: watchlists, isLoading } = useWatchlistCount();

  const totalStocks =
    watchlists?.reduce((acc, list) => acc + (list.stocks?.length || 0), 0) || 0;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Account Settings
      </h1>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              User ID: {user?.userId}
            </p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Your Activity
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <span className="block text-3xl font-bold text-blue-600">
                {isLoading ? "-" : watchlists?.length || 0}
              </span>
              <span className="text-sm text-gray-600">Watchlists Created</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <span className="block text-3xl font-bold text-green-600">
                {isLoading ? "-" : totalStocks}
              </span>
              <span className="text-sm text-gray-600">Stocks Tracked</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Session Management</h3>
        <p className="text-gray-600 text-sm mb-4">
          Sign out of your account on this device.
        </p>
        <button
          onClick={logout}
          className="w-full sm:w-auto px-6 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
