import { formatDistanceToNow, format, parseISO } from "date-fns";

export function formatRelativeTime(dateString: string): string {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
}

export function formatDate(dateString: string, pattern = "MMM d, yyyy"): string {
  try {
    return format(parseISO(dateString), pattern);
  } catch {
    return dateString;
  }
}

export function formatDateRange(start: string, end?: string): string {
  const startFormatted = formatDate(start, "MMM yyyy");
  const endFormatted = end ? formatDate(end, "MMM yyyy") : "Present";
  return `${startFormatted} – ${endFormatted}`;
}
