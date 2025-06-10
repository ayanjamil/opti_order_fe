// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { sendEmail } from "@/lib/sendEmail";

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
    // const { id } = context.params; // Accessing 'id' from params
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
            subject = 'Your Lenses have arrived!';
            msg = `Hi ${order.customer_name},
  
  Your lenses have arrived and are now being fitted at Nain Opticals!
  We will inform you when they are ready to be taken.
  
  Best,
  Nain Opticals Team`;
        }

        if (updates.status === 'fitted') {
            subject = 'Your Glasses are Ready!';
            msg = `Hi ${order.customer_name},
  
  Your glasses are now ready for fitting at Nain Opticals!
  Please feel free to visit the store anytime today.
  
  Best,
  Nain Opticals Team`;
        }

        if (updates.status === 'completed') {
            subject = 'Thanks for the order';
            msg = `Hi ${order.customer_name},
  
  Your Order was completed.
  Here is the invoice:
  [link to invoice]
  
  Best,
  Nain Opticals Team`;
        }

        await sendEmail(order.email, subject, msg);
    }

    return NextResponse.json({ message: 'Order updated' });
}