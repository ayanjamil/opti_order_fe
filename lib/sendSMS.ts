// /lib/sendSMS.ts
import twilio from "twilio";

export async function sendSMS(to: string, message: string) {
    const enableSMS = process.env.ENABLE_SMS === "true";
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!enableSMS || !accountSid || !authToken || !twilioPhone) {
        console.log("⚠️ SMS notifications are currently disabled (Twilio account suspended or config missing).");
        console.log(`📤 Simulated SMS to +91${to}: "${message}"`);
        return;
    }

    try {
        const client = twilio(accountSid, authToken);
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
