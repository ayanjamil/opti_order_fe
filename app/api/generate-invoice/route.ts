// /app/api/generate-invoice/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
// import fetch from "node-fetch"; // Optional: only for loading external logo

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const order = body.data;

        if (!order || !order.id) {
            return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
        }

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]); // A4
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        let y = 800;

        const drawText = (text: string, x: number, y: number, size = 11, bold = false) => {
            page.drawText(text, {
                x,
                y,
                size,
                font: bold ? boldFont : font,
                color: rgb(0, 0, 0),
            });
        };

        const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
            page.drawLine({
                start: { x: x1, y: y1 },
                end: { x: x2, y: y2 },
                thickness: 0.5,
                color: rgb(0.6, 0.6, 0.6),
            });
        };

        // Optional: Add Logo (ensure it's a base64 PNG or hosted image)
        // const logoUrl = "https://yourdomain.com/logo.png";
        // const logoBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
        // const logoImage = await pdfDoc.embedPng(logoBytes);
        // page.drawImage(logoImage, { x: 50, y: y - 60, width: 100, height: 40 });
        // y -= 70;

        // Company Header
        drawText("NAIN OPTICALS", 220, y, 18, true);
        y -= 20;
        drawText("132 Street Name, City - 560001", 200, y);
        y -= 15;
        drawText("GSTIN: 07AAFD8457JU3 | contact@nainopticals.in", 170, y);
        y -= 30;

        // Invoice Details
        drawText(`Invoice No: ${order.id.slice(0, 8)}`, 50, y);
        drawText(`Date: ${new Date(order.order_date).toLocaleDateString()}`, 400, y);
        y -= 25;

        // Customer Info
        drawLine(50, y, 545, y); y -= 15;
        drawText("Bill To:", 50, y, 12, true); y -= 15;
        drawText(`Name: ${order.customer_name}`, 50, y);
        drawText(`Phone: ${order.phone_number}`, 300, y); y -= 15;
        drawText(`Email: ${order.email}`, 50, y); y -= 25;
        drawLine(50, y, 545, y); y -= 15;

        // Power Details
        const pd = order.power_details || {};
        drawText("Power Details", 50, y, 12, true); y -= 15;
        drawText(`SPH: L-${pd.sph?.left || "-"} | R-${pd.sph?.right || "-"}`, 50, y); y -= 15;
        drawText(`CYL: L-${pd.cyl?.left || "-"} | R-${pd.cyl?.right || "-"}`, 50, y); y -= 15;
        drawText(`AXIS: L-${pd.axis?.left || "-"} | R-${pd.axis?.right || "-"}`, 50, y); y -= 15;
        drawText(`Addition: ${pd.addition || "-"}`, 50, y);
        drawText(`PD Readings: ${pd.pd_readings || "-"}`, 300, y); y -= 25;

        // Table Header
        drawLine(50, y, 545, y); y -= 20;
        drawText("Description", 55, y, 11, true);
        drawText("Qty", 270, y, 11, true);
        drawText("Rate", 370, y, 11, true);
        drawText("Amount", 470, y, 11, true); y -= 10;
        drawLine(50, y, 545, y); y -= 15;

        // Items
        const drawItem = (desc: string, qty: number, rate: number) => {
            const amt = qty * rate;
            drawText(desc, 55, y);
            drawText(`${qty}`, 275, y);
            drawText(`${rate.toFixed(2)}`, 375, y);
            drawText(`${amt.toFixed(2)}`, 475, y);
            y -= 20;
        };

        drawItem("Frame", 1, order.frame_price);
        drawItem("Glass", 1, order.glass_price);

        // Totals
        drawLine(50, y, 545, y); y -= 20;
        drawText("Total", 375, y, 11, true);
        drawText(`${order.total_amount.toFixed(2)}`, 475, y); y -= 15;

        drawText("Advance Paid", 375, y);
        drawText(`${order.advance_paid.toFixed(2)}`, 475, y); y -= 15;

        drawText("Balance Due", 375, y, 11, true);
        drawText(`${(order.total_amount - order.advance_paid).toFixed(2)}`, 475, y); y -= 30;

        drawText(`Status: ${order.status}`, 50, y); y -= 30;

        // Footer
        drawLine(50, y, 545, y); y -= 15;
        drawText("Declaration: Goods once sold will not be taken back or exchanged.", 50, y);
        drawText("Thank you for your purchase!", 50, y - 15);
        drawText("Authorized Signatory", 400, y - 30);

        const pdfBytes = await pdfDoc.save();

        return new NextResponse(pdfBytes, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "inline; filename=invoice.pdf",
            },
        });
    } catch (err: any) {
        console.error("❌ Invoice generation failed:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
