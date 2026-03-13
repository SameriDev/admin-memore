import Pagination from "@/components/Pagination";
import { beFetch } from "@/lib/beClient";
import { formatDate, formatNumber } from "@/lib/format";
import type { AlbumDto, Page } from "@/lib/types";
import Link from "next/link";
import { revalidatePath } from "next/cache";

async function getAlbums(page: number, size: number): Promise<Page<AlbumDto>> {
  const response = await beFetch(`/api/admin/albums?page=${page}&size=${size}`);
  if (!response.ok) {
    throw new Error("Failed to load albums");
  }
  return response.json();
}

export default async function AlbumsPage({
  searchParams,
}: {
  searchParams: { page?: string; size?: string };
}) {
  const page = Math.max(0, Number(searchParams.page ?? 0) || 0);
  const size = Math.min(50, Math.max(10, Number(searchParams.size ?? 20) || 20));
  const data = await getAlbums(page, size);

  async function deleteAlbum(formData: FormData) {
    "use server";
    const albumId = formData.get("albumId")?.toString();
    if (!albumId) return;
    await beFetch(`/api/albums/${albumId}`, { method: "DELETE" });
    revalidatePath("/albums");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-black/50">
            Albums
          </p>
          <h2 className="mt-3 text-3xl font-semibold">Collections</h2>
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-black/40">
          Total {data.totalElements}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/5 text-xs uppercase tracking-[0.2em] text-black/60">
            <tr>
              <th className="px-4 py-3">Album</th>
              <th className="px-4 py-3">Creator</th>
              <th className="px-4 py-3">Files</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.content.map((album) => (
              <tr key={album.id} className="border-t border-black/5">
                <td className="px-4 py-3">
                  <Link
                    href={`/albums/${album.id}`}
                    className="font-semibold text-black hover:underline"
                  >
                    {album.name}
                  </Link>
                  <p className="text-xs text-black/40">
                    {album.description ?? "No description"}
                  </p>
                </td>
                <td className="px-4 py-3 text-black/70">{album.creatorName ?? "N/A"}</td>
                <td className="px-4 py-3 text-black/70">
                  {formatNumber(album.filesCount ?? 0)}
                </td>
                <td className="px-4 py-3 text-black/60">
                  {formatDate(album.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/albums/${album.id}`}
                      className="rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/70 hover:border-black/40"
                    >
                      View
                    </Link>
                    <form action={deleteAlbum}>
                      <input type="hidden" name="albumId" value={album.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/70 transition hover:border-black/40"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {data.content.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-black/40">
                  No albums found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={data.number} totalPages={data.totalPages} basePath="/albums" size={data.size} />
    </div>
  );
}
