import { beFetch } from "@/lib/beClient";
import { formatDate, formatNumber } from "@/lib/format";
import type { AlbumDto } from "@/lib/types";
import Link from "next/link";

type AlbumResult =
  | { album: AlbumDto; error?: undefined }
  | { album?: undefined; error: string };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function getAlbum(id: string): Promise<AlbumResult> {
  const response = await beFetch(`/api/albums/${id}`);
  if (!response.ok) {
    let detail = "";
    try {
      detail = await response.text();
    } catch {
      detail = "";
    }
    const suffix = detail ? ` - ${detail}` : "";
    return {
      error: `Failed to load album. Status ${response.status}${suffix}`,
    };
  }
  const album = (await response.json()) as AlbumDto;
  return { album };
}

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!UUID_RE.test(id)) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-black/50">
            Album detail
          </p>
          <h2 className="mt-3 text-3xl font-semibold">Invalid album ID</h2>
          <p className="text-sm text-black/50">
            The provided album ID is not a valid UUID.
          </p>
        </div>
        <Link
          href="/albums"
          className="inline-flex w-fit items-center rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-black/70 hover:border-black/40"
        >
          Back to albums
        </Link>
      </div>
    );
  }

  const result = await getAlbum(id);
  if (!result.album) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-black/50">
            Album detail
          </p>
          <h2 className="mt-3 text-3xl font-semibold">Failed to load album</h2>
          <p className="text-sm text-black/50">{result.error}</p>
        </div>
        <Link
          href="/albums"
          className="inline-flex w-fit items-center rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-black/70 hover:border-black/40"
        >
          Back to albums
        </Link>
      </div>
    );
  }

  const { album } = result;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-black/50">
            Album detail
          </p>
          <h2 className="mt-3 text-3xl font-semibold">{album.name}</h2>
          <p className="text-sm text-black/50">{album.description ?? "N/A"}</p>
        </div>
        <Link
          href="/albums"
          className="rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-black/70 hover:border-black/40"
        >
          Back
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white/80 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-black/50">
            Overview
          </p>
          <dl className="mt-4 space-y-3 text-sm text-black/70">
            <div>
              <dt className="text-xs text-black/40">Creator</dt>
              <dd>{album.creatorName ?? "N/A"}</dd>
            </div>
            <div>
              <dt className="text-xs text-black/40">Files</dt>
              <dd>{formatNumber(album.filesCount ?? 0)}</dd>
            </div>
            <div>
              <dt className="text-xs text-black/40">Favorite</dt>
              <dd>{album.isFavorite ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/80 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-black/50">
            Dates
          </p>
          <dl className="mt-4 space-y-3 text-sm text-black/70">
            <div>
              <dt className="text-xs text-black/40">Created</dt>
              <dd>{formatDate(album.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs text-black/40">Updated</dt>
              <dd>{formatDate(album.updatedAt)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
