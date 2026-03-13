import AdminNav from "@/components/AdminNav";
import LogoutButton from "@/components/LogoutButton";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f1e7da,_#f8f4ef_60%)] text-black">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-[240px_1fr] gap-8 px-6 py-10">
        <aside className="flex flex-col gap-8 rounded-3xl border border-black/10 bg-white/85 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.4)]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-black/50">
              Memore
            </p>
            <h1 className="mt-2 text-xl font-semibold">Admin Console</h1>
          </div>
          <AdminNav />
          <div className="mt-auto">
            <LogoutButton />
          </div>
        </aside>

        <main className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.35)]">
          {children}
        </main>
      </div>
    </div>
  );
}
