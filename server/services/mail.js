const nodemailer = require('nodemailer');

/** Prefer IPv4 for SMTP — avoids hangs to smtp.gmail.com on some cloud networks (Node 17+). */
try {
  const dns = require('dns');
  if (typeof dns.setDefaultResultOrder === 'function') {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch (_) {
  /* ignore */
}

/**
 * Optional: Resend (HTTPS). Add RESEND_API_KEY on Render — used automatically if Gmail fails.
 * https://resend.com
 */
function isResendConfigured() {
  return !!(process.env.RESEND_API_KEY && String(process.env.RESEND_API_KEY).trim());
}

/**
 * Gmail uses an App Password (still connects to smtp.gmail.com — that is SMTP).
 * Env: GMAIL_USER + GMAIL_APP_PASSWORD
 */
function isGmailConfigured() {
  const pass =
    process.env.GMAIL_APP_PASSWORD ||
    process.env.GMAIL_APP_PASS ||
    '';
  return !!(process.env.GMAIL_USER && pass.replace(/\s/g, ''));
}

function isSmtpConfigured() {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
}

function isMailConfigured() {
  return isResendConfigured() || isGmailConfigured() || isSmtpConfigured();
}

function getGmailAppPassword() {
  const raw =
    process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASS || '';
  return raw.replace(/\s/g, '');
}

const SMTP_POOL_OPTIONS = {
  connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 60000),
  greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS || 30000),
  socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT_MS || 60000),
  family: 4,
};

function gmailAuth() {
  return {
    user: process.env.GMAIL_USER.trim(),
    pass: getGmailAppPassword(),
  };
}

/** Try SSL (465) first; many clouds work better with STARTTLS (587). */
function createGmailTransport465() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: gmailAuth(),
    ...SMTP_POOL_OPTIONS,
    tls: { servername: 'smtp.gmail.com' },
  });
}

function createGmailTransport587() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: gmailAuth(),
    ...SMTP_POOL_OPTIONS,
    tls: { servername: 'smtp.gmail.com' },
  });
}

/**
 * Send via Gmail App Password: try port 465, then 587.
 */
async function sendMailViaGmailAppPassword(mailOptions) {
  const from = nodemailerFromHeader();
  const payload = { ...mailOptions, from };
  const t465 = createGmailTransport465();
  try {
    await t465.sendMail(payload);
    return;
  } catch (e1) {
    console.warn('[mail] Gmail :465 failed, retrying :587 STARTTLS…', e1.message);
  }
  const t587 = createGmailTransport587();
  await t587.sendMail(payload);
}

function getNonGmailSmtpTransporter() {
  if (!isSmtpConfigured()) return null;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    ...SMTP_POOL_OPTIONS,
  });
}

function getResendFrom() {
  const name = (process.env.MAIL_FROM_NAME || 'RevoraX').replace(/"/g, '');
  const addr =
    process.env.MAIL_FROM ||
    process.env.RESEND_FROM_EMAIL ||
    'onboarding@resend.dev';
  return `${name} <${addr}>`;
}

async function sendViaResend({ to, subject, html, text }) {
  const key = process.env.RESEND_API_KEY.trim();
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: getResendFrom(),
      to: Array.isArray(to) ? to : [to],
      subject,
      html: html || undefined,
      text: text || undefined,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data.message ||
      (typeof data === 'object' && data.error?.message) ||
      JSON.stringify(data) ||
      res.statusText;
    throw new Error(msg);
  }
  return data;
}

