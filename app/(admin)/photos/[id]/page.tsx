import { beFetch } from "@/lib/beClient";
import { formatDate, formatNumber } from "@/lib/format";
import type { PhotoDto } from "@/lib/types";
import Link from "next/link";

async function getPhoto(id: string): Promise<PhotoDto> {
  const response = await beFetch(`/api/photos/${id}`);
  if (!response.ok) {
    throw new Error("Failed to load photo");
  }
  return response.json();
}

export default async function PhotoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const photo = await getPhoto(params.id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-black/50">
            Photo detail
          </p>
          <h2 className="mt-3 text-3xl font-semibold">{photo.caption ?? "Untitled"}</h2>
          <p className="text-sm text-black/50">
            Owner: {photo.ownerName ?? "Unknown"}
          </p>
        </div>
        <Link
          href="/photos"
          className="rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-black/70 hover:border-black/40"
        >
          Back
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="overflow-hidden rounded-3xl border border-black/10 bg-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.filePath ?? "/file.svg"}
            alt={photo.caption ?? "photo"}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-black/10 bg-white/80 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-black/50">
              Metadata
            </p>
            <dl className="mt-4 space-y-3 text-sm text-black/70">
              <div>
                <dt className="text-xs text-black/40">Album</dt>
                <dd>{photo.albumName ?? "N/A"}</dd>
              </div>
              <div>
                <dt className="text-xs text-black/40">Quality</dt>
                <dd>{photo.quality ?? "N/A"}</dd>
              </div>
              <div>
                <dt className="text-xs text-black/40">Source</dt>
                <dd>{photo.source ?? "N/A"}</dd>
              </div>
              <div>
                <dt className="text-xs text-black/40">Size</dt>
                <dd>{formatNumber(photo.fileSize ?? 0)} bytes</dd>
              </div>
              <div>
                <dt className="text-xs text-black/40">Location</dt>
                <dd>{photo.location ?? "N/A"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white/80 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-black/50">
              Engagement
            </p>
            <dl className="mt-4 space-y-3 text-sm text-black/70">
              <div>
                <dt className="text-xs text-black/40">Likes</dt>
                <dd>{formatNumber(photo.likeCount ?? 0)}</dd>
              </div>
              <div>
                <dt className="text-xs text-black/40">Comments</dt>
                <dd>{formatNumber(photo.commentCount ?? 0)}</dd>
              </div>
              <div>
                <dt className="text-xs text-black/40">Created</dt>
                <dd>{formatDate(photo.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs text-black/40">Updated</dt>
                <dd>{formatDate(photo.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
