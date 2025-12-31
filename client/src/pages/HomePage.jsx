import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../shared/ui/Button";
import { useAuth } from "../app/AuthContext";

export const HomePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[100px] rounded-full -z-10 pointer-events-none" />

        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-gray-300 drop-shadow-sm">
          Master the Market with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-400">
            StockTicker
          </span>
        </h1>

        <p className="text-xl text-[#A3FFEA] max-w-2xl leading-relaxed font-medium tracking-wide">
          Real-time tracking, smart watchlists, and powerful analytics for the
          modern investor.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link to="/register">
            <Button
              size="lg"
              className="cursor-pointer !bg-gray-700 !text-white hover:!bg-gray-600 transition-all rounded-lg px-8 py-4 font-bold text-lg"
            >
              Get Started
            </Button>
          </Link>

          <Link to="/login">
            <Button
              size="lg"
              className="cursor-pointer !bg-gray-700 !text-white hover:!bg-gray-600 transition-all rounded-lg px-8 py-4 font-bold text-lg"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 animate-in fade-in duration-500 min-h-[60vh] py-4">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-600/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="flex items-end justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-400">
              {user.name || "Trader"}
            </span>
          </h1>
          <p className="text-gray-400 mt-2 font-medium">
            Here's your market snapshot.
          </p>
        </div>

        <div className="hidden md:block text-right">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A3FFEA]/10 border border-[#A3FFEA]/20">
            <span className="w-2 h-2 rounded-full bg-[#A3FFEA] animate-pulse shadow-[0_0_10px_#A3FFEA]"></span>
            <span className="text-[#A3FFEA] font-bold text-sm tracking-wide">
              MARKET OPEN
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            name: "NIFTY 50",
            value: "21,456.30",
            change: "+1.2%",
            isPositive: true,
          },
          {
            name: "SENSEX",
            value: "71,324.80",
            change: "+0.8%",
            isPositive: true,
          },
          {
            name: "NASDAQ",
            value: "14,890.10",
            change: "-0.4%",
            isPositive: false,
          },
        ].map((index) => (
          <div
            key={index.name}
            className="relative group overflow-hidden p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-white/20 to-transparent group-hover:via-pink-500/50 transition-all"></div>
            <div className="text-gray-400 text-sm font-bold tracking-wider">
              {index.name}
            </div>
            <div className="text-3xl font-bold text-white mt-2">
              {index.value}
            </div>
            <div
              className={`text-sm mt-1 font-mono font-bold ${
                index.isPositive ? "text-[#A3FFEA]" : "text-red-400"
              }`}
            >
              {index.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-pink-500 rounded-full"></span>
              Top Watchlist
            </h2>
            <Link
              to="/watchlists"
              className="text-sm font-bold text-pink-400 hover:text-pink-300 transition-colors"
            >
              VIEW ALL &rarr;
            </Link>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            {[
              {
                symbol: "RELIANCE",
                price: "2,560.00",
                change: "+12.00",
                isPos: true,
              },
              {
                symbol: "TATASTEEL",
                price: "134.50",
                change: "-1.20",
                isPos: false,
              },
              {
                symbol: "INFY",
                price: "1,450.00",
                change: "+8.40",
                isPos: true,
              },
            ].map((stock, i) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg ${
                      i === 0
                        ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {stock.symbol[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white group-hover:text-pink-400 transition-colors">
                      {stock.symbol}
                    </div>
                    <div className="text-xs text-gray-500 font-bold">NSE</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-white text-lg">
                    ₹{stock.price}
                  </div>
                  <div
                    className={`text-xs font-bold ${
                      stock.isPos ? "text-[#A3FFEA]" : "text-red-400"
                    }`}
                  >
                    {stock.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#A3FFEA]/10 blur-[40px] rounded-full"></div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
              🚀 Top Gainer
            </h3>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <div className="text-2xl font-bold text-white">Zomato</div>
                <div className="text-xs text-gray-500 font-medium">
                  Food Delivery
                </div>
              </div>
              <div className="bg-[#A3FFEA] text-black px-3 py-1 rounded-lg text-sm font-extrabold shadow-[0_0_15px_rgba(163,255,234,0.3)]">
                +8.4%
              </div>
            </div>
          </div>

          <Link to="/watchlists" className="block group">
            <div className="h-full p-6 rounded-2xl border-2 border-dashed border-gray-700 hover:border-pink-500 hover:bg-pink-500/5 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-800 group-hover:bg-pink-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center justify-center text-gray-400 transition-all text-2xl font-light">
                +
              </div>
              <div className="text-gray-300 font-bold group-hover:text-white">
                Create New Watchlist
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
