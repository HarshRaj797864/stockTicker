import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const StockPriceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 text-gray-400 rounded border">
        No chart data available
      </div>
    );
  }

  return (
    <div className="h-96 w-full bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">30-Day Price History</h3>
      <ResponsiveContainer width="100%" height="100%">
        {/* FIX: Increased bottom margin to 40 to hold the labels */}
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 40, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            minTickGap={30}
            tickMargin={15} /* Pushes text down away from the line */
          />
          
          <YAxis 
            domain={['auto', 'auto']} 
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            width={60}
          />
          
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            formatter={(value) => [`$${value.toFixed(2)}`, "Price"]}
          />
          
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
