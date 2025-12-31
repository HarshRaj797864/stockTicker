import React, { useState } from "react";
import { useStocks } from "../features/stocks/api/queries";
import { AddToWatchlistButton } from "../features/watchlist/ui/AddToWatchlistButton";
import { Link } from "react-router-dom";
import { SearchBar } from "../shared/ui/SearchBar";

export const DashboardPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const {
    data: stockResponse,
    isLoading,
    error,
    isPlaceholderData,
  } = useStocks({ page, search });

  const stocks = stockResponse?.data || [];
  const meta = stockResponse?.meta || { totalPages: 1 };

  const handleSearch = (text) => {
    setSearch(text);
    setPage(1);
  };

  if (isLoading)
    return <div className="text-center p-10">Loading market data...</div>;
  if (error)
    return (
      <div className="text-center p-10 text-error">Failed to load stocks</div>
    );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Market Overview</h1>

        <SearchBar value={search} onChange={handleSearch} />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {stocks.length > 0 ? (
          stocks.map((stock) => {
            const change =
              ((stock.currentPrice - stock.initialPrice) / stock.initialPrice) *
              100;
            const isPositive = change >= 0;

            return (
              <div
                key={stock.id}
                className="p-4 border rounded shadow hover:shadow-md transition bg-base-100 relative"
              >
                <div className="flex justify-between items-start">
                  <Link
                    to={`/stocks/${stock.symbol}`}
                    className="flex-1 hover:opacity-70 transition-opacity"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-primary underline decoration-dotted">
                        {stock.symbol}
                      </h2>
                      <p className="text-base-content/60 text-sm">
                        {stock.companyName}
                      </p>
                    </div>
                  </Link>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2 py-1 rounded text-sm font-bold ${
                        isPositive
                          ? "bg-success/20 text-success"
                          : "bg-error/20 text-error"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {change.toFixed(2)}%
                    </span>

                    <AddToWatchlistButton ticker={stock.symbol} />
                  </div>
                </div>

                <Link
                  to={`/stocks/${stock.symbol}`}
                  className="block mt-4 hover:opacity-70"
                >
                  <p className="text-2xl font-bold">
                    ${stock.currentPrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-base-content/40">
                    Prev: ${stock.initialPrice.toFixed(2)}
                  </p>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-10 text-base-content/50">
            No stocks found matching "{search}".
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-base-100 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base-200 text-base-content"
        >
          Previous
        </button>

        <span className="text-sm text-base-content/60">
          Page {page} of {meta.totalPages || 1}
        </span>

        <button
          onClick={() => {
            if (!isPlaceholderData && page < meta.totalPages) {
              setPage((old) => old + 1);
            }
          }}
          disabled={isPlaceholderData || page >= meta.totalPages}
          className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/80"
        >
          Next
        </button>
      </div>
    </div>
  );
};
