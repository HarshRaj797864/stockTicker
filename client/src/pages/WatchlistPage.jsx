import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../shared/lib/api";

const useWatchlists = () => {
  return useQuery({
    queryKey: ["watchlists"],
    queryFn: async () => {
      
      const res = await api.get("/watchlists"); 
      return res.data;
    },
  });
};

export const WatchlistPage = () => {
  const { data: watchlists, isLoading, error } = useWatchlists();

  if (isLoading) return <div className="text-center p-10">Loading your portfolios...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Failed to load watchlists</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Watchlists</h1>
      
      {watchlists?.length > 0 ? (
        <div className="space-y-8">
          {watchlists.map((list) => (
            <div key={list.id} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{list.name}</h2>
                <span className="text-gray-500 text-sm">{list.stocks?.length || 0} items</span>
              </div>

              {list.stocks && list.stocks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead className="border-b">
                      <tr>
                        <th className="py-2">Symbol</th>
                        <th className="py-2">Price</th>
                        <th className="py-2">Change</th>
                        <th className="py-2">Added At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.stocks.map((item) => {
                        const stock = item.stock; 
                        const change = ((stock.currentPrice - stock.initialPrice) / stock.initialPrice) * 100;
                        const isPositive = change >= 0;

                        return (
                          <tr key={stock.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="py-3 font-medium">{stock.symbol}</td>
                            <td className="py-3">${stock.currentPrice.toFixed(2)}</td>
                            <td className={`py-3 font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                              {isPositive ? '+' : ''}{change.toFixed(2)}%
                            </td>
                            <td className="py-3 text-gray-400 text-sm">
                              {new Date(item.addedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-400 italic py-4 bg-gray-50 rounded text-center">
                  No stocks in this list yet. Go to the dashboard to add some!
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">You don't have any watchlists yet.</p>
        </div>
      )}
    </div>
  );
};
