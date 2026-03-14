"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  title: string;
  data: Record<string, number>;
  color?: string;
};

function formatMonthLabel(key: string): string {
  const [year, month] = key.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export default function TrendLineChart({ title, data, color = "#1f3d3a" }: Props) {
  const chartData = Object.entries(data).map(([month, count]) => ({
    month: formatMonthLabel(month),
    count,
  }));

  const isEmpty = chartData.every((d) => d.count === 0);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <p className="mb-4 text-sm font-semibold text-black/70">{title}</p>
      {isEmpty ? (
        <div className="flex h-40 items-center justify-center text-sm text-black/40">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #00000015" }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 3, fill: color }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
