import BadgePieChart from "@/components/BadgePieChart";
import BarChart from "@/components/BarChart";
import StatCard from "@/components/StatCard";
import TrendLineChart from "@/components/TrendLineChart";
import { beFetch } from "@/lib/beClient";
import { formatNumber } from "@/lib/format";
import type { AdminStats } from "@/lib/types";

async function getStats(): Promise<AdminStats> {
  const response = await beFetch("/api/admin/stats");
  if (!response.ok) {
    throw new Error("Failed to load stats");
  }
  return response.json();
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-black/50">
          Overview
        </p>
        <h2 className="mt-3 text-3xl font-semibold">Memore Operations</h2>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label="Users" value={formatNumber(stats.usersCount)} hint="Total accounts" />
        <StatCard label="Photos" value={formatNumber(stats.photosCount)} hint="All uploads" />
        <StatCard label="Albums" value={formatNumber(stats.albumsCount)} hint="Shared collections" />
      </div>

      {/* Row 2: Trend Line Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TrendLineChart title="New Users / Month" data={stats.registrationsByMonth ?? {}} color="#1f3d3a" />
        <TrendLineChart title="Photo Uploads / Month" data={stats.photosByMonth ?? {}} color="#8B4513" />
      </div>

      {/* Row 3: Bar Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BarChart title="Photos by Source" data={stats.photosBySource ?? {}} />
        <BarChart title="Photos by Quality" data={stats.photosByQuality ?? {}} />
      </div>

      {/* Row 4: Badge Pie Chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BadgePieChart title="User Badge Distribution" data={stats.usersByBadge ?? {}} />
      </div>
    </div>
  );
}
