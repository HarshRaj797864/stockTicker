import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../shared/lib/api";
import { useRemoveFromWatchlist } from "../features/watchlist/api/mutations";


const WatchlistRow = ({ item, watchlistId }) => {
  const stock = item.stock;
  const removeMutation = useRemoveFromWatchlist(); 

  
  const initial = stock.initialPrice || stock.currentPrice; 
  const current = stock.currentPrice || 0;
  
  const change = initial !== 0 
    ? ((current - initial) / initial) * 100 
    : 0;
    
  const isPositive = change >= 0;

  return (
    <tr className="border-b last:border-0 hover:bg-gray-50">
      <td className="py-3 font-medium">{stock.symbol}</td>
      <td className="py-3">${current.toFixed(2)}</td>
      <td className={`py-3 font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? "+" : ""}
        {change.toFixed(2)}%
      </td>
      <td className="py-3 text-gray-400 text-sm">
        {new Date(item.addedAt).toLocaleDateString()}
      </td>
      <td className="py-3 text-right">
        <button
          onClick={() =>
            removeMutation.mutate({
              watchlistId: watchlistId,
              ticker: stock.symbol,
            })
          }
          disabled={removeMutation.isPending}
          className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 border border-red-200 rounded hover:bg-red-50 transition disabled:opacity-50"
        >
          {removeMutation.isPending ? "Removing..." : "Remove"}
        </button>
      </td>
    </tr>
  );
};

const useWatchlists = () => {
  return useQuery({
    queryKey: ["watchlists"],
    queryFn: async () => {
      const res = await api.get("/watchlists");
      return res.data;
    },
    retry: 1,
  });
};

export const WatchlistPage = () => {
  const { data: watchlists, isLoading, error } = useWatchlists();

  if (isLoading) return <div className="text-center p-10">Loading portfolios...</div>;

  if (error)
    return (
      <div className="text-center p-10 text-red-500 bg-red-50 border border-red-200 rounded mx-6">
        <h3 className="font-bold text-xl mb-2">Failed to load watchlists</h3>
        <p className="font-mono text-sm mb-4">{error.message}</p>
        
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Watchlists</h1>

      {watchlists?.length > 0 ? (
        <div className="space-y-8">
          {watchlists.map((list) => (
            <div key={list.id} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{list.name}</h2>
                <span className="text-gray-500 text-sm">
                  {list.stocks?.length || 0} items
                </span>
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
                        <th className="py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      
                      {list.stocks.map((item) => (
                        <WatchlistRow 
                           key={item.stock.id} 
                           item={item} 
                           watchlistId={list.id} 
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-400 italic py-4 bg-gray-50 rounded text-center">
                  No stocks in this list yet.
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
