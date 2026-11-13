import { readFile } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";
import {
  DRESS_CODE_COLORS,
  EVENT_CONFIG,
  PIRATE_AVATARS,
} from "@/config/event";
import { buildEventIcs, buildGoogleCalendarUrl } from "@/lib/calendar";
import { RsvpRecord } from "@/lib/store";

const AVATAR_CID = "guest-wanted-avatar";
const JOLLY_ROGER_CID = "jolly-roger-emblem";
const DEN_DEN_CID = "den-den-mushi-icon";

type RecipientRole = "host" | "guest";

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

function resolveAvatarInfo(avatarId: string) {
  const isSelfie = avatarId.startsWith("data:image/");
  const matched =
    PIRATE_AVATARS.find((a) => a.id === avatarId) ?? PIRATE_AVATARS[0];
  return {
    isSelfie,
    label: isSelfie ? "Uploaded selfie photo" : matched.label,
    iconSrc: matched.iconSrc,
  };
}

async function readPublicPngAttachment(relativePublicPath: string, cid: string) {
  const cleanRel = relativePublicPath.replace(/^\/+/, "");
  const fullPath = path.join(process.cwd(), "public", cleanRel);
  try {
    const buffer = await readFile(fullPath);
    return {
      filename: path.basename(fullPath),
      content: buffer,
      contentType: "image/png",
      cid,
    };
  } catch (err) {
    console.warn(`Could not read public asset ${cleanRel} for email:`, err);
    return null;
  }
}

async function buildAvatarAttachment(avatarId: string) {
  if (avatarId.startsWith("data:image/")) {
    const match = avatarId.match(
      /^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=]+)$/
    );
    if (!match) return null;
    const contentType = match[1];
    const ext =
      contentType.split("/")[1] === "jpeg" ? "jpg" : contentType.split("/")[1];
    return {
      filename: `pirate-selfie.${ext}`,
      content: Buffer.from(match[2], "base64"),
      contentType,
      cid: AVATAR_CID,
    };
  }

  const { iconSrc } = resolveAvatarInfo(avatarId);
  return readPublicPngAttachment(iconSrc, AVATAR_CID);
}

function buildPublicPosterUrl(recordId: string): string | null {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "");
  if (!configured) return null;
  return `${configured.replace(/\/+$/, "")}/thanks/${recordId}`;
}

