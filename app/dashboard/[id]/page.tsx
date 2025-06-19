"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Order } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
// import OrderDialog from "@/components/OrderDialog";
import Link from "next/link";
import OrderStatusSelect from "@/components/OrderStatusSelect";
import OrderDialog from "@/components/OrderDialog";

export default function OrderDetailsPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [invoiceLoading, setInvoiceLoading] = useState(false);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${id}`);
            if (!res.ok) throw new Error("Failed to fetch order details");

            const json = await res.json();
            setOrder(json.data);
        } catch (error: any) {
            toast.error("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadInvoice = async (order: Order) => {
        try {
            setInvoiceLoading(true);
            toast.info("Generating invoice...");

            const res = await fetch("/api/generate-invoice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: order }),
            });

            if (!res.ok) {
                toast.error("Failed to generate invoice");
                return;
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "invoice.pdf";
            link.click();

            toast.success("Invoice downloaded successfully!");
        } catch (err: any) {
            toast.error("Invoice generation failed: " + err.message);
        } finally {
            setInvoiceLoading(false);
        }
    };
    useEffect(() => {
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>
        );
    }

    if (!order) {
        return <div className="p-6 text-red-500">Order not found.</div>;
    }

    const { power_details, customer_data, purchase_details } = order;
    const balance =
        purchase_details.total_amount - purchase_details.advance_paid;

    return (
        <div className="p-6 space-y-6 pt-24">
            <h1 className="text-4xl font-bold text-gray-800 flex justify-center m-8 p-8">
                Order Details
            </h1>

            <div className="flex flex-wrap justify-between gap-2 items-center">
                <Link href={"/dashboard"}>
                    <Button>Back</Button>
                </Link>

                <OrderStatusSelect
                    orderId={order.id}
                    currentStatus={order.status}
                    onUpdated={(newStatus) =>
                        setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev))
                    }
                />

                <Button
                    onClick={() => downloadInvoice(order)}
                    disabled={invoiceLoading}
                >
                    {invoiceLoading ? "Generating..." : "Download Invoice"}
                </Button>
                <Button onClick={() => setDialogOpen(true)}>Edit Order</Button>

                <OrderDialog
                    open={dialogOpen}
                    setOpen={setDialogOpen}
                    orderId={order.id}
                    initialData={order}
                    onSuccess={fetchOrder}
                />
            </div>

            {/* Customer & Order Summary */}
            <Card>
                <CardHeader>
                    <h2 className="text-2xl font-bold">Customer & Order Info</h2>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div><strong>Name:</strong> {customer_data.name}</div>
                    <div><strong>Phone:</strong> {customer_data.phone}</div>
                    <div><strong>Email:</strong> {customer_data.email}</div>
                    <div><strong>Status:</strong> {order.status}</div>
                    <div><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</div>
                </CardContent>
            </Card>

            {/* Purchase Details */}
            <Card>
                <CardHeader>
                    <h2 className="text-2xl font-bold">Purchase Details</h2>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                    <div>
                        <h3 className="font-semibold mb-1">Frames</h3>
                        {purchase_details.frames.map((frame, idx) => (
                            <div key={idx} className="text-sm">
                                {frame.description} – ₹{frame.price} × {frame.quantity}
                            </div>
                        ))}
                    </div>

                    <div>
                        <h3 className="font-semibold mb-1">Glasses</h3>
                        {purchase_details.glasses.map((glass, idx) => (
                            <div key={idx} className="text-sm">
                                {glass.description} – ₹{glass.price} × {glass.quantity}
                            </div>
                        ))}
                    </div>

                    <div className="text-sm pt-4 space-y-1">
                        <div><strong>Total Amount:</strong> ₹{purchase_details.total_amount}</div>
                        <div><strong>Advance Paid:</strong> ₹{purchase_details.advance_paid}</div>
                        <div><strong>Balance:</strong> ₹{balance}</div>
                    </div>
                </CardContent>
            </Card>

            {/* Power Details */}
            {power_details && (
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-bold">Power Details</h2>
                    </CardHeader>
                    <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><strong>SPH Left:</strong> {power_details.sph?.left || "-"}</div>
                        <div><strong>SPH Right:</strong> {power_details.sph?.right || "-"}</div>
                        <div><strong>CYL Left:</strong> {power_details.cyl?.left || "-"}</div>
                        <div><strong>CYL Right:</strong> {power_details.cyl?.right || "-"}</div>
                        <div><strong>Axis Left:</strong> {power_details.axis?.left || "-"}</div>
                        <div><strong>Axis Right:</strong> {power_details.axis?.right || "-"}</div>
                        <div><strong>Addition:</strong> {power_details.addition || "-"}</div>
                        <div><strong>PD Readings:</strong> {power_details.pd_readings || "-"}</div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
