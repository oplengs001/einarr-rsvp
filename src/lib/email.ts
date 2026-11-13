import nodemailer from "nodemailer";
import { EVENT_CONFIG, PIRATE_AVATARS } from "@/config/event";
import { RsvpRecord } from "@/lib/store";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.SMTP_FROM?.trim() || user;
  const to = process.env.SMTP_TO?.trim() || from;

  if (!host || !user || !pass || !from || !to) {
    return null;
  }

  return { host, port, user, pass, from, to };
}

function formatAvatarLabel(avatarId: string): string {
  if (avatarId.startsWith("data:image/")) {
    return "Uploaded selfie photo";
  }
  const match = PIRATE_AVATARS.find((a) => a.id === avatarId);
  return match ? match.label : avatarId;
}

/**
 * Sends a notification email to the host whenever a new RSVP is submitted.
 * Errors are logged rather than thrown so email hiccups never block guest RSVPs.
 */
export async function sendRsvpNotificationEmail(record: RsvpRecord): Promise<void> {
  const smtp = getSmtpConfig();
  if (!smtp) {
    console.warn("SMTP env vars not configured; skipping RSVP email notification.");
    return;
  }

  const attending = record.attending === "yes";
  const seats = attending ? 1 + record.plus_ones : 0;
  const statusText = attending
    ? `Attending (${seats} ${seats === 1 ? "seat" : "seats"})`
    : "Can't make it";
  const avatarLabel = formatAvatarLabel(record.avatar);
  const bountyFormatted = record.bounty.toLocaleString("en-US");

  const subject = `[${EVENT_CONFIG.honoreeDisplay} RSVP] ${record.name} — ${statusText}`;

  const textLines = [
    `New RSVP for ${EVENT_CONFIG.honoreeDisplay}'s ${EVENT_CONFIG.occasion}`,
    "",
    `Guest: ${record.name}`,
    `Epithet: "${record.epithet}"`,
    `Status: ${statusText}`,
    attending
      ? `Party size: ${seats} (${record.plus_ones === 0 ? "just them" : `guest + ${record.plus_ones}`})`
      : "Party size: 0 (sending love from afar)",
    `Bounty: B$ ${bountyFormatted}-`,
    `Flag / Avatar: ${avatarLabel}`,
    record.message ? `Message: "${record.message}"` : "Message: (none)",
    "",
    `Event: ${EVENT_CONFIG.dateLong}`,
    `Baptismal: ${EVENT_CONFIG.baptismalTime} · ${EVENT_CONFIG.baptismalVenue}`,
    `Reception: ${EVENT_CONFIG.receptionTime} · ${EVENT_CONFIG.venueDisplay}`,
  ];

  const html = `
    <div style="font-family: Arial, sans-serif; background:#f6ead0; color:#1b1b1f; padding:24px; border:3px solid #1b1b1f; border-radius:14px; max-width:540px;">
      <p style="margin:0 0 6px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:#8d5629;">
        Den Den Mushi Alert · ${escapeHtml(EVENT_CONFIG.honoreeDisplay)}&apos;s ${escapeHtml(EVENT_CONFIG.occasion)}
      </p>
      <h2 style="margin:0 0 16px; font-size:22px; color:#1b1b1f;">
        New Crew RSVP: ${escapeHtml(record.name)}
      </h2>

      <table style="width:100%; border-collapse:collapse; background:#ffffff; border:2px solid #1b1b1f;">
        <tr>
          <td style="padding:10px 14px; font-weight:700; border-bottom:1px solid #e5dec9; width:130px; color:#5e3a1a;">Status</td>
          <td style="padding:10px 14px; font-weight:800; border-bottom:1px solid #e5dec9; color:${attending ? "#0d4a8a" : "#e2312d"};">${escapeHtml(statusText)}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px; font-weight:700; border-bottom:1px solid #e5dec9; color:#5e3a1a;">Epithet</td>
          <td style="padding:10px 14px; font-style:italic; border-bottom:1px solid #e5dec9;">&ldquo;${escapeHtml(record.epithet)}&rdquo;</td>
        </tr>
        <tr>
          <td style="padding:10px 14px; font-weight:700; border-bottom:1px solid #e5dec9; color:#5e3a1a;">Bounty</td>
          <td style="padding:10px 14px; font-weight:700; border-bottom:1px solid #e5dec9;">B$ ${escapeHtml(bountyFormatted)}-</td>
        </tr>
        <tr>
          <td style="padding:10px 14px; font-weight:700; border-bottom:1px solid #e5dec9; color:#5e3a1a;">Crew Flag</td>
          <td style="padding:10px 14px; border-bottom:1px solid #e5dec9;">${escapeHtml(avatarLabel)}</td>
        </tr>
        ${
          record.message
            ? `<tr>
          <td style="padding:10px 14px; font-weight:700; color:#5e3a1a; vertical-align:top;">Note</td>
          <td style="padding:10px 14px;">&ldquo;${escapeHtml(record.message)}&rdquo;</td>
        </tr>`
            : ""
        }
      </table>

      <p style="margin:16px 0 0; font-size:12px; color:#5e3a1a;">
        ${escapeHtml(EVENT_CONFIG.dateLong)} · ${escapeHtml(EVENT_CONFIG.baptismalTime)} ${escapeHtml(EVENT_CONFIG.baptismalVenue)} · ${escapeHtml(EVENT_CONFIG.receptionTime)} ${escapeHtml(EVENT_CONFIG.venueDisplay)}
      </p>
    </div>
  `.trim();

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });

    await transporter.sendMail({
      from: `${EVENT_CONFIG.honoreeDisplay} Christening RSVP <${smtp.from}>`,
      to: smtp.to,
      subject,
      text: textLines.join("\n"),
      html,
    });
  } catch (err) {
    console.error("Failed to send RSVP notification email:", err);
  }
}
