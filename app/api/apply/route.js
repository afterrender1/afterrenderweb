import nodemailer from "nodemailer";

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, phone, portfolio, about, roles, frontendTech, backendTech, software } = body;

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Prepare HTML content dynamically
        const roleList = roles.join(", ") || "N/A";
        const frontendList = frontendTech.join(", ") || "N/A";
        const backendList = backendTech.join(", ") || "N/A";
        const softwareList = software.join(", ") || "N/A";

        const mailOptions = {
            from: `"AfterRender Applications" <${process.env.EMAIL_USER}>`,
            to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
            subject: `New Job Application - ${roleList}`,
            html: `
        <h2>New Application Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Portfolio:</strong> ${portfolio || "N/A"}</p>
        <p><strong>Roles Applied For:</strong> ${roleList}</p>
        <p><strong>Frontend Skills:</strong> ${frontendList}</p>
        <p><strong>Backend Skills:</strong> ${backendList}</p>
        <p><strong>Video/Software Skills:</strong> ${softwareList}</p>
        <p><strong>About Applicant:</strong><br/>${about}</p>
      `,
        };

        await transporter.sendMail(mailOptions);

        return new Response(
            JSON.stringify({ success: true, message: "Application sent successfully!" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending application email:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Failed to send application" }),
            { status: 500 }
        );
    }
}
