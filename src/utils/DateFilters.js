/**
 * Formats an ISO timestamp up to minutes in the user's local timezone.
 * @param {string|Date} rawDate
 * @returns {string} Formatted date string (MM/DD/YYYY, HH:mm)
 */
export function formatToMinutes(rawDate) {
  if (!rawDate) return "";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Set to true if you prefer AM/PM
  }).format(new Date(rawDate));
}
