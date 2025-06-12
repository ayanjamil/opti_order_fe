import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Order } from "@/lib/types";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import OrderStatusSelect from "@/components/OrderStatusSelect";
import { Loader2 } from "lucide-react";

export const columns: ColumnDef<Order>[] = [
    {
        accessorKey: "order_date",
        header: "Date",
        cell: ({ row }) => format(new Date(row.original.order_date), "dd MMM yyyy"),
    },
    {
        accessorKey: "customer_data.name",
        header: "Customer",
    },
    {
        accessorKey: "customer_data.phone",
        header: "Phone",
    },
    {
        accessorKey: "customer_data.email",
        header: "Email",
    },
    {
        accessorKey: "purchase_details.total_amount",
        header: "Total ₹",
    },
    {
        accessorKey: "purchase_details.advance_paid",
        header: "Advance ₹",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const order = row.original;

            return (
                <OrderStatusSelect
                    orderId={order.id}
                    currentStatus={order.status}
                />
            );
        },
    },
    {
        id: 'details',
        header: 'Details',
        cell: ({ row }) => {
            const id = row.original.id;
            return (
                <Link href={`/dashboard/${id}`}>
                    <Button variant="outline">Details</Button>
                </Link>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const order = row.original;
            const [open, setOpen] = useState(false);
            const [loading, setLoading] = useState(false);

            const handleDelete = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`/api/orders/${order.id}`, {
                        method: 'DELETE',
                    });

                    if (!res.ok) throw new Error('Failed to delete order');

                    toast.success('Order deleted successfully');
                    setTimeout(() => window.location.reload(), 1000); // Optional refresh
                } catch (error: any) {
                    toast.error('Error: ' + error.message);
                } finally {
                    setLoading(false);
                    setOpen(false);
                }
            };

            return (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="destructive">Delete</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <p>
                            Are you sure you want to delete the order for <strong>{order.customer_data.name}</strong>? This action cannot be undone.
                        </p>
                        <DialogFooter className="mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? "Deleting..." : "Delete"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            );
        },
    },
];
