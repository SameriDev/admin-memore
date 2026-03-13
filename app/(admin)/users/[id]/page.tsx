import { beFetch } from "@/lib/beClient";
import { formatDate, formatNumber } from "@/lib/format";
import type { UserDto } from "@/lib/types";
import Link from "next/link";

async function getUser(id: string): Promise<UserDto> {
  const response = await beFetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error("Failed to load user");
  }
  return response.json();
}

export default async function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser(params.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-black/50">
            User profile
          </p>
          <h2 className="mt-3 text-3xl font-semibold">{user.name}</h2>
          <p className="text-sm text-black/50">@{user.username}</p>
        </div>
        <Link
          href="/users"
          className="rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-black/70 hover:border-black/40"
        >
          Back
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white/80 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-black/50">
            Details
          </p>
          <dl className="mt-4 space-y-3 text-sm text-black/70">
            <div>
              <dt className="text-xs text-black/40">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-black/40">Role</dt>
              <dd>{user.role ?? "USER"}</dd>
            </div>
            <div>
              <dt className="text-xs text-black/40">Badge</dt>
              <dd>{user.badgeLevel ?? "BRONZE"}</dd>
            </div>
            <div>
              <dt className="text-xs text-black/40">Birthday</dt>
              <dd>{user.birthday ?? "N/A"}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/80 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-black/50">
            Activity
          </p>
          <dl className="mt-4 space-y-3 text-sm text-black/70">
            <div>
              <dt className="text-xs text-black/40">Photos</dt>
              <dd>{formatNumber(user.imagesCount ?? 0)}</dd>
            </div>
            <div>
              <dt className="text-xs text-black/40">Friends</dt>
              <dd>{formatNumber(user.friendsCount ?? 0)}</dd>
            </div>
            <div>
              <dt className="text-xs text-black/40">Streak</dt>
              <dd>{formatNumber(user.streakCount ?? 0)} days</dd>
            </div>
            <div>
              <dt className="text-xs text-black/40">Last active</dt>
              <dd>{formatDate(user.lastActive)}</dd>
            </div>
            <div>
              <dt className="text-xs text-black/40">Created</dt>
              <dd>{formatDate(user.createdAt)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
