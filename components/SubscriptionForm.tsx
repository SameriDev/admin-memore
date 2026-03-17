"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserDto } from "@/lib/types";
import { formatDate } from "@/lib/format";

type Plan = "FREE" | "SILVER" | "GOLD";

interface SubscriptionFormProps {
  user: UserDto;
  onUpdated?: (updated: UserDto) => void;
}

export default function SubscriptionForm({ user, onUpdated }: SubscriptionFormProps) {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan>((user.subscriptionPlan as Plan) ?? "FREE");
  const [durationDays, setDurationDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const currentPlan = user.subscriptionPlan ?? "FREE";
  const expiresAt = user.subscriptionExpiresAt;
  const aiRequestsToday = user.aiRequestsToday ?? 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/subscription", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, plan, durationDays }),
      });

      if (res.ok) {
        const updated: UserDto = await res.json();
        setMessage({ text: `Đã kích hoạt ${plan} cho ${user.name} thành công`, ok: true });
        onUpdated?.(updated);
        router.refresh();
      } else {
        const errText = await res.text();
        setMessage({ text: `Lỗi: ${errText}`, ok: false });
      }
    } catch {
      setMessage({ text: "Không thể kết nối đến server", ok: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-black/50">Subscription</p>

      {/* Current status */}
      <dl className="mt-4 space-y-3 text-sm text-black/70">
        <div>
          <dt className="text-xs text-black/40">Plan hiện tại</dt>
          <dd className="font-semibold">{currentPlan}</dd>
        </div>
        {expiresAt && (
          <div>
            <dt className="text-xs text-black/40">Hết hạn</dt>
            <dd>{formatDate(expiresAt)}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs text-black/40">AI edits hôm nay</dt>
          <dd>{aiRequestsToday}</dd>
        </div>
      </dl>

      {/* Activate form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-1">
            Plan
          </label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as Plan)}
            className="w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black/30"
          >
            <option value="FREE">FREE</option>
            <option value="SILVER">SILVER</option>
            <option value="GOLD">GOLD</option>
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-1">
            Số ngày
          </label>
          <input
            type="number"
            min={1}
            max={3650}
            value={durationDays}
            onChange={(e) => setDurationDays(Number(e.target.value))}
            className="w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black/30"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-black/70 hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Đang kích hoạt..." : "Kích hoạt"}
        </button>

        {message && (
          <p className={`text-xs mt-2 ${message.ok ? "text-green-600" : "text-red-500"}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}
