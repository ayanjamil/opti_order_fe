// /app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
// import supabase from "@/lib/supabaseClient";
// import sendEmail from "@/lib/sendEmail"; // make sure paths are right
import { supabase } from "@/lib/supabaseClient";
import { sendEmail } from "@/lib/sendEmail";

export async function GET(req: NextRequest) {
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("order_date", { ascending: false });

    if (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const {
        customer_name,
        phone_number,
        email,
        frame_price,
        glass_price,
        advance_paid,
        power_details, // full object from frontend
    } = body;

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
                power_details, // storing nested object
            },
        ])
        .select();

    if (error) {
        return NextResponse.json({ error }, { status: 400 });
    }

    const order = data[0];
    const remainingAmount = total_amount - advance_paid;

    const subject = "Your Order at NainOpticals is Confirmed!";
    const msg = `Hey ${order.customer_name},\n\nYour order has been placed!\nOrder ID: ${order.id}\nTotal: ₹${total_amount}\nAdvance Paid: ₹${advance_paid}\nRemaining: ₹${remainingAmount}`;

    await sendEmail(email, subject, msg);

    return NextResponse.json({ data: order });
}
