import { useQuery, keepPreviousData } from "@tanstack/react-query"; 
import { api } from "../../../shared/lib/api";

export const useStocks = ({ page = 1, search = "" } = {}) => {
  return useQuery({
    queryKey: ["stocks", page, search],

    queryFn: async () => {
      const res = await api.get("/stocks", {
        params: { page, limit: 12, search },
      });
      return res.data;
    },

    placeholderData: keepPreviousData,
    staleTime: 5000,
  });
};
