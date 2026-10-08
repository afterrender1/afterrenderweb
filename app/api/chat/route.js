import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, email, message } = body;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please fill out all required fields: Name, E-mail, and Message.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"AfterRender Chat" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL || "myrender07@gmail.com",
      replyTo: email || undefined,
      subject: `💬 New Chat Inquiry from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #070B11; margin: 0; padding: 20px; }
            .container { max-width: 560px; margin: 0 auto; background: #0F172A; border-radius: 14px; border: 1px solid #1E293B; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .header { background: linear-gradient(135deg, #0B1528 0%, #172554 100%); padding: 24px 28px; border-bottom: 1px solid #1E293B; }
            .header h2 { margin: 0; color: #48A2FF; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
            .header p { margin: 6px 0 0; color: #94A3B8; font-size: 13px; }
            .content { padding: 24px 28px; color: #F1F5F9; }
            .field-row { margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid #1E293B; }
            .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; color: #64748B; font-weight: 600; margin-bottom: 4px; }
            .value { font-size: 15px; color: #E2E8F0; font-weight: 500; }
            .message-box { background: #070B11; border-left: 3px solid #48A2FF; border-radius: 8px; padding: 14px 16px; margin-top: 8px; font-size: 14px; line-height: 1.6; color: #F8FAFC; white-space: pre-wrap; }
            .footer { padding: 18px 28px; background: #070B11; border-top: 1px solid #1E293B; font-size: 12px; color: #64748B; }
            .badge { display: inline-block; background: #1E293B; color: #7DD3FC; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Floating Chat Question</h2>
              <p>Submitted via AfterRender Website Live Chat Widget</p>
            </div>
            <div class="content">
              <div class="field-row">
                <div class="label">Name</div>
                <div class="value">${escapeHtml(name)}</div>
              </div>
              <div class="field-row">
                <div class="label">Email Address</div>
                <div class="value">
                  ${email ? `<a href="mailto:${escapeHtml(email)}" style="color: #48A2FF; text-decoration: none;">${escapeHtml(email)}</a>` : '<span style="color:#64748B;">Not provided</span>'}
                </div>
              </div>
              <div class="field-row">
                <div class="label">Phone Number</div>
                <div class="value">
                  ${phone ? `<a href="tel:${escapeHtml(phone)}" style="color: #48A2FF; text-decoration: none;">${escapeHtml(phone)}</a>` : '<span style="color:#64748B;">Not provided</span>'}
                </div>
              </div>
              <div class="field-row" style="border-bottom: none; margin-bottom: 0; padding-bottom: 0;">
                <div class="label">Question / Message</div>
                <div class="message-box">${escapeHtml(message || "I want to know more")}</div>
              </div>
            </div>
            <div class="footer">
              <span class="badge">CONSENT RECORDED</span>
              <p style="margin: 8px 0 0; font-size: 11px; color: #475569;">
                User agreed to receive SMS or e-mails for the provided channel.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Your question has been sent successfully!",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to send message. Please try again later.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
