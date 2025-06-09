"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Order } from "./page";
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
        accessorKey: "frame_price",
        header: "Frame price ₹",
    },
    {
        accessorKey: "glass_price",
        header: "Glass price ₹",
    },
    {
        accessorKey: "advance_paid",
        header: "Advance ₹",
    },
    {
        accessorKey: "order_date",
        header: "Date",
        cell: ({ row }) => format(new Date(row.original.order_date), "dd MMM yyyy"),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const order = row.original;

            const handleStatusChange = async (newStatus: Order["status"]) => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: newStatus }),
                    });

                    if (!res.ok) throw new Error("Failed to update status");
                    toast.success(`Status updated to "${newStatus}"`);
                } catch (error: any) {
                    toast.error("Error updating status: " + error.message);
                }
            };

            return (
                <Select defaultValue={order.status} onValueChange={(value) => handleStatusChange(value as Order["status"])}>
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
    {
        id: "actions",
        header: "Edit",
        cell: ({ row }) => {
            const order = row.original;
            const [formOpen, setFormOpen] = useState(false);
            const [loading, setLoading] = useState(false);
            const [formData, setFormData] = useState({ ...order });

            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const { name, value } = e.target;
                setFormData((prev) => ({ ...prev, [name]: value }));
            };

            const handleUpdate = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formData), // includes name, phone, email, etc.
                    });

                    if (!res.ok) throw new Error("Failed to update order");

                    toast.success("Order updated successfully");
                    setFormOpen(false);
                } catch (error: any) {
                    toast.error("Update failed: " + error.message);
                } finally {
                    setLoading(false);
                }
            };



            return (
                <Dialog open={formOpen} onOpenChange={setFormOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline">Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Order</DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            <Input
                                placeholder="Customer Name"
                                name="customer_name"
                                value={formData.customer_name}
                                onChange={handleChange}
                            />
                            <Input
                                placeholder="Phone Number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                            />
                            <Input
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <Input
                                placeholder="Frame Price"
                                name="frame_price"
                                type="number"
                                value={formData.frame_price}
                                onChange={handleChange}
                            />
                            <Input
                                placeholder="Glass Price"
                                name="glass_price"
                                type="number"
                                value={formData.glass_price}
                                onChange={handleChange}
                            />
                            <Input
                                placeholder="Advance Paid"
                                name="advance_paid"
                                type="number"
                                value={formData.advance_paid}
                                onChange={handleChange}
                            />
                        </div>

                        <DialogFooter>
                            <Button onClick={handleUpdate} disabled={loading}>
                                {loading ? "Updating..." : "Update Order"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            );
        },
    },
];
