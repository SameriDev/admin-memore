export function formatDate(value?: string | null) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatNumber(value?: number | null) {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("en-US").format(value);
}
