// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { deleteOrder, getOrderById, updateOrder } from "@/lib/orders";
import { sendEmail } from "@/lib/sendEmail";
import { sendSMS } from "@/lib/sendSMS";


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id;

    try {
        const data = await getOrderById(id);

        if (!data) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const updates = await req.json();

    try {
        const updated = await updateOrder(id, updates);

        if (!updated) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (
            updates.status === 'glass_arrived' ||
            updates.status === 'fitted' ||
            updates.status === 'completed'
        ) {
            const order = updated;

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

            if (updates.status === 'completed') {
                subject = 'Thank You for Your Order!';
                msg = `Hi ${order.customer_data.name}, your order is complete. Thanks for choosing us! - NainOpticals`;
            }


            if (subject && msg) {
                await sendEmail(order.customer_data.email, subject, msg);
            }

            // SMS notifications disabled completely (Twilio account suspended)
            // const rawPhone = order.customer_data.phone;
            // if (rawPhone) {
            //     const cleanNumber = rawPhone.replace(/\D/g, '');
            //     if (cleanNumber.length === 10) {
            //         await sendSMS(cleanNumber, msg);
            //     } else {
            //         console.warn("Invalid phone number for SMS:", rawPhone);
            //     }
            // } else {
            //     console.warn("No phone number provided for SMS:", order.customer_data);
            // }
        }

        return NextResponse.json({ message: 'Order updated' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}


// DELETE order by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const id = (await params).id;

    try {
        await deleteOrder(id);
        return NextResponse.json({ message: 'Order deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
