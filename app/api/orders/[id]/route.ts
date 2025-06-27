// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { sendEmail } from "@/lib/sendEmail";
import { sendSMS } from "@/lib/sendSMS"; // ✅ Add this at top with other imports


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id;

    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
}


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const updates = await req.json();

    const { data: updated, error: updateError } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id);

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    if (
        updates.status === 'glass_arrived' ||
        updates.status === 'fitted' ||
        updates.status === 'completed'
    ) {
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select()
            .eq('id', id)
            .single();

        if (fetchError) {
            return NextResponse.json({ error: fetchError.message }, { status: 500 });
        }

        let subject = '';
        let msg = '';

        if (updates.status === 'glass_arrived') {
            subject = 'Your Lenses Have Arrived!';
            msg = `Hi ${order.customer_data.name}, your lenses are in! We'll notify you once fitting is done. - NainOpticals`;
        }

        if (updates.status === 'fitted') {
            subject = 'Your Glasses Are Ready for Pickup!';
            msg = `Hi ${order.customer_data.name}, your glasses are ready! Pick them up anytime. - NainOpticals`;
        }

        // if (updates.status === 'completed') {
        //     subject = 'Thank You for Your Order!';
        //     msg = `Hi ${order.customer_data.name}, your order is complete. Thanks for choosing us! - NainOpticals`;
        // }


        // ✅ Send Email
        await sendEmail(order.customer_data.email, subject, msg);

        // ✅ Send SMS
        const rawPhone = order.customer_data.phone;
        if (rawPhone) {
            const cleanNumber = rawPhone.replace(/\D/g, '');
            if (cleanNumber.length === 10) {
                // const withCountryCode = "+91" + cleanNumber;
                await sendSMS(cleanNumber, msg);
            } else {
                console.warn("⚠️ Invalid phone number for SMS:", rawPhone);
            }
        } else {
            console.warn("⚠️ No phone number provided for SMS:", order.customer_data);
        }
    }

    return NextResponse.json({ message: 'Order updated' });
}


// DELETE order by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id;

    const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
}