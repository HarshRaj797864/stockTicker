import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../shared/lib/api";
import { AddToWatchlistButton } from "../features/watchlist/ui/AddToWatchlistButton";


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

export const StockDetailPage = () => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const { data: stock, isLoading, error } = useStock(ticker);

  if (isLoading) return <div className="text-center p-10">Loading details...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Stock not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        &larr; Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{stock.symbol}</h1>
            <h2 className="text-xl text-gray-500">{stock.companyName}</h2>
          </div>
          <div className="text-right">
             <p className="text-3xl font-bold">${stock.currentPrice?.toFixed(2)}</p>
             <AddToWatchlistButton ticker={stock.symbol} />
          </div>
        </div>

        
        <div className="h-64 bg-gray-50 rounded border flex items-center justify-center mb-8">
          <span className="text-gray-400">Chart Area (Coming Soon)</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
           <div className="p-4 bg-gray-50 rounded">
             <span className="block text-gray-500">Initial Price (Prev Close)</span>
             <span className="font-medium text-lg">${stock.initialPrice?.toFixed(2)}</span>
           </div>
           
        </div>
      </div>
    </div>
  );
};
