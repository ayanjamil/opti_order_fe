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
        customer_data,
        purchase_details, // frames[], glasses[], advance_paid
        power_details
    } = body;

    // Calculate frame and glass totals
    const frameTotal = purchase_details.frames?.reduce(
        (sum: number, frame: any) => sum + frame.price * (frame.quantity || 1),
        0
    ) || 0;

    const glassTotal = purchase_details.glasses?.reduce(
        (sum: number, glass: any) => sum + glass.price * (glass.quantity || 1),
        0
    ) || 0;

    const total_amount = frameTotal + glassTotal;
    purchase_details.total_amount = total_amount;

    const { data, error } = await supabase
        .from("orders")
        .insert([
            {
                customer_data,
                purchase_details,
                power_details,
                status: "pending"
            }
        ])
        .select();

    if (error) {
        return NextResponse.json({ error }, { status: 400 });
    }

    const order = data[0];
    const remaining = total_amount - purchase_details.advance_paid;

    await sendEmail(
        customer_data.email,
        "Your Order at NainOpticals is Confirmed!",
        `Hey ${customer_data.name},\n\nYour order has been placed!\nOrder ID: ${order.id}\nTotal: ₹${total_amount}\nAdvance Paid: ₹${purchase_details.advance_paid}\nRemaining: ₹${remaining}`
    );

    return NextResponse.json({ data: order });
}
