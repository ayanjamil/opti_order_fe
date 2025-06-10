"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Order } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import OrderForm from "@/components/OrderForm";
import OrderDialog from "@/components/OrderDialog";
import Link from "next/link";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export default function OrderDetailsPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    // const [dialogOpen, setDialogOpen] = useState(false);

    // inside return:



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

    const { power_details } = order;

    return (
        <div className="p-6 space-y-6 pt-24">
            <h1 className="text-4xl font-bold text-gray-800  flex justify-center m-8 p-8">Order Details</h1>
            <div className="flex justify-between items-center">
                <Link href={"/dashboard"}>
                    <Button>
                        Back
                    </Button>
                </Link>
                <div className="flex flex-row gap-1">
                    <strong className="my-auto mx-2">Status:</strong>
                    <OrderStatusSelect
                        orderId={order.id}
                        currentStatus={order.status}
                        onUpdated={(newStatus) =>
                            setOrder((prev) => prev ? { ...prev, status: newStatus } : prev)
                        }
                    />
                </div>

                <Button onClick={() => setDialogOpen(true)}>Edit Order</Button>


                {/* Controlled dialog */}
                <OrderDialog
                    open={dialogOpen}
                    setOpen={setDialogOpen}
                    orderId={order.id}
                    initialData={order}
                    onSuccess={fetchOrder}
                />
            </div>


            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-bold">
                        Order Details
                    </h1>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                    <div><strong>Customer:</strong> {order.customer_name}</div>
                    <div><strong>Phone:</strong> {order.phone_number}</div>
                    <div><strong>Email:</strong> {order.email}</div>
                    <div><strong>Status:</strong> {order.status}</div>

                    <div><strong>Frame Price:</strong> ₹{order.frame_price}</div>
                    <div><strong>Glass Price:</strong> ₹{order.glass_price}</div>
                    <div><strong>Total Amount:</strong> ₹{order.total_amount}</div>
                    <div><strong>Advance Paid:</strong> ₹{order.advance_paid}</div>
                    <div><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</div>
                </CardContent>
            </Card>

            {power_details && (
                <Card>
                    <CardHeader>
                        <h1 className="text-2xl font-bold">
                            Power Details
                        </h1>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><strong>SPH Left:</strong> {power_details.sph?.left || "-"}</div>
                            <div><strong>SPH Right:</strong> {power_details.sph?.right || "-"}</div>
                            <div><strong>CYL Left:</strong> {power_details.cyl?.left || "-"}</div>
                            <div><strong>CYL Right:</strong> {power_details.cyl?.right || "-"}</div>
                            <div><strong>Axis Left:</strong> {power_details.axis?.left || "-"}</div>
                            <div><strong>Axis Right:</strong> {power_details.axis?.right || "-"}</div>
                            <div><strong>Addition:</strong> {power_details.addition || "-"}</div>
                            <div><strong>PD:</strong> {power_details.pd_readings || "-"}</div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
