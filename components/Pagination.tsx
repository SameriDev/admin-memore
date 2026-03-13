import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  size: number;
};

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  size,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevPage = Math.max(0, currentPage - 1);
  const nextPage = Math.min(totalPages - 1, currentPage + 1);

  return (
    <div className="flex items-center justify-between border-t border-black/10 pt-4 text-sm">
      <Link
        href={`${basePath}?page=${prevPage}&size=${size}`}
        className={`rounded-full border px-4 py-2 ${
          currentPage === 0
            ? "pointer-events-none border-black/10 text-black/30"
            : "border-black/30 text-black hover:border-black"
        }`}
      >
        Previous
      </Link>
      <span className="text-xs uppercase tracking-[0.2em] text-black/50">
        Page {currentPage + 1} of {totalPages}
      </span>
      <Link
        href={`${basePath}?page=${nextPage}&size=${size}`}
        className={`rounded-full border px-4 py-2 ${
          currentPage >= totalPages - 1
            ? "pointer-events-none border-black/10 text-black/30"
            : "border-black/30 text-black hover:border-black"
        }`}
      >
        Next
      </Link>
    </div>
  );
}