function formatRole(role) {
  if (!role) return 'Member';
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function buildInviteEmailHtml({
  recipientName,
  companyName,
  role,
  inviteUrl,
  expiresInHours = 24,
}) {
  const safeName = escapeHtml(recipientName || 'there');
  const safeCompany = escapeHtml(companyName || 'your team');
  const safeRole = escapeHtml(formatRole(role));
  const safeUrl = escapeHtml(inviteUrl);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're invited to RevoraX</title>
</head>
<body style="margin:0;padding:0;background-color:#F0F9FF;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F9FF;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #CAF0F8;">
          <tr>
            <td style="background-color:#0077B6;padding:28px 32px;text-align:left;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <p style="margin:0;font-size:20px;font-weight:700;color:#FFFFFF;letter-spacing:-0.02em;">RevoraX</p>
                    <p style="margin:6px 0 0;font-size:12px;color:#CAF0F8;font-weight:500;">Product lifecycle & change management</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px;">
              <p style="margin:0;font-size:18px;font-weight:600;color:#03045E;line-height:1.35;">You're invited, ${safeName}</p>
              <p style="margin:14px 0 0;font-size:15px;color:#0077B6;line-height:1.55;">
                <strong style="color:#03045E;">${safeCompany}</strong> has invited you to join their workspace on <strong style="color:#03045E;">RevoraX</strong>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="background-color:#EAF6FB;border-radius:10px;border:1px solid #90E0EF;width:100%;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#0077B6;text-transform:uppercase;letter-spacing:0.08em;">Your role</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#03045E;">${safeRole}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;text-align:center;">
              <a href="${safeUrl}" style="display:inline-block;background-color:#0077B6;color:#FFFFFF;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;border:1px solid #0077B6;">Accept invitation</a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;">
              <p style="margin:0;font-size:12px;color:#90E0EF;line-height:1.6;">
                Or paste this link into your browser:<br>
                <span style="color:#0077B6;word-break:break-all;">${safeUrl}</span>
              </p>
              <p style="margin:16px 0 0;font-size:12px;color:#90E0EF;">
                This link expires in <strong style="color:#03045E;">${expiresInHours} hours</strong>. If you didn't expect this email, you can ignore it.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#F0F9FF;padding:20px 32px;border-top:1px solid #CAF0F8;">
              <p style="margin:0;font-size:11px;color:#90E0EF;text-align:center;line-height:1.5;">
                Sent by RevoraX · Engineering change & master data in one place
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildInviteEmailText({
  recipientName,
  companyName,
  role,
  inviteUrl,
  expiresInHours = 24,
}) {
  const name = recipientName || 'there';
  const co = companyName || 'your team';
  return [
    `Hi ${name},`,
    '',
    `${co} has invited you to join their workspace on RevoraX (product lifecycle & change management).`,
    '',
    `Role: ${formatRole(role)}`,
    '',
    `Accept your invitation (expires in ${expiresInHours} hours):`,
    inviteUrl,
    '',
    "If you didn't expect this email, you can ignore it.",
    '',
    '— RevoraX',
  ].join('\n');
}

function nodemailerFromHeader() {
  const fromName = process.env.MAIL_FROM_NAME || 'RevoraX';
  const fromAddr =
    process.env.MAIL_FROM ||
    process.env.GMAIL_USER ||
    process.env.SMTP_USER;
  const from = `"${fromName.replace(/"/g, '')}" <${fromAddr}>`;
  return from;
}

function inviteMailNotConfiguredError() {
  return {
    sent: false,
    error:
      'Email not configured on the server. In Render → Environment, set GMAIL_USER + GMAIL_APP_PASSWORD (same as local), or RESEND_API_KEY. Invites still work — copy the link from the response.',
  };
}

function inviteMailSendFailedError(lastErr) {
  const hint = isResendConfigured()
    ? ' Resend also failed — check API key and sender domain.'
    : ' On Render, Gmail often blocks or times out from the cloud — add RESEND_API_KEY in Render (free tier) as a backup; local Gmail can stay as-is.';
  return {
    sent: false,
    error: `Email could not be sent (${lastErr?.message || 'unknown'}).${hint} Copy the invite link below.`,
  };
}

/**
 * Order: 1) Gmail App Password (465 → 587), 2) Resend if Gmail failed and key set, 3) Resend only, 4) generic SMTP.
 */
async function sendInviteEmail({
  to,
  recipientName,
  companyName,
  role,
  inviteUrl,
  expiresInHours = 24,
}) {
  const subject = `${companyName ? `${companyName} · ` : ''}You're invited to RevoraX`;
  const text = buildInviteEmailText({
    recipientName,
    companyName,
    role,
    inviteUrl,
    expiresInHours,
  });
  const html = buildInviteEmailHtml({
    recipientName,
    companyName,
    role,
    inviteUrl,
    expiresInHours,
  });
  const mailPayload = { to, subject, text, html };

  if (isGmailConfigured()) {
    try {
      await sendMailViaGmailAppPassword(mailPayload);
      return { sent: true };
    } catch (err) {
      console.error('[mail] Gmail App Password send failed:', err.message);
      if (isResendConfigured()) {
        try {
          await sendViaResend(mailPayload);
          console.log('[mail] Sent via Resend (fallback after Gmail failed).');
          return { sent: true };
        } catch (err2) {
          console.error('[mail] Resend fallback failed:', err2.message);
          return inviteMailSendFailedError(err2);
        }
      }
      return inviteMailSendFailedError(err);
    }
  }

  if (isResendConfigured()) {
    try {
      await sendViaResend(mailPayload);
      return { sent: true };
    } catch (err) {
      console.error('[mail] sendInviteEmail (Resend) failed:', err.message);
      return inviteMailSendFailedError(err);
    }
  }

  const smtp = getNonGmailSmtpTransporter();
  if (!smtp) {
    return inviteMailNotConfiguredError();
  }

  const from = nodemailerFromHeader();
  try {
    await smtp.sendMail({ ...mailPayload, from });
    return { sent: true };
  } catch (err) {
    console.error('[mail] SMTP send failed:', err.message);
    return inviteMailSendFailedError(err);
  }
}

async function sendPlainEmail({ to, subject, text, html }) {
  const mailPayload = { to, subject, text, html };

  if (isGmailConfigured()) {
    try {
      await sendMailViaGmailAppPassword(mailPayload);
      return { sent: true };
    } catch (err) {
      console.error('[mail] Gmail send failed:', err.message);
      if (isResendConfigured()) {
        try {
          await sendViaResend({
            to,
            subject,
            text: text || '',
            html: html || text || '',
          });
          return { sent: true };
        } catch (_) {
          return { sent: false };
        }
      }
      return { sent: false };
    }
  }

  if (isResendConfigured()) {
    try {
      await sendViaResend({
        to,
        subject,
        text: text || '',
        html: html || text || '',
      });
      return { sent: true };
    } catch (err) {
      console.error('[mail] sendPlainEmail (Resend) failed:', err.message);
      return { sent: false };
    }
  }

  const smtp = getNonGmailSmtpTransporter();
  if (!smtp) {
    return { sent: false };
  }
  const from = nodemailerFromHeader();
  try {
    await smtp.sendMail({
      from,
      to,
      subject,
      text: text || '',
      html: html || text || '',
    });
    return { sent: true };
  } catch (err) {
    console.error('[mail] sendPlainEmail failed:', err.message);
    return { sent: false };
  }
}

module.exports = {
  isMailConfigured,
  sendInviteEmail,
  sendPlainEmail,
};