function buildThemedEmailMessage(params: {
  record: RsvpRecord;
  role: RecipientRole;
  posterUrl: string | null;
  calendarUrl: string;
  hasAvatar: boolean;
  hasJollyRoger: boolean;
  hasDenDen: boolean;
}) {
  const {
    record,
    role,
    posterUrl,
    calendarUrl,
    hasAvatar,
    hasJollyRoger,
    hasDenDen,
  } = params;

  const attending = record.attending === "yes";
  const seats = attending ? 1 + record.plus_ones : 0;
  const statusText = attending
    ? `Attending (${seats} ${seats === 1 ? "seat" : "seats"})`
    : "Can't make it";
  const badgeText = attending
    ? `SET SAIL · ${seats} ${seats === 1 ? "SEAT" : "SEATS"} RESERVED`
    : "IN SPIRIT · SENDING LOVE FROM AFAR";
  const firstName = record.name.trim().split(/\s+/)[0] || record.name;
  const avatarInfo = resolveAvatarInfo(record.avatar);
  const bountyFormatted = record.bounty.toLocaleString("en-US");
  const displayName = record.name.trim().toUpperCase() || "YOUR NAME";
  const showNakama = attending && record.plus_ones > 0;

  const isGuest = role === "guest";
  const subject = isGuest
    ? `Ahoy, ${firstName}! Your RSVP & Wanted Poster for ${EVENT_CONFIG.honoreeDisplay}'s ${EVENT_CONFIG.occasion}`
    : `[${EVENT_CONFIG.honoreeDisplay} RSVP] ${record.name} — ${statusText}`;

  const eyebrow = isGuest
    ? `${EVENT_CONFIG.honoreeDisplay}'s ${EVENT_CONFIG.occasion} · Crew Confirmation`
    : `${EVENT_CONFIG.honoreeDisplay}'s ${EVENT_CONFIG.occasion} · Crew Log`;

  const headline = isGuest
    ? attending
      ? "YOU'RE IN THE CREW!"
      : "THANKS FOR WRITING!"
    : "NEW CREW RSVP!";

  const greeting = isGuest
    ? attending
      ? `See you on ${EVENT_CONFIG.dateDisplay}, ${firstName}!`
      : `Thank you for sending love, ${firstName}!`
    : attending
      ? `Welcome aboard, ${firstName}!`
      : `Love from afar, ${firstName}`;

  const textLines = [
    isGuest
      ? `Ahoy ${record.name}! Here is your RSVP confirmation for ${EVENT_CONFIG.honoreeDisplay}'s ${EVENT_CONFIG.occasion}.`
      : `New RSVP for ${EVENT_CONFIG.honoreeDisplay}'s ${EVENT_CONFIG.occasion}`,
    "",
    `Guest: ${record.name}`,
    `Epithet: "${record.epithet}"`,
    `Status: ${statusText}`,
    attending
      ? `Party size: ${seats} (${record.plus_ones === 0 ? "just them" : `guest + ${record.plus_ones}`})`
      : "Party size: 0 (sending love from afar)",
    `Bounty: B$ ${bountyFormatted}-`,
    `Crew Flag: ${avatarInfo.label}`,
    record.message ? `Message: "${record.message}"` : "Message: (none)",
    ...(posterUrl ? [`Online Wanted Poster: ${posterUrl}`] : []),
    ...(attending ? [`Add to Google Calendar: ${calendarUrl}`] : []),
    "",
    `Event: ${EVENT_CONFIG.dateLong}`,
    `Baptismal: ${EVENT_CONFIG.baptismalTime} · ${EVENT_CONFIG.baptismalVenue} (${EVENT_CONFIG.baptismalMapUrl})`,
    `Reception: ${EVENT_CONFIG.receptionTime} · ${EVENT_CONFIG.venueDisplay} (${EVENT_CONFIG.venueMapUrl})`,
    `Dress Code: ${DRESS_CODE_COLORS.map((c) => c.name).join(", ")}`,
  ];

  const displayFont =
    "'Luckiest Guy', Impact, 'Arial Black', Arial, sans-serif";
  const bodyFont = "Nunito, 'Trebuchet MS', Arial, sans-serif";
  const wantedFont = "'Playfair Display', Georgia, 'Times New Roman', serif";

  const posterHtml = `
    <table role="presentation" width="340" align="center" cellpadding="0" cellspacing="0" style="width:100%; max-width:340px; margin:0 auto 24px; background-color:#ebd5a5; background-image:radial-gradient(circle at 50% 40%, #f4e6c3 0%, #ebd5a5 60%, #dcbf85 100%); border:3px solid #1b1b1f; box-shadow:6px 6px 0 #1b1b1f; font-family:${wantedFont}; color:#1b1b1f;">
      <tr>
        <td align="center" style="padding:16px 20px 18px; text-align:center;">
          <div style="font-size:44px; font-weight:900; line-height:1; letter-spacing:2px; color:#1b1b1f; margin:0 0 10px;">
            WANTED
          </div>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:3px solid #1b1b1f; background-color:#111111; margin:0 auto;">
            <tr>
              <td align="center" style="padding:0; text-align:center; background-color:#111111;">
                ${
                  hasAvatar
                    ? `<img src="cid:${AVATAR_CID}" alt="${escapeHtml(displayName)}" style="${
                        avatarInfo.isSelfie
                          ? "display:block; margin:0 auto; width:100%; max-height:245px; height:auto; object-fit:cover;"
                          : "display:block; margin:0 auto; max-width:100%; height:210px; width:auto;"
                      }" />`
                    : `<div style="height:180px; line-height:180px; color:#f6ead0; font-size:14px; font-weight:700;">${escapeHtml(avatarInfo.label)}</div>`
                }
              </td>
            </tr>
          </table>

          <div style="margin:12px 0 4px; font-size:17px; font-weight:700; letter-spacing:4px; color:#1b1b1f;">
            ${attending ? "DEAD OR ALIVE" : "IN SPIRIT"}
          </div>

          <div style="margin:4px 0 2px; font-size:13px; font-style:italic; color:#5a4630;">
            &ldquo;${escapeHtml(record.epithet)}&rdquo;
          </div>

          <div style="margin:0; font-size:${record.name.trim().length > 14 ? "20px" : "26px"}; font-weight:900; line-height:1.15; letter-spacing:1px; color:#1b1b1f; word-break:break-word;">
            ${escapeHtml(displayName)}
          </div>

          ${
            showNakama
              ? `<div style="margin:3px 0 0; font-size:13px; font-weight:700; color:#5a4630;">and ${record.plus_ones} nakama</div>`
              : ""
          }

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 0;">
            <tr>
              <td align="left" style="font-size:22px; font-weight:900; line-height:1; color:#1b1b1f; text-align:left;">
                &#3647; ${escapeHtml(bountyFormatted)}
              </td>
              <td align="right" style="font-size:22px; font-weight:900; line-height:1; color:#1b1b1f; text-align:right;">
                -
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 0; border-top:1px solid #9f8a64; padding-top:8px;">
            <tr>
              <td align="left" style="font-size:7px; text-transform:uppercase; line-height:1.25; color:#6b573b; text-align:left; padding-right:10px;">
                Kono sakuhin wa fiction desu node jitsuzai suru jinbutsu dantai sonota no soshiki to wa issai kankei arimasen. ${escapeHtml(EVENT_CONFIG.dateDisplay)} &middot; ${escapeHtml(EVENT_CONFIG.venueDisplay)}.
              </td>
              <td align="right" valign="bottom" style="font-size:12px; font-weight:900; letter-spacing:2px; color:#1b1b1f; text-align:right; white-space:nowrap;">
                MARINE
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const dressCodeHtml = DRESS_CODE_COLORS.map(
    (c) => `
      <td align="center" valign="top" style="padding:4px 5px; text-align:center;">
        <div style="width:24px; height:28px; margin:0 auto 4px; background-color:${c.hex}; border:2px solid #1b1b1f; border-radius:14px 14px 12px 12px; box-shadow:2px 2px 0 rgba(27,27,31,0.2);"></div>
        <div style="font-size:10px; font-weight:800; color:#1b1b1f; white-space:nowrap;">${escapeHtml(c.name)}</div>
      </td>
    `
  ).join("");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Nunito:wght@600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap" rel="stylesheet" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#082f5a; font-family:${bodyFont}; color:#1b1b1f;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; background-color:#082f5a;">
      <tr>
        <td align="center" style="padding:24px 10px;">
          <table role="presentation" width="580" align="center" cellpadding="0" cellspacing="0" style="width:100%; max-width:580px; margin:0 auto; border:3px solid #1b1b1f; border-radius:18px; overflow:hidden; box-shadow:7px 7px 0 #1b1b1f; background-color:#0d4a8a;">
            <tr>
              <td align="center" style="background-color:#5cc2f0; padding:22px 20px 24px; text-align:center;">
                ${
                  hasJollyRoger
                    ? `<table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:0 auto 12px; background-color:#9a6233; border:3px solid #1b1b1f; border-radius:10px; box-shadow:4px 4px 0 #1b1b1f;">
                        <tr>
                          <td align="center" style="padding:6px 14px;">
                            <img src="cid:${JOLLY_ROGER_CID}" alt="Straw Hat Jolly Roger" width="56" height="56" style="display:block; width:56px; height:56px; margin:0 auto;" />
                          </td>
                        </tr>
                      </table>`
                    : ""
                }

                <p style="margin:0 0 6px; font-size:12px; font-weight:800; letter-spacing:1.4px; text-transform:uppercase; color:#1b1b1f;">
                  ${escapeHtml(eyebrow)}
                </p>

                <h1 style="margin:0; font-family:${displayFont}; font-size:34px; font-weight:400; line-height:1.05; letter-spacing:1.5px; color:#ffcc1f; -webkit-text-stroke:1.5px #1b1b1f; text-shadow:-2px -2px 0 #1b1b1f, 2px -2px 0 #1b1b1f, -2px 2px 0 #1b1b1f, 2px 2px 0 #1b1b1f, 4px 4px 0 #1b1b1f;">
                  ${escapeHtml(headline)}
                </h1>

                <p style="margin:10px 0 14px; font-size:16px; font-weight:800; color:#1b1b1f;">
                  ${escapeHtml(record.name)}
                </p>

                <span style="display:inline-block; background-color:${attending ? "#e2312d" : "#1b1b1f"}; color:#fff8e6; font-size:12px; font-weight:800; letter-spacing:1px; padding:7px 16px; border:2px solid #1b1b1f; border-radius:999px; box-shadow:3px 3px 0 #1b1b1f;">
                  ${escapeHtml(badgeText)}
                </span>
              </td>
            </tr>

            <tr>
              <td style="height:12px; font-size:1px; line-height:12px; background-color:#d2ad72; background-image:repeating-linear-gradient(135deg, #d2ad72 0 7px, #9c7642 7px 14px); border-top:3px solid #1b1b1f; border-bottom:3px solid #1b1b1f;">
                &nbsp;
              </td>
            </tr>

            <tr>
              <td align="center" style="background-color:#0d4a8a; padding:26px 18px 28px; text-align:center;">
                ${posterHtml}

                <table role="presentation" width="480" align="center" cellpadding="0" cellspacing="0" style="width:100%; max-width:480px; margin:0 auto; background-color:#f6ead0; border:3px solid #1b1b1f; border-radius:14px; box-shadow:6px 6px 0 #1b1b1f; text-align:center;">
                  <tr>
                    <td align="center" style="padding:20px 18px; text-align:center;">
                      ${
                        hasDenDen
                          ? `<table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:0 auto 10px;">
                              <tr>
                                <td valign="middle" style="padding-right:10px;">
                                  <img src="cid:${DEN_DEN_CID}" alt="Den Den Mushi" width="38" height="38" style="display:block; width:38px; height:38px; border:2px solid #1b1b1f; border-radius:8px; background-color:#ffffff;" />
                                </td>
                                <td valign="middle" align="left" style="text-align:left;">
                                  <div style="font-size:12px; font-weight:800; font-style:italic; color:#8d5629;">Puru puru puru&hellip; gacha!</div>
                                  <div style="font-family:${displayFont}; font-size:18px; letter-spacing:0.6px; color:#1b1b1f;">${escapeHtml(greeting)}</div>
                                </td>
                              </tr>
                            </table>`
                          : ""
                      }

                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; margin:10px 0 0; border-collapse:collapse; background-color:#ffffff; border:2px solid #1b1b1f; border-radius:8px; text-align:left;">
                        <tr>
                          <td style="padding:9px 12px; font-size:12px; font-weight:800; border-bottom:1px solid #e5dec9; width:105px; color:#8d5629; text-transform:uppercase;">Status</td>
                          <td style="padding:9px 12px; font-size:13px; font-weight:800; border-bottom:1px solid #e5dec9; color:${attending ? "#0d4a8a" : "#e2312d"};">${escapeHtml(statusText)}</td>
                        </tr>
                        <tr>
                          <td style="padding:9px 12px; font-size:12px; font-weight:800; border-bottom:1px solid #e5dec9; color:#8d5629; text-transform:uppercase;">Epithet</td>
                          <td style="padding:9px 12px; font-size:13px; font-style:italic; font-weight:700; border-bottom:1px solid #e5dec9;">&ldquo;${escapeHtml(record.epithet)}&rdquo;</td>
                        </tr>
                        <tr>
                          <td style="padding:9px 12px; font-size:12px; font-weight:800; border-bottom:1px solid #e5dec9; color:#8d5629; text-transform:uppercase;">Bounty</td>
                          <td style="padding:9px 12px; font-size:13px; font-weight:800; border-bottom:1px solid #e5dec9;">&#3647; ${escapeHtml(bountyFormatted)}-</td>
                        </tr>
                        <tr>
                          <td style="padding:9px 12px; font-size:12px; font-weight:800; ${record.message ? "border-bottom:1px solid #e5dec9;" : ""} color:#8d5629; text-transform:uppercase;">Crew Flag</td>
                          <td style="padding:9px 12px; font-size:13px; font-weight:700; ${record.message ? "border-bottom:1px solid #e5dec9;" : ""}">${escapeHtml(avatarInfo.label)}</td>
                        </tr>
                        ${
                          record.message
                            ? `<tr>
                          <td style="padding:9px 12px; font-size:12px; font-weight:800; color:#8d5629; text-transform:uppercase; vertical-align:top;">Note</td>
                          <td style="padding:9px 12px; font-size:13px; font-weight:600; color:#1b1b1f;">&ldquo;${escapeHtml(record.message)}&rdquo;</td>
                        </tr>`
                            : ""
                        }
                      </table>

                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%; margin:14px 0 0; background-color:#ecd5a2; border:2px solid #1b1b1f; border-radius:10px; text-align:center;">
                        <tr>
                          <td align="center" style="padding:12px 12px; text-align:center;">
                            <div style="font-family:${displayFont}; font-size:15px; letter-spacing:0.6px; color:#1b1b1f; border-bottom:1px solid #bfa26a; padding-bottom:6px; margin-bottom:8px;">
                              ${escapeHtml(EVENT_CONFIG.dateLong)}
                            </div>
                            <div style="font-size:12px; line-height:1.6; font-weight:700; color:#1b1b1f;">
                              <strong style="color:#8d5629; text-transform:uppercase;">Baptismal:</strong> ${escapeHtml(EVENT_CONFIG.baptismalTime)} &middot;
                              <a href="${escapeHtml(EVENT_CONFIG.baptismalMapUrl)}" style="color:#1b1b1f; font-weight:800; text-decoration:underline;">${escapeHtml(EVENT_CONFIG.baptismalVenue)} &#8599;</a>
                              <br />
                              <strong style="color:#8d5629; text-transform:uppercase;">Reception:</strong> ${escapeHtml(EVENT_CONFIG.receptionTime)} &middot;
                              <a href="${escapeHtml(EVENT_CONFIG.venueMapUrl)}" style="color:#1b1b1f; font-weight:800; text-decoration:underline;">${escapeHtml(EVENT_CONFIG.venueDisplay)} &#8599;</a>
                            </div>
                          </td>
                        </tr>
                      </table>

                      <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:14px auto 0; text-align:center;">
                        <tr>
                          <td colspan="6" align="center" style="padding-bottom:6px; font-size:11px; font-weight:800; letter-spacing:1px; text-transform:uppercase; color:#8d5629;">
                            Crew Dress Code Palette
                          </td>
                        </tr>
                        <tr>
                          ${dressCodeHtml}
                        </tr>
                      </table>

                      <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:18px auto 2px;">
                        <tr>
                          ${
                            attending
                              ? `<td align="center" style="padding:4px 6px;">
                            <a href="${escapeHtml(calendarUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block; background-color:#ffcc1f; color:#1b1b1f; text-decoration:none; font-family:${displayFont}; font-size:14px; letter-spacing:0.7px; padding:10px 18px; border:3px solid #1b1b1f; border-radius:10px; box-shadow:3px 3px 0 #1b1b1f;">
                              ADD TO CALENDAR &#8599;
                            </a>
                          </td>`
                              : ""
                          }
                          ${
                            posterUrl
                              ? `<td align="center" style="padding:4px 6px;">
                            <a href="${escapeHtml(posterUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-block; background-color:#9a6233; background-image:linear-gradient(180deg, #b47a45 0%, #8d5629 100%); color:#fff8e6; text-decoration:none; font-family:${displayFont}; font-size:14px; letter-spacing:0.7px; padding:10px 18px; border:3px solid #1b1b1f; border-radius:10px; box-shadow:3px 3px 0 #1b1b1f;">
                              VIEW POSTER &#8599;
                            </a>
                          </td>`
                              : ""
                          }
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`.trim();

  return { subject, text: textLines.join("\n"), html };
}

/**
 * Sends RSVP notification emails in the background:
 * 1) Host notification email to SMTP_TO
 * 2) Optional guest confirmation email + .ics calendar reminder if guestEmail was provided
 */
export async function sendRsvpEmails(
  record: RsvpRecord,
  guestEmail?: string | null
): Promise<void> {
  const smtp = getSmtpConfig();
  if (!smtp) {
    console.warn("SMTP env vars not configured; skipping RSVP email notifications.");
    return;
  }

  const [avatarAttachment, jollyRogerAttachment, denDenAttachment] =
    await Promise.all([
      buildAvatarAttachment(record.avatar),
      readPublicPngAttachment("op-icons/jolly-roger.png", JOLLY_ROGER_CID),
      readPublicPngAttachment("op-icons/Phone.png", DEN_DEN_CID),
    ]);

  const cidAttachments = [
    avatarAttachment,
    jollyRogerAttachment,
    denDenAttachment,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  const posterUrl = buildPublicPosterUrl(record.id);
  const calendarUrl = buildGoogleCalendarUrl();
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  const sharedFlags = {
    record,
    posterUrl,
    calendarUrl,
    hasAvatar: Boolean(avatarAttachment),
    hasJollyRoger: Boolean(jollyRogerAttachment),
    hasDenDen: Boolean(denDenAttachment),
  };

  // Send host alert first
  try {
    const hostContent = buildThemedEmailMessage({ ...sharedFlags, role: "host" });
    await transporter.sendMail({
      from: `${EVENT_CONFIG.honoreeDisplay} Christening RSVP <${smtp.from}>`,
      to: smtp.to,
      subject: hostContent.subject,
      text: hostContent.text,
      html: hostContent.html,
      attachments: cidAttachments,
    });
  } catch (err) {
    console.error("Failed to send host RSVP notification email:", err);
  }

  // Send guest confirmation + calendar invite if guest entered their email
  const cleanGuestEmail = guestEmail?.trim();
  if (!cleanGuestEmail) return;

  try {
    const guestContent = buildThemedEmailMessage({
      ...sharedFlags,
      role: "guest",
    });
    const icsContent =
      record.attending === "yes"
        ? buildEventIcs(record.id, cleanGuestEmail)
        : null;

    await transporter.sendMail({
      from: `${EVENT_CONFIG.honoreeDisplay} Christening RSVP <${smtp.from}>`,
      to: cleanGuestEmail,
      replyTo: smtp.to,
      subject: guestContent.subject,
      text: guestContent.text,
      html: guestContent.html,
      attachments: cidAttachments,
      ...(icsContent
        ? {
            icalEvent: {
              filename: "einarr-christening.ics",
              method: "REQUEST",
              content: icsContent,
            },
          }
        : {}),
    });
  } catch (err) {
    console.error("Failed to send guest RSVP confirmation email:", err);
  }
}
