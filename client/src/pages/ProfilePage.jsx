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
    <div className="relative p-6 max-w-3xl mx-auto min-h-screen">
      {/* Background Glows with your specific colors */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#5eedbe]/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-[#ffaa00]/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <h1 className="text-4xl font-black text-white tracking-tighter mb-10">
        Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5eedbe] to-[#ffaa00]">Settings</span>
      </h1>

      {/* Profile Info Card - Translucent Interior */}
      <div className="bg-[#385a94]/10 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl mb-8 relative overflow-hidden">
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5eedbe] to-[#ffaa00] opacity-40" />

        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-[#5eedbe] to-[#ffaa00] rounded-full flex items-center justify-center text-black text-4xl font-black shadow-lg shadow-[#5eedbe]/20">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-white tracking-tight">{user?.name || "Premium Member"}</h2>
            <p className="text-gray-400 font-medium">{user?.email}</p>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-2 px-3 py-1 bg-black/30 rounded-full inline-block">
              User ID: {user?.userId}
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-6">
            Investor Activity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-black/20 rounded-3xl border border-white/5 group hover:border-[#5eedbe]/30 transition-all">
              <span className="block text-4xl font-black text-[#5eedbe] mb-1">
                {isLoading ? "..." : watchlists?.length || 0}
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Watchlists Created</span>
            </div>
            <div className="p-6 bg-black/20 rounded-3xl border border-white/5 group hover:border-[#ffaa00]/30 transition-all">
              <span className="block text-4xl font-black text-[#ffaa00] mb-1">
                {isLoading ? "..." : totalStocks}
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Stocks Tracked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Session Management Card */}
      <div className="bg-[#385a94]/10 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl relative overflow-hidden">
        <h3 className="text-xl font-black text-white mb-2">Session Management</h3>
        <p className="text-gray-400 text-sm mb-8 font-medium">
          Securely sign out of your StockTicker Pro session.
        </p>
        
        <button
          onClick={logout}
          className="cursor-pointer w-full sm:w-auto px-10 py-4 bg-transparent text-red-400 border-2 border-red-500/20 rounded-full hover:bg-red-500 hover:text-white font-black uppercase text-xs tracking-widest transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:border-red-500"
        >
          Terminate Session
        </button>
      </div>
    </div>
  );
};
