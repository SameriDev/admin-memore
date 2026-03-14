"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const BADGE_COLORS: Record<string, string> = {
  BRONZE: "#cd7f32",
  SILVER: "#c0c0c0",
  GOLD: "#ffd700",
  PLATINUM: "#8b8fa8",
  DIAMOND: "#7dd6f0",
};

const DEFAULT_COLOR = "#aaaaaa";

type Props = {
  title: string;
  data: Record<string, number>;
};

export default function BadgePieChart({ title, data }: Props) {
  const chartData = Object.entries(data)
    .filter(([, count]) => count > 0)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <p className="mb-4 text-sm font-semibold text-black/70">{title}</p>
      {chartData.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-black/40">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={90}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={BADGE_COLORS[entry.name] ?? DEFAULT_COLOR}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #00000015" }}
            />
            <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
