import nodemailer from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export async function POST(req) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim().slice(0, 100);
    const email = String(body?.email ?? "").trim().slice(0, 200);

    if (!name || !email) {
      return Response.json(
        { success: false, message: "Name and email are required" },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email)) {
      return Response.json(
        { success: false, message: "Please enter a valid email" },
        { status: 400 }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"AfterRender Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
      replyTo: { name, address: email },
      subject: `New quote request from ${name.replace(/[\r\n]+/g, " ")}`,
      text: `New quote request from the AfterRender website footer.\n\nName: ${name}\nEmail: ${email}`,
      html: `
        <p>New quote request from the AfterRender website footer.</p>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to send email" }),
      { status: 500 }
    );
  }
}
