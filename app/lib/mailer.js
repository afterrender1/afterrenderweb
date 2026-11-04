import nodemailer from "nodemailer";

// Gmail transport, same credentials as the contact forms (EMAIL_USER / EMAIL_PASS app password).
let transporter = global._authMailTransporter;

const getTransporter = () => {
    if (transporter) return transporter;
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("EMAIL_USER / EMAIL_PASS are not configured");
    }
    transporter = global._authMailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    return transporter;
};

const escapeHtml = (value) =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

// Simple, email-client-safe layout (tables + inline styles).
const layout = ({ heading, intro, buttonLabel, url, footnote }) => `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f6fa;font-family:Arial,Helvetica,sans-serif;color:#0A2540;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6fa;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#ffffff;border-radius:14px;padding:36px 32px;">
            <tr>
              <td>
                <p style="margin:0 0 24px;font-size:20px;font-weight:700;letter-spacing:0.3px;">AfterRender</p>
                <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;">${heading}</h1>
                <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#425466;">${intro}</p>
                <a href="${escapeHtml(url)}" style="display:inline-block;background:#48A2FF;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 26px;border-radius:10px;">${buttonLabel}</a>
                <p style="margin:28px 0 8px;font-size:13px;line-height:1.6;color:#6b7c93;">If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="margin:0 0 24px;font-size:12px;line-height:1.5;word-break:break-all;color:#48A2FF;">${escapeHtml(url)}</p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7c93;">${footnote}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const send = ({ to, subject, html, text }) =>
    getTransporter().sendMail({
        from: `"AfterRender" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text,
    });

export const sendVerificationEmail = ({ to, name, url }) => {
    const greeting = name ? `Hi ${escapeHtml(name)}, thanks` : "Thanks";
    return send({
        to,
        subject: "Verify your email - AfterRender",
        html: layout({
            heading: "Verify your email",
            intro: `${greeting} for signing up! Please confirm your email address to activate your account.`,
            buttonLabel: "Verify email",
            url,
            footnote: "This link expires in 24 hours. If you didn't create an AfterRender account, you can safely ignore this email.",
        }),
        text: `Verify your AfterRender email: ${url}\n\nThis link expires in 24 hours. If you didn't sign up, ignore this email.`,
    });
};

// Someone tried to sign up with an email that already has an account. The sign-up form
// shows the same "check your email" screen either way (so it can't be used to discover
// registered emails); the real owner gets this note instead.
export const sendExistingAccountEmail = ({ to, name, url }) => {
    const greeting = name ? `Hi ${escapeHtml(name)}, someone` : "Someone";
    return send({
        to,
        subject: "You already have an AfterRender account",
        html: layout({
            heading: "You already have an account",
            intro: `${greeting} (hopefully you) just tried to sign up with this email, but an AfterRender account already exists for it. Just log in instead. If you forgot your password, use "Forgot password?" on the login page.`,
            buttonLabel: "Log in",
            url,
            footnote: "If this wasn't you, you can safely ignore this email. Your account is unchanged.",
        }),
        text: `You already have an AfterRender account. Log in here: ${url}\n\nIf this wasn't you, ignore this email.`,
    });
};

export const sendPasswordResetEmail =({ to, name, url }) => {
    const greeting = name ? `Hi ${escapeHtml(name)}, we` : "We";
    return send({
        to,
        subject: "Reset your password - AfterRender",
        html: layout({
            heading: "Reset your password",
            intro: `${greeting} received a request to reset the password for your AfterRender account. Click the button below to choose a new one.`,
            buttonLabel: "Reset password",
            url,
            footnote: "This link expires in 1 hour and can only be used once. If you didn't request a password reset, you can safely ignore this email. Your password won't change.",
        }),
        text: `Reset your AfterRender password: ${url}\n\nThis link expires in 1 hour. If you didn't request it, ignore this email.`,
    });
};
