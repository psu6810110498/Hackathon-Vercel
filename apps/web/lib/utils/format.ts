/**
 * Date and number formatters for display
 */

/**
 * Format date for Thai-friendly display (e.g. 21 ก.พ. 2568)
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * Format relative time (e.g. "เมื่อ 2 ชม. ที่แล้ว")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "เมื่อสักครู่";
  if (diffMins < 60) return `เมื่อ ${diffMins} นาทีที่แล้ว`;
  if (diffHours < 24) return `เมื่อ ${diffHours} ชม. ที่แล้ว`;
  if (diffDays < 7) return `เมื่อ ${diffDays} วันที่แล้ว`;
  return formatDate(d);
}

/**
 * Format score for display (0–100)
 */
export function formatScore(score: number): string {
  return `${Math.round(score)}`;
}
