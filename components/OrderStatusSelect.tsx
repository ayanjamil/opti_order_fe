"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Order } from "@/lib/types";

interface Props {
    orderId: string;
    currentStatus: Order["status"];
    onUpdated?: (newStatus: Order["status"]) => void;
}

export default function OrderStatusSelect({ orderId, currentStatus, onUpdated }: Props) {
    const [status, setStatus] = useState<Order["status"]>(currentStatus);

    const handleStatusChange = async (newStatus: Order["status"]) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            toast.success(`Status updated to "${newStatus}"`);
            setStatus(newStatus);
            onUpdated?.(newStatus);
        } catch (error: any) {
            toast.error("Error updating status: " + error.message);
        }
    };

    return (
        <Select value={status} onValueChange={(value) => handleStatusChange(value as Order["status"])}>
            <SelectTrigger className="w-[180px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="glass_arrived">Glass Arrived</SelectItem>
                <SelectItem value="fitted">Fitted</SelectItem>
                {/* <SelectItem value="completed">Completed</SelectItem> */}
            </SelectContent>
        </Select>
    );
}
