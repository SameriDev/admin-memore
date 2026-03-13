type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/90 p-6 shadow-[0_12px_30px_-22px_rgba(0,0,0,0.4)]">
      <p className="text-xs uppercase tracking-[0.22em] text-black/50">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-black">{value}</p>
      {hint ? <p className="mt-2 text-sm text-black/50">{hint}</p> : null}
    </div>
  );
}
