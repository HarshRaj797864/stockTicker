import React from "react";
import { useStocks } from "../features/stocks/api/queries";

export const DashboardPage = () => {
  const { data: stockResponse, isLoading, error } = useStocks();

  const stocks = stockResponse?.data || [];

  if (isLoading)
    return <div className="text-center p-10">Loading market data...</div>;
  if (error)
    return (
      <div className="text-center p-10 text-red-500">Failed to load stocks</div>
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Market Overview</h1>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {stocks.length > 0 ? (
          stocks.map((stock) => {
            const change =
              ((stock.currentPrice - stock.initialPrice) / stock.initialPrice) *
              100;
            const isPositive = change >= 0;

            return (
              <div
                key={stock.id}
                className="p-4 border rounded shadow hover:shadow-md transition bg-white"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{stock.symbol}</h2>
                    <p className="text-gray-600 text-sm">{stock.companyName}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-sm font-bold ${
                      isPositive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {change.toFixed(2)}%
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-2xl font-bold">
                    ${stock.currentPrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">
                    Prev: ${stock.initialPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No stocks found.</p>
        )}
      </div>
    </div>
  );
};
