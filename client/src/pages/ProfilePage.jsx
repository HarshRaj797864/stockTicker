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

  const userId = user?.userId || user?.id || user?._id || "N/A";

  return (
    <div className="relative p-4 md:p-6 max-w-3xl mx-auto min-h-screen overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-[#5eedbe]/5 blur-[80px] md:blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-[#ffaa00]/5 blur-[80px] md:blur-[120px] rounded-full -z-10 pointer-events-none" />

      <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-8 md:mb-10 text-center md:text-left">
        Account{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5eedbe] to-[#ffaa00]">
          Settings
        </span>
      </h1>

      <div className="bg-[#385a94]/10 border border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur-xl mb-6 md:mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5eedbe] to-[#ffaa00] opacity-40" />

        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-8 md:mb-10">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#5eedbe] to-[#ffaa00] rounded-full flex items-center justify-center text-black text-3xl md:text-4xl font-black shadow-lg shadow-[#5eedbe]/20 shrink-0">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
          </div>

          <div className="text-center md:text-left overflow-hidden w-full">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight truncate">
              {user?.name || "Premium Member"}
            </h2>
            <p className="text-gray-400 font-medium text-sm md:text-base truncate">
              {user?.email}
            </p>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 px-3 py-1 bg-black/30 rounded-full inline-block max-w-full truncate">
              User ID: {userId}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 md:pt-8">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 md:mb-6 text-center md:text-left">
            Investor Activity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="p-5 md:p-6 bg-black/20 rounded-3xl border border-white/5 group hover:border-[#5eedbe]/30 transition-all text-center md:text-left">
              <span className="block text-3xl md:text-4xl font-black text-[#5eedbe] mb-1">
                {isLoading ? "..." : watchlists?.length || 0}
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Watchlists Created
              </span>
            </div>
            <div className="p-5 md:p-6 bg-black/20 rounded-3xl border border-white/5 group hover:border-[#ffaa00]/30 transition-all text-center md:text-left">
              <span className="block text-3xl md:text-4xl font-black text-[#ffaa00] mb-1">
                {isLoading ? "..." : totalStocks}
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Stocks Tracked
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#385a94]/10 border border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
        <h3 className="text-lg md:text-xl font-black text-white mb-2 text-center md:text-left">
          Session Management
        </h3>
        <p className="text-gray-400 text-sm mb-6 md:mb-8 font-medium text-center md:text-left">
          Securely sign out of your StockTicker Pro session.
        </p>

        <button
          onClick={logout}
          className="cursor-pointer w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 bg-transparent text-red-400 border-2 border-red-500/20 rounded-full hover:bg-red-500 hover:text-white font-black uppercase text-xs tracking-widest transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:border-red-500"
        >
          Terminate Session
        </button>
      </div>
    </div>
  );
};
