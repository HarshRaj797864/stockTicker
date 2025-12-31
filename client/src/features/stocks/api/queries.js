import { useQuery } from "@tanstack/react-query";
import { api } from "../../../shared/lib/api";

export const useStocks = () => {
  return useQuery({
    queryKey: ["stocks"],
    queryFn: async () => {
      const response = await api.get("/stocks");
      return response.data; 
    },
    staleTime: 1000 * 60, 
  });
};
