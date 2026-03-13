"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black/60 transition hover:border-black/30 hover:text-black"
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
