import Pagination from "@/components/Pagination";
import { beFetch } from "@/lib/beClient";
import { formatDate, formatNumber } from "@/lib/format";
import type { Page, PhotoDto } from "@/lib/types";
import Link from "next/link";
import { revalidatePath } from "next/cache";

async function getPhotos(page: number, size: number): Promise<Page<PhotoDto>> {
  const response = await beFetch(`/api/admin/photos?page=${page}&size=${size}`);
  if (!response.ok) {
    throw new Error("Failed to load photos");
  }
  return response.json();
}

export default async function PhotosPage({
  searchParams,
}: {
  searchParams: { page?: string; size?: string };
}) {
  const page = Math.max(0, Number(searchParams.page ?? 0) || 0);
  const size = Math.min(50, Math.max(10, Number(searchParams.size ?? 20) || 20));
  const data = await getPhotos(page, size);

  async function deletePhoto(formData: FormData) {
    "use server";
    const photoId = formData.get("photoId")?.toString();
    if (!photoId) return;
    await beFetch(`/api/photos/${photoId}`, { method: "DELETE" });
    revalidatePath("/photos");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-black/50">
            Photos
          </p>
          <h2 className="mt-3 text-3xl font-semibold">All uploads</h2>
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-black/40">
          Total {data.totalElements}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/5 text-xs uppercase tracking-[0.2em] text-black/60">
            <tr>
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Album</th>
              <th className="px-4 py-3">Likes</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.content.map((photo) => (
              <tr key={photo.id} className="border-t border-black/5">
                <td className="px-4 py-3">
                  <div className="h-12 w-12 overflow-hidden rounded-xl bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.thumbnailPath ?? photo.filePath ?? "/file.svg"}
                      alt={photo.caption ?? "photo"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/users/${photo.ownerId}`}
                    className="font-semibold text-black hover:underline"
                  >
                    {photo.ownerName ?? "Unknown"}
                  </Link>
                </td>
                <td className="px-4 py-3 text-black/70">
                  {photo.albumName ?? "N/A"}
                </td>
                <td className="px-4 py-3 text-black/70">
                  {formatNumber(photo.likeCount ?? 0)}
                </td>
                <td className="px-4 py-3 text-black/60">
                  {formatDate(photo.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/photos/${photo.id}`}
                      className="rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-black/70 hover:border-black/40"
                    >
                      View
                    </Link>
                    <form action={deletePhoto}>
                      <input type="hidden" name="photoId" value={photo.id} />
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
                <td colSpan={6} className="px-4 py-8 text-center text-black/40">
                  No photos found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={data.number} totalPages={data.totalPages} basePath="/photos" size={data.size} />
    </div>
  );
}
