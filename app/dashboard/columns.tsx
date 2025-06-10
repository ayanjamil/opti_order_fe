"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
// import { Order } from "./page";
import { Order } from "@/lib/types";
import { toast } from "sonner";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Link } from "lucide-react";
import Link from "next/link";
import OrderStatusSelect from "@/components/OrderStatusSelect";


export const columns: ColumnDef<Order>[] = [
    {
        accessorKey: "order_date",
        header: "Date",
        cell: ({ row }) => format(new Date(row.original.order_date), "dd MMM yyyy"),
    },
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
            // grab the real id off row.original
            const id = row.original.id
            return (
                <Link href={`/dashboard/${id}`}>
                    <Button variant="outline">

                        Details
                    </Button>
                </Link>
            )
        }
    }
];
