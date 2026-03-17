"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Users" },
  { href: "/albums", label: "Albums" },
  { href: "/premium", label: "Premium" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
              active
                ? "bg-black text-white"
                : "text-black/70 hover:bg-black/5 hover:text-black"
            }`}
          >
            {item.label}
            <span className="text-xs opacity-60">{">"}</span>
          </Link>
        );
      })}
    </nav>
  );
}
