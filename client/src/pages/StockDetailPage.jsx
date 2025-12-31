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
  
  const { data: history, isLoading: isHistoryLoading } = useStockHistory(ticker);

  if (isStockLoading) return <div className="text-center p-10">Loading details...</div>;
  if (!stock) return <div className="text-center p-10 text-red-500">Stock not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline flex items-center gap-1"
      >
        &larr; Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-1 text-gray-900">{stock.symbol}</h1>
            <h2 className="text-xl text-gray-500 font-medium">{stock.companyName}</h2>
          </div>
          <div className="text-right">
             <p className="text-4xl font-bold text-gray-900">${stock.currentPrice?.toFixed(2)}</p>
             <div className="mt-4">
                <AddToWatchlistButton ticker={stock.symbol} />
             </div>
          </div>
        </div>

        
        <div className="mb-8">
          {isHistoryLoading ? (
            <div className="h-96 flex items-center justify-center bg-gray-50 rounded animate-pulse">
              Loading Chart Data...
            </div>
          ) : (
            <StockPriceChart data={history} />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
           <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
             <span className="block text-gray-500 mb-1">Initial Price (Prev Close)</span>
             <span className="font-semibold text-xl text-gray-800">${stock.initialPrice?.toFixed(2)}</span>
           </div>
           
        </div>
      </div>
    </div>
  );
};
