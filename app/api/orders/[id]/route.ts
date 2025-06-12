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
        // console.log("ORDER:", order);

        let subject = '';
        let msg = '';

        if (updates.status === 'glass_arrived') {
            subject = 'Your Lenses Have Arrived!';
            msg = `Hi ${order.customer_data.name},
        
        We’re excited to let you know that your lenses have arrived at Nain Opticals and are currently being fitted into your frame.
        
        We’ll notify you again as soon as your glasses are ready for collection.
        
        Warm regards,  
        Team Nain Opticals`;
        }

        if (updates.status === 'fitted') {
            subject = 'Your Glasses Are Ready for Pickup!';
            msg = `Hi ${order.customer_data.name},
        
        Great news! Your glasses are now ready for pickup at Nain Opticals.
        
        Feel free to visit the store anytime during our working hours. We look forward to seeing you!
        
        Warm regards,  
        Team Nain Opticals`;
        }

        if (updates.status === 'completed') {
            subject = 'Thank You for Your Order!';
            msg = `Hi ${order.customer_data.name},
        
        Your order has been successfully completed.
        
        Thank you for choosing Nain Opticals. You can download your invoice here:  
        [invoice link]
        
        If you have any questions or require adjustments, feel free to reach out.
        
        Best wishes,  
        Team Nain Opticals`;
        }



        await sendEmail(order.customer_data.email, subject, msg);
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