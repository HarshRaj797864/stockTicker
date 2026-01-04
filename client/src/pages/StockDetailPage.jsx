import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../shared/lib/api";
import { AddToWatchlistButton } from "../features/watchlist/ui/AddToWatchlistButton";
import { StockPriceChart } from "../features/stocks/ui/StockPriceChart";

const useStock = (ticker) => {
  return useQuery({
    queryKey: ["stocks", ticker],
    queryFn: async () => {
      const res = await api.get(`/stocks/${ticker}`);
      return res.data;
    },
    enabled: !!ticker,
  });
};

const useStockHistory = (ticker) => {
  return useQuery({
    queryKey: ["stocks", ticker, "history"],
    queryFn: async () => {
      const res = await api.get(`/stocks/${ticker}/history`);
      return res.data;
    },
    enabled: !!ticker,
    staleTime: 1000 * 60 * 60,
  });
};

export const StockDetailPage = () => {
  const { ticker } = useParams();
  const navigate = useNavigate();

  const { data: stock, isLoading: isStockLoading } = useStock(ticker);
  const { data: history, isLoading: isHistoryLoading } =
    useStockHistory(ticker);

  if (isStockLoading)
    return (
      <div className="text-center p-10 text-gray-400 animate-pulse">
        Loading details...
      </div>
    );
  if (!stock)
    return <div className="text-center p-10 text-red-500">Stock not found</div>;

  return (
    <div className="relative p-4 md:p-6 max-w-5xl mx-auto space-y-6 overflow-hidden min-h-screen">
      <div className="absolute top-0 right-0 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-blue-600/10 blur-[80px] md:blur-[100px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-pink-600/10 blur-[80px] md:blur-[100px] rounded-full -z-10 pointer-events-none" />

      <button
        onClick={() => navigate(-1)}
        className="group mb-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-bold text-xs md:text-sm tracking-widest uppercase"
      >
        <span className="group-hover:-translate-x-1 transition-transform">
          &larr;
        </span>{" "}
        Back to Dashboard
      </button>

      <div className="bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-3xl p-5 md:p-8 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-400 opacity-50" />

        <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-1 md:mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500 tracking-tighter break-all">
              {stock.symbol}
            </h1>
            <h2 className="text-base md:text-xl text-gray-400 font-semibold tracking-wide">
              {stock.companyName}
            </h2>
            <div className="mt-3 md:mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A3FFEA]/10 border border-[#A3FFEA]/20">
              <span className="w-2 h-2 rounded-full bg-[#A3FFEA] animate-pulse"></span>
              <span className="text-[#A3FFEA] font-bold text-[10px] md:text-xs uppercase tracking-tighter">
                Live Market Data
              </span>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col items-start md:items-end mt-2 md:mt-0">
            <p className="text-4xl md:text-5xl font-mono font-extrabold text-white tracking-tighter">
              ₹{stock.currentPrice?.toFixed(2)}
            </p>
            <div className="mt-4 md:mt-6 w-full md:w-auto">
              <AddToWatchlistButton ticker={stock.symbol} />
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-10 mb-6 md:mb-8 rounded-2xl bg-black/40 border border-white/5 p-2 md:p-4">
          {isHistoryLoading ? (
            <div className="h-64 md:h-96 flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest animate-pulse text-xs md:text-base">
              Generating Analysis...
            </div>
          ) : (
            <div className="h-64 md:h-96 w-full">
              <StockPriceChart data={history} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mt-8">
          <div className="p-5 md:p-6 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
            <span className="block text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-2">
              Prev Close
            </span>
            <span className="font-mono text-xl md:text-2xl text-white">
              ₹{stock.initialPrice?.toFixed(2)}
            </span>
          </div>

          <div className="p-5 md:p-6 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
            <span className="block text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-2">
              Day Change
            </span>
            <span
              className={`font-mono text-xl md:text-2xl ${
                stock.currentPrice >= stock.initialPrice
                  ? "text-[#A3FFEA]"
                  : "text-red-400"
              }`}
            >
              {(stock.currentPrice - stock.initialPrice).toFixed(2)}
            </span>
          </div>

          <div className="p-5 md:p-6 bg-gradient-to-br from-pink-500/10 to-blue-500/10 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all sm:col-span-2 lg:col-span-1">
            <span className="block text-pink-400 font-bold uppercase tracking-widest text-[10px] mb-2">
              Volatility Status
            </span>
            <span className="font-bold text-lg md:text-xl text-white tracking-tight">
              STABLE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
