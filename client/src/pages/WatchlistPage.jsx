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
    <div className="flex flex-col md:grid md:grid-cols-5 items-start md:items-center p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors gap-3 md:gap-0">
      <div className="w-full md:w-auto flex justify-between items-center md:block">
        <span className="font-bold text-white text-lg md:text-base">
          {stock.symbol}
        </span>

        <span className="md:hidden font-mono text-gray-300">
          ₹{current.toFixed(2)}
        </span>
      </div>

      <div className="hidden md:block font-mono text-gray-300">
        ₹{current.toFixed(2)}
      </div>

      <div className="w-full md:w-auto flex justify-between md:block">
        <span className="md:hidden text-gray-500 text-xs font-bold uppercase">
          Change
        </span>
        <span
          className={`font-black ${
            isPositive ? "text-[#A3FFEA]" : "text-red-400"
          }`}
        >
          {isPositive ? "+" : ""}
          {change.toFixed(2)}%
        </span>
      </div>

      <div className="w-full md:w-auto flex justify-between md:block">
        <span className="md:hidden text-gray-500 text-xs font-bold uppercase">
          Added
        </span>
        <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
          {new Date(item.addedAt).toLocaleDateString()}
        </span>
      </div>

      <div className="w-full md:w-auto flex justify-end mt-2 md:mt-0">
        <button
          onClick={() =>
            removeMutation.mutate({
              watchlistId: watchlistId,
              ticker: stock.symbol,
            })
          }
          disabled={removeMutation.isPending}
          className="w-full md:w-auto cursor-pointer text-red-400 hover:text-red-300 text-xs font-black uppercase tracking-widest px-4 py-2 md:py-1.5 border border-red-400/20 rounded-full hover:bg-red-400/10 transition-all disabled:opacity-50 flex justify-center items-center"
        >
          {removeMutation.isPending ? "..." : "Remove"}
        </button>
      </div>
    </div>
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
    return (
      <div className="text-center p-20 text-gray-400 animate-pulse font-bold tracking-widest uppercase">
        Loading portfolios...
      </div>
    );

  if (error)
    return (
      <div className="text-center p-10 bg-red-500/5 border border-red-500/20 rounded-3xl mx-6 mt-10">
        <h3 className="font-black text-red-400 text-xl mb-2 tracking-tight">
          Failed to load watchlists
        </h3>
        <p className="font-mono text-xs text-red-300/60 uppercase">
          {error.message}
        </p>
      </div>
    );

  return (
    <div className="relative p-4 md:p-10 max-w-7xl mx-auto min-h-screen overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#ffd500]/5 blur-[80px] md:blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#e6b3ff]/5 blur-[80px] md:blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="flex flex-col lg:flex-row justify-between items-center mb-8 md:mb-12 gap-6 md:gap-8">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter text-center md:text-left">
          My{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd500] to-[#e6b3ff]">
            Watchlists
          </span>
        </h1>

        <form
          onSubmit={handleCreate}
          className="flex flex-col md:flex-row gap-3 w-full lg:w-auto"
        >
          <input
            type="text"
            placeholder="New List Name..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[#e6b3ff]/40 w-full md:w-72 font-medium transition-all"
          />
          <button
            type="submit"
            disabled={createMutation.isPending || !newListName.trim()}
            className="cursor-pointer bg-gradient-to-r from-[#ffd500] to-[#e6b3ff] text-black font-black px-8 py-3 rounded-full hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 transition-all whitespace-nowrap uppercase text-xs tracking-widest shadow-lg shadow-[#ffd500]/10"
          >
            {createMutation.isPending ? "Creating..." : "Create List"}
          </button>
        </form>
      </div>

      {watchlists?.length > 0 ? (
        <div className="space-y-8 md:space-y-12">
          {watchlists.map((list) => (
            <div
              key={list.id}
              className="border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 bg-[#385a94]/10 backdrop-blur-xl relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ffd500] to-[#e6b3ff] opacity-40" />

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-white/10 gap-4 md:gap-0">
                <div className="flex items-baseline gap-4">
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                    {list.name}
                  </h2>
                  <span className="bg-white/5 px-3 py-1 rounded-full text-gray-400 text-[10px] font-black uppercase tracking-widest border border-white/5">
                    {list.stocks?.length || 0} Assets
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(list.id)}
                  disabled={deleteMutation.isPending}
                  className="w-full md:w-auto cursor-pointer text-red-500 hover:text-white hover:bg-red-500/20 px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all border border-red-500/20 text-center"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete List"}
                </button>
              </div>

              {list.stocks && list.stocks.length > 0 ? (
                <div className="flex flex-col">
                  <div className="hidden md:grid grid-cols-5 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 px-2">
                    <div>Symbol</div>
                    <div>Price</div>
                    <div>24h Change</div>
                    <div>Added</div>
                    <div className="text-right">Actions</div>
                  </div>

                  <div className="divide-y divide-white/5">
                    {list.stocks.map((item) => (
                      <WatchlistRow
                        key={item.stock.id}
                        item={item}
                        watchlistId={list.id}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 font-bold italic py-12 bg-black/20 rounded-2xl text-center border border-dashed border-white/5 text-sm md:text-base">
                  Your portfolio is empty. Add stocks from the market overview.
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
          <h3 className="text-2xl font-black text-gray-400 mb-2 uppercase tracking-tighter">
            No Watchlists Found
          </h3>
          <p className="text-gray-600 font-medium px-4">
            Start by creating your first list to track your favorite assets.
          </p>
        </div>
      )}
    </div>
  );
};
