// pages/api/orders/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
// import { supabase } from "../../../lib/supabaseClient";
// import { sendEmail } from "../../../lib/sendEmail";
import { supabase } from "@/lib/supabaseClient";
import { sendEmail } from "@/lib/sendEmail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== "string") {
        return res.status(400).json({ error: "Invalid order ID" });
    }

    if (req.method === "PATCH") {
        const updates = req.body;

        const { data: updated, error: updateError } = await supabase
            .from("orders")
            .update(updates)
            .eq("id", id);

        if (updateError) return res.status(400).json({ error: updateError.message });

        // Status-based email logic
        if (
            updates.status === "glass_arrived" ||
            updates.status === "fitted" ||
            updates.status === "completed"
        ) {
            const { data: order, error: fetchError } = await supabase
                .from("orders")
                .select()
                .eq("id", id)
                .single();

            if (fetchError) return res.status(500).json({ error: fetchError.message });

            let msg = "";
            let subject = "";

            if (updates.status === "glass_arrived") {
                subject = "Your Lenses have arrived!";
                msg = `Hi ${order.customer_name},

Your lenses have arrived and are now being fitted at Nain Opticals!  
We will inform you when they are ready to be taken.

Thank you for choosing us!

Best,  
Nain Opticals Team`;
            }

            if (updates.status === "fitted") {
                subject = "Your Glasses are Ready!";
                msg = `Hi ${order.customer_name},

Your glasses are now ready for fitting at Nain Opticals!  
Please feel free to visit the store anytime today.

Thank you for choosing us!

Best,  
Nain Opticals Team`;
            }

            if (updates.status === "completed") {
                subject = "Thanks for the order";
                msg = `Hi ${order.customer_name},

Your Order was completed. 
Here are the invoice for that order:
[link to invoice]

Thank you for choosing us!

Best,  
Nain Opticals Team`;
            }

            await sendEmail(order.email, subject, msg);
        }

        return res.status(200).json({ message: "Order updated" });
    }

    res.setHeader("Allow", ["PATCH"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
