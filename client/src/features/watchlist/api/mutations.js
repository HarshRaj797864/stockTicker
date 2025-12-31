import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../shared/lib/api";

export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ watchlistId, ticker }) => {
      return api.post(`/watchlists/${watchlistId}/stocks`, { ticker });
    },

    onMutate: async ({ watchlistId, ticker }) => {
      await queryClient.cancelQueries(["watchlists"]);

      const previousWatchlists = queryClient.getQueryData(["watchlists"]);

      queryClient.setQueryData(["watchlists"], (old) => {
        if (!old) return [];
        return old.map((list) => {
          if (list.id === watchlistId) {
            return {
              ...list,
              stocks: [
                ...list.stocks,
                { stock: { symbol: ticker, id: "temp-id" } },
              ],
            };
          }
          return list;
        });
      });

      return { previousWatchlists };
    },

    onError: (err, newTodo, context) => {
      queryClient.setQueryData(["watchlists"], context.previousWatchlists);
      alert("Failed to add stock. Please try again.");
    },

    onSettled: () => {
      queryClient.invalidateQueries(["watchlists"]);
    },
  });
};

export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ watchlistId, ticker }) => {
      return api.delete(`/watchlists/${watchlistId}/stocks/${ticker}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['watchlists']);
    },
  });
};
