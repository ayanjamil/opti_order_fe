"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface Props {
    orderId: string;
    currentStatus: Order["status"];
    onUpdated?: (newStatus: Order["status"]) => void;
}

export default function OrderStatusSelect({ orderId, currentStatus, onUpdated }: Props) {
    const [status, setStatus] = useState<Order["status"]>(currentStatus);
    const [nextStatus, setNextStatus] = useState<Order["status"] | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleStatusChange = (selected: Order["status"]) => {
        setNextStatus(selected);
        setDialogOpen(true);
    };

    const confirmStatusChange = async () => {
        if (!nextStatus) return;

        setLoading(true);

        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            toast.success(`Status updated to "${nextStatus}"`);
            setStatus(nextStatus);
            onUpdated?.(nextStatus);
        } catch (error: any) {
            toast.error("Error updating status: " + error.message);
        } finally {
            setLoading(false);
            setDialogOpen(false);
            setNextStatus(null);
        }
    };

    return (
        <>
            <Select value={status} onValueChange={(value) => handleStatusChange(value as Order["status"])}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="glass_arrived">Glass Arrived</SelectItem>
                    <SelectItem value="fitted">Fitted</SelectItem>
                    {/* <SelectItem value="completed">Completed</SelectItem> */}
                </SelectContent>
            </Select>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Status Update</DialogTitle>
                    </DialogHeader>
                    <p>
                        Are you sure you want to change the order status to{" "}
                        <strong>{nextStatus?.replace(/_/g, " ")}</strong>?
                    </p>
                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (!loading) setDialogOpen(false);
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button onClick={confirmStatusChange} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Updating..." : "Yes, Update"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
