type BarChartProps = {
  title: string;
  data: Record<string, number>;
};

export default function BarChart({ title, data }: BarChartProps) {
  const entries = Object.entries(data ?? {});
  const maxValue = Math.max(1, ...entries.map(([, value]) => value));

  return (
    <div className="rounded-2xl border border-black/10 bg-white/90 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-black/70">
          {title}
        </h3>
        <span className="text-xs text-black/40">{entries.length} groups</span>
      </div>
      <div className="mt-4 space-y-4">
        {entries.length === 0 ? (
          <p className="text-sm text-black/40">No data available.</p>
        ) : (
          entries.map(([label, value]) => (
            <div key={label} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-black/60">
                <span>{label}</span>
                <span>{value}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-black/10">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,#1f3d3a,#a8c7c1)]"
                  style={{ width: `${(value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
