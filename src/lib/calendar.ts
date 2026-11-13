import { DRESS_CODE_COLORS, EVENT_CONFIG } from "@/config/event";

// December 6, 2026 · 11:00 AM to 3:00 PM Asia/Manila (UTC+8)
const EVENT_START_UTC = "20261206T030000Z";
const EVENT_END_UTC = "20261206T070000Z";

function escapeIcsText(value: string): string {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\r\n", "\\n")
    .replaceAll("\n", "\\n");
}

function formatIcsTimestamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function buildEventSummaryDetails(): string {
  const palette = DRESS_CODE_COLORS.map((c) => c.name).join(", ");
  return [
    `Join us as we celebrate ${EVENT_CONFIG.honoreeDisplay}'s ${EVENT_CONFIG.occasion}!`,
    "",
    `Baptismal: ${EVENT_CONFIG.baptismalTime} at ${EVENT_CONFIG.baptismalVenue}`,
    `Map: ${EVENT_CONFIG.baptismalMapUrl}`,
    "",
    `Reception: ${EVENT_CONFIG.receptionTime} at ${EVENT_CONFIG.venueDisplay}`,
    `Map: ${EVENT_CONFIG.venueMapUrl}`,
    "",
    `Dress Code Colors: ${palette}`,
  ].join("\n");
}

/** Builds a Google Calendar deep link pre-filled with the christening & reception details. */
export function buildGoogleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${EVENT_CONFIG.honoreeDisplay}'s ${EVENT_CONFIG.occasion}`,
    dates: `${EVENT_START_UTC}/${EVENT_END_UTC}`,
    location: `${EVENT_CONFIG.baptismalVenue} & ${EVENT_CONFIG.venueDisplay}`,
    details: buildEventSummaryDetails(),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates an RFC 5545 .ics calendar invite with 1-day and 2-hour alarms
 * for December 6, 2026 (11:00 AM - 3:00 PM PHT / UTC+8).
 */
export function buildEventIcs(recordId: string, guestEmail?: string | null): string {
  const summary = `${EVENT_CONFIG.honoreeDisplay}'s ${EVENT_CONFIG.occasion}`;
  const location = `${EVENT_CONFIG.baptismalVenue} -> ${EVENT_CONFIG.venueDisplay}`;
  const description = buildEventSummaryDetails();
  const organizerEmail = process.env.SMTP_FROM?.trim() || "noreply@einarr-rsvp.local";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Einarr Christening RSVP//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:einarr-christening-${recordId}@einarr-rsvp`,
    `DTSTAMP:${formatIcsTimestamp(new Date())}`,
    `DTSTART:${EVENT_START_UTC}`,
    `DTEND:${EVENT_END_UTC}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `LOCATION:${escapeIcsText(location)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `ORGANIZER;CN="${escapeIcsText(`${EVENT_CONFIG.honoreeDisplay} Christening`)}":mailto:${organizerEmail}`,
    ...(guestEmail
      ? [
          `ATTENDEE;RSVP=FALSE;PARTSTAT=ACCEPTED:mailto:${guestEmail}`,
        ]
      : []),
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcsText(`Tomorrow: ${summary} starts at ${EVENT_CONFIG.baptismalTime}!`)}`,
    "END:VALARM",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcsText(`In 2 hours: ${summary} at ${EVENT_CONFIG.baptismalVenue}`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `${lines.join("\r\n")}\r\n`;
}

