"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserDto } from "@/lib/types";

type Plan = "FREE" | "SILVER" | "GOLD";

export default function PremiumPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Premium Management</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <CreateUserCard />
        <GrantPremiumCard />
      </div>
    </div>
  );
}

function CreateUserCard() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: `Tạo user thành công: ${form.email}`, ok: true });
        setForm({ name: "", username: "", email: "", password: "" });
      } else {
        setMessage({ text: data.error || "Lỗi không xác định", ok: false });
      }
    } catch {
      setMessage({ text: "Không thể kết nối server", ok: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-black/50">Tạo user mới</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {(["name", "username", "email", "password"] as const).map((field) => (
          <div key={field}>
            <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-1">
              {field === "name" ? "Họ tên" : field === "username" ? "Username" : field === "email" ? "Email" : "Mật khẩu"}
            </label>
            <input
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              required
              value={form[field]}
              onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
              className="w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black/30"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-black/70 hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Đang tạo..." : "Tạo user"}
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

function GrantPremiumCard() {
  const [email, setEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [user, setUser] = useState<UserDto | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearching(true);
    setUser(null);
    setSearchError(null);

    try {
      const res = await fetch(`/api/admin/users/search?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        setUser(await res.json());
      } else {
        setSearchError("Không tìm thấy user với email này");
      }
    } catch {
      setSearchError("Không thể kết nối server");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-black/50">Cấp Premium theo email</p>

      <form onSubmit={handleSearch} className="mt-5 flex gap-2">
        <input
          type="email"
          required
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-black/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black/30"
        />
        <button
          type="submit"
          disabled={searching}
          className="rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-black/70 hover:border-black/40 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {searching ? "..." : "Tìm"}
        </button>
      </form>

      {searchError && <p className="mt-3 text-xs text-red-500">{searchError}</p>}

      {user && (
        <div className="mt-5 space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-black/5 px-4 py-3">
            <div className="size-8 rounded-full bg-black/10 flex items-center justify-center text-xs font-semibold text-black/50">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-black/50">{user.email}</p>
            </div>
            <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-black/10">
              {user.subscriptionPlan ?? "FREE"}
            </span>
          </div>

          <InlineSubscriptionForm user={user} onUpdated={setUser} />
        </div>
      )}
    </div>
  );
}

function InlineSubscriptionForm({ user, onUpdated }: { user: UserDto; onUpdated: (u: UserDto) => void }) {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan>((user.subscriptionPlan as Plan) ?? "FREE");
  const [durationDays, setDurationDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

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
        onUpdated(updated);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-1">Plan</label>
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
        <label className="block text-xs uppercase tracking-[0.15em] text-black/50 mb-1">Số ngày</label>
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
  );
}
