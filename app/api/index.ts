// pages/api/orders/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
// import { supabase } from "../../../lib/supabaseClient";
import { supabase } from "@/lib/supabaseClient";
// import { sendEmail } from "../../../lib/sendEmail";
import { sendEmail } from "@/lib/sendEmail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        // Get all orders
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("order_date", { ascending: false });

        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json({ data });
    }

    if (req.method === "POST") {
        const {
            customer_name,
            phone_number,
            email,
            frame_price,
            glass_price,
            advance_paid,
        } = req.body;

        const total_amount = Number(frame_price) + Number(glass_price);

        const { data, error } = await supabase
            .from("orders")
            .insert([
                {
                    customer_name,
                    phone_number,
                    email,
                    frame_price,
                    glass_price,
                    advance_paid,
                    total_amount,
                    status: "pending",
                },
            ])
            .select();

        if (error) return res.status(400).json({ error: error.message });

        const order = data[0];

        const remainingAmount = order.total_amount - order.advance_paid;

        const subject = "Your Order at NainOpticals is Confirmed!";
        const msg = `Hey ${order.customer_name},

Thanks for placing your order at NainOpticals! 🎉

Here are your order details:
- Order ID: ${order.id}
- Total Amount: ₹${order.total_amount}
- Advance Paid: ₹${order.advance_paid}
- Remaining Amount: ₹${remainingAmount}

We’ll keep you updated once your lenses are ready.

Thank you for choosing us!

Warm regards,  
NainOpticals Team`;

        await sendEmail(order.email, subject, msg);

        console.log("Order created:", order);
        return res.status(200).json({ data: order });
    }

    // Method not allowed
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
