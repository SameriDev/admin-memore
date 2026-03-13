import Pagination from "@/components/Pagination";
import { beFetch } from "@/lib/beClient";
import { formatDate } from "@/lib/format";
import type { Page, UserDto } from "@/lib/types";
import Link from "next/link";
import { revalidatePath } from "next/cache";

async function getUsers(page: number, size: number): Promise<Page<UserDto>> {
  const response = await beFetch(`/api/admin/users?page=${page}&size=${size}`);
  if (!response.ok) {
    throw new Error("Failed to load users");
  }
  return response.json();
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string; size?: string };
}) {
  const page = Math.max(0, Number(searchParams.page ?? 0) || 0);
  const size = Math.min(50, Math.max(10, Number(searchParams.size ?? 20) || 20));
  const data = await getUsers(page, size);

  async function deleteUser(formData: FormData) {
    "use server";
    const userId = formData.get("userId")?.toString();
    if (!userId) return;
    await beFetch(`/api/users/${userId}`, { method: "DELETE" });
    revalidatePath("/users");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-black/50">
            Users
          </p>
          <h2 className="mt-3 text-3xl font-semibold">All accounts</h2>
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-black/40">
          Total {data.totalElements}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/5 text-xs uppercase tracking-[0.2em] text-black/60">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.content.map((user) => (
              <tr key={user.id} className="border-t border-black/5">
                <td className="px-4 py-3">
                  <Link
                    href={`/users/${user.id}`}
                    className="font-semibold text-black hover:underline"
                  >
                    {user.name}
                  </Link>
                  <p className="text-xs text-black/40">@{user.username}</p>
                </td>
                <td className="px-4 py-3 text-black/70">{user.email}</td>
                <td className="px-4 py-3 text-black/70">{user.role ?? "USER"}</td>
                <td className="px-4 py-3 text-black/60">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteUser}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/70 transition hover:border-black/40"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {data.content.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-black/40">
                  No users found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={data.number} totalPages={data.totalPages} basePath="/users" size={data.size} />
    </div>
  );
}
