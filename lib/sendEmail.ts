// /lib/sendEmail.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendEmail(to: string, subject: string, text: string) {
    try {
        const info = await transporter.sendMail({
            from: `"NainOpticals" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });
        console.log("Email sent:", info.response);
    } catch (error: any) {
        console.error("Email error:", error.message);
    }
}
