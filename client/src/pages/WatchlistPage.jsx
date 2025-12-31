import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../shared/lib/api";
import { useRemoveFromWatchlist } from "../features/watchlist/api/mutations";

const useCreateWatchlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name) => {
      const res = await api.post("/watchlists", { name });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["watchlists"]);
    },
  });
};

const useDeleteWatchlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/watchlists/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["watchlists"]);
    },
  });
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

const WatchlistRow = ({ item, watchlistId }) => {
  const stock = item.stock;
  const removeMutation = useRemoveFromWatchlist();

  const initial = stock.initialPrice || stock.currentPrice;
  const current = stock.currentPrice || 0;
  const change = initial !== 0 ? ((current - initial) / initial) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <tr className="border-b last:border-0 hover:bg-gray-50 transition-colors">
      <td className="py-4 px-2 font-medium">{stock.symbol}</td>
      <td className="py-4 px-2">${current.toFixed(2)}</td>
      <td
        className={`py-4 px-2 font-bold ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        {isPositive ? "+" : ""}
        {change.toFixed(2)}%
      </td>
      <td className="py-4 px-2 text-gray-400 text-sm">
        {new Date(item.addedAt).toLocaleDateString()}
      </td>
      <td className="py-4 px-2 text-right">
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
          {removeMutation.isPending ? "..." : "Remove"}
        </button>
      </td>
    </tr>
  );
};

export const WatchlistPage = () => {
  const { data: watchlists, isLoading, error } = useWatchlists();

  const createMutation = useCreateWatchlist();
  const deleteMutation = useDeleteWatchlist();

  const [newListName, setNewListName] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    createMutation.mutate(newListName, {
      onSuccess: () => setNewListName(""),
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this watchlist?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading)
    return <div className="text-center p-10">Loading portfolios...</div>;

  if (error)
    return (
      <div className="text-center p-10 text-red-500 bg-red-50 border border-red-200 rounded mx-6">
        <h3 className="font-bold text-xl mb-2">Failed to load watchlists</h3>
        <p className="font-mono text-sm mb-4">{error.message}</p>
      </div>
    );

  return (
    <div className="p-10 max-w-7xl mx-auto min-h-screen bg-gray-50/50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Watchlists</h1>

        <form onSubmit={handleCreate} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="New List Name..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
          />
          <button
            type="submit"
            disabled={createMutation.isPending || !newListName.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {createMutation.isPending ? "Creating..." : "Create List"}
          </button>
        </form>
      </div>

      {watchlists?.length > 0 ? (
        <div className="space-y-8">
          {watchlists.map((list) => (
            <div
              key={list.id}
              className="border rounded-lg p-6 bg-white shadow-sm relative group"
            >
              <div className="flex justify-between items-center mb-4 border-b pb-4">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {list.name}
                  </h2>
                  <span className="text-gray-500 text-sm">
                    {list.stocks?.length || 0} stocks
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(list.id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded text-sm font-medium transition-colors border border-transparent hover:border-red-200"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete List"}
                </button>
              </div>

              {list.stocks && list.stocks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead className="text-gray-500 text-sm uppercase tracking-wider">
                      <tr>
                        <th className="py-2 font-semibold">Symbol</th>
                        <th className="py-2 font-semibold">Price</th>
                        <th className="py-2 font-semibold">Change</th>
                        <th className="py-2 font-semibold">Added At</th>
                        <th className="py-2 text-right font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
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
                <div className="text-gray-400 italic py-8 bg-gray-50 rounded text-center border border-dashed">
                  No stocks in this list yet. Go to the Dashboard to add some!
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded border border-dashed">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Watchlists Found
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first watchlist above to get started.
          </p>
        </div>
      )}
    </div>
  );
};
