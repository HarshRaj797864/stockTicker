import React, { useState } from "react";
import { useStocks } from "../features/stocks/api/queries";
import { AddToWatchlistButton } from "../features/watchlist/ui/AddToWatchlistButton";
import { Link } from "react-router-dom";
import { SearchBar } from "../shared/ui/SearchBar";

export const DashboardPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const {
    data: stockResponse,
    isLoading,
    error,
    isPlaceholderData,
  } = useStocks({ page, search });

  const stocks = stockResponse?.data || [];
  const meta = stockResponse?.meta || { totalPages: 1 };

  const handleSearch = (text) => {
    setSearch(text);
    setPage(1);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-10 text-gray-400 animate-pulse font-bold tracking-widest uppercase">
          Loading market data...
        </div>
      </div>
    );
  
  if (error)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-10 text-red-400 font-bold border border-red-500/20 bg-red-500/5 rounded-2xl">
          Failed to load stocks. Please check your connection.
        </div>
      </div>
    );

  return (
    <div className="relative p-6 min-h-screen">
      {/* BACKGROUND AMBIENT GLOWS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-pink-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-400">Overview</span>
        </h1>

        <div className="w-full md:w-auto">
          <SearchBar value={search} onChange={handleSearch} />
        </div>
      </div>

      {/* STOCKS GRID */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {stocks.length > 0 ? (
          stocks.map((stock) => {
            const change =
              ((stock.currentPrice - stock.initialPrice) / stock.initialPrice) * 100;
            const isPositive = change >= 0;

            return (
              <div
                key={stock.id}
                className="group p-6 border border-white/10 rounded-3xl transition-all bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 relative overflow-hidden"
              >
                {/* Hover Gradient Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-400 opacity-0 group-hover:opacity-40 transition-opacity" />

                <div className="flex justify-between items-start">
                  <Link
                    to={`/stocks/${stock.symbol}`}
                    className="flex-1 group-hover:translate-x-1 transition-transform"
                  >
                    <div>
                      <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
                        {stock.symbol}
                      </h2>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
                        {stock.companyName}
                      </p>
                    </div>
                  </Link>

                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black shadow-sm ${
                        isPositive
                          ? "bg-[#A3FFEA]/10 text-[#A3FFEA] border border-[#A3FFEA]/20"
                          : "bg-red-400/10 text-red-400 border border-red-400/20"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {change.toFixed(2)}%
                    </span>

                    <AddToWatchlistButton ticker={stock.symbol} />
                  </div>
                </div>

                <Link to={`/stocks/${stock.symbol}`} className="block mt-6">
                  <p className="text-3xl font-mono font-black text-white tracking-tighter">
                    ₹{stock.currentPrice.toFixed(2)}
                  </p>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">
                    Prev: ₹{stock.initialPrice.toFixed(2)}
                  </p>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-dashed border-gray-800">
            <p className="text-gray-500 font-medium italic text-lg">
              No assets found matching "{search}"
            </p>
          </div>
        )}
      </div>

      {/* SYMMETRICAL GRADIENT PAGINATION */}
      <div className="flex justify-center items-center gap-6 pb-10">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          className="cursor-pointer px-8 py-2 bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500 text-white font-black rounded-full disabled:from-gray-800 disabled:to-gray-900 disabled:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-all text-sm uppercase tracking-widest shadow-lg shadow-blue-500/10"
        >
          Previous
        </button>

        <div className="px-4 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
          <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">
            {page} <span className="text-gray-700 mx-1">/</span> {meta.totalPages || 1}
          </span>
        </div>

        <button
          onClick={() => {
            if (!isPlaceholderData && page < meta.totalPages) {
              setPage((old) => old + 1);
            }
          }}
          disabled={isPlaceholderData || page >= meta.totalPages}
          className="cursor-pointer px-8 py-2 bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500 text-white font-black rounded-full disabled:from-gray-800 disabled:to-gray-900 disabled:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-all text-sm uppercase tracking-widest shadow-lg shadow-pink-500/20"
        >
          Next
        </button>
      </div>
    </div>
  );
};
