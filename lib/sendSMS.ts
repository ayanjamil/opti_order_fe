// /lib/sendSMS.ts
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER as string;

const client = twilio(accountSid, authToken);

export async function sendSMS(to: string, message: string) {
    try {
        const response = await client.messages.create({
            body: message,
            from: twilioPhone,
            to: `+91${to}`, // assuming Indian numbers
        });
        console.log("📤 SMS sent:", response.sid);
    } catch (error: any) {
        console.error("❌ SMS error:", error.message);
    }
}
