import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("📥 Generating invoice for order:", body);
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

        const toNumber = (value: any): number => {
            const n = Number(value);
            return isNaN(n) ? 0 : n;
        };

        // Header
        drawText("NAIN OPTICALS", 220, y, 18, true); y -= 20;
        drawText("132 Street Name, City - 560001", 200, y); y -= 15;
        drawText("GSTIN: 07AAFD8457JU3 | contact@nainopticals.in", 170, y); y -= 30;

        // Invoice Info
        drawText(`Invoice No: ${order.id.slice(0, 8)}`, 50, y);
        drawText(`Date: ${new Date(order.order_date).toLocaleDateString()}`, 400, y); y -= 25;

        // Customer Info
        drawLine(50, y, 545, y); y -= 15;
        drawText("Bill To:", 50, y, 12, true); y -= 15;
        drawText(`Name: ${order.customer_data?.name || "-"}`, 50, y);
        drawText(`Phone: ${order.customer_data?.phone || "-"}`, 300, y); y -= 15;
        drawText(`Email: ${order.customer_data?.email || "-"}`, 50, y); y -= 25;
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

        const drawItem = (desc: string, qty: number, rateRaw: any) => {
            const rate = toNumber(rateRaw);
            const amt = qty * rate;
            drawText(desc, 55, y);
            drawText(`${qty}`, 275, y);
            drawText(`${rate.toFixed(2)}`, 375, y);
            drawText(`${amt.toFixed(2)}`, 475, y);
            y -= 20;
        };

        // Draw items
        const frames = order.purchase_details?.frames || [];
        const glasses = order.purchase_details?.glasses || [];

        if (frames.length > 0) {
            frames.forEach((f: any, idx: number) => {
                drawItem(f.description || `Frame ${idx + 1}`, 1, f.price);
            });
        }

        if (glasses.length > 0) {
            glasses.forEach((g: any, idx: number) => {
                drawItem(g.description || `Glass ${idx + 1}`, 1, g.price);
            });
        }

        if (frames.length === 0 && glasses.length === 0) {
            drawText("No items listed", 55, y); y -= 20;
        }

        // Totals
        drawLine(50, y, 545, y); y -= 20;
        const total = toNumber(order.purchase_details?.total_amount);
        const advance = toNumber(order.purchase_details?.advance_paid);

        drawText("Total", 375, y, 11, true);
        drawText(`${total.toFixed(2)}`, 475, y); y -= 15;

        drawText("Advance Paid", 375, y);
        drawText(`${advance.toFixed(2)}`, 475, y); y -= 15;

        drawText("Balance Due", 375, y, 11, true);
        drawText(`${(total - advance).toFixed(2)}`, 475, y); y -= 30;

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
