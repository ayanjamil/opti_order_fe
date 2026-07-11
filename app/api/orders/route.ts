// /app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createOrder, listOrders } from "@/lib/orders";

export async function GET(req: NextRequest) {
    try {
        const data = await listOrders();
        return NextResponse.json({ data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const order = await createOrder(body);

        return NextResponse.json({ data: order });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
