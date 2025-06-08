"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Order } from "./page";
import { toast } from "sonner"; // or useToast() from ShadCN if you’ve set it up

export const columns: ColumnDef<Order>[] = [
    {
        accessorKey: "customer_name",
        header: "Customer",
    },
    {
        accessorKey: "phone_number",
        header: "Phone",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "total_amount",
        header: "Total ₹",
    },
    {
        accessorKey: "advance_paid",
        header: "Advance ₹",
    },
    {
        accessorKey: "order_date",
        header: "Date",
        cell: ({ row }) =>
            format(new Date(row.original.order_date), "dd MMM yyyy"),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const order = row.original;

            const handleStatusChange = async (newStatus: Order["status"]) => {
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}`,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ status: newStatus }),
                        }
                    );

                    if (!res.ok) throw new Error("Failed to update status");

                    toast.success(`Status updated to "${newStatus}"`);
                } catch (error: any) {
                    toast.error("Error updating status: " + error.message);
                }
            };

            return (
                <Select
                    defaultValue={order.status}
                    onValueChange={(value) =>
                        handleStatusChange(value as Order["status"])
                    }
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="glass_arrived">Glass Arrived</SelectItem>
                        <SelectItem value="fitted">Fitted</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
            );
        },
    },
];
