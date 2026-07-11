// /lib/sendEmail.ts
import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, text: string) {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
        console.log("⚠️ Email notifications are currently disabled (EMAIL_USER or EMAIL_PASS missing).");
        console.log(`✉️ Simulated Email to ${to}:`);
        console.log(`   Subject: ${subject}`);
        console.log(`   Body: ${text}`);
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });

        const info = await transporter.sendMail({
            from: `"NainOpticals" <${emailUser}>`,
            to,
            subject,
            text,
        });
        console.log("📨 Email sent:", info.response);
    } catch (error: any) {
        console.error("❌ Email error:", error.message);
    }
}
