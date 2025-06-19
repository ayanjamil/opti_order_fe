"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import PowerDetailsInputs from "./PowerDetailsInputs";
import { PowerDetails, Order } from "@/lib/types";

interface Props {
    initialData?: Partial<Order>;
    orderId?: string;
    open: boolean;
    setOpen: (val: boolean) => void;
    onSuccess: () => void;
}

export default function OrderDialog({
    initialData,
    orderId,
    open,
    setOpen,
    onSuccess,
}: Props) {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        customer_name: "",
        phone_number: "",
        email: "",
        frame_price: "",
        glass_price: "",
        advance_paid: "",
        power_details: {
            sph: { left: "", right: "" },
            cyl: { left: "", right: "" },
            axis: { left: "", right: "" },
            addition: "",
            pd_readings: "",
        } as PowerDetails,
    });

    // Prefill form when editing
    useEffect(() => {
        if (initialData) {
            const framePrice = initialData.purchase_details?.frames?.[0]?.price || "";
            const glassPrice = initialData.purchase_details?.glasses?.[0]?.price || "";

            setFormData({
                customer_name: initialData.customer_data?.name || "",
                phone_number: initialData.customer_data?.phone || "",
                email: initialData.customer_data?.email || "",
                frame_price: String(framePrice),
                glass_price: String(glassPrice),
                advance_paid: String(initialData.purchase_details?.advance_paid || ""),
                power_details: initialData.power_details || {
                    sph: { left: "", right: "" },
                    cyl: { left: "", right: "" },
                    axis: { left: "", right: "" },
                    addition: "",
                    pd_readings: "",
                },
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePowerChange = (power: PowerDetails) => {
        setFormData((prev) => ({ ...prev, power_details: power }));
    };

    const handleSubmit = async () => {
        setLoading(true);

        const payload = {
            customer_data: {
                name: formData.customer_name,
                phone: formData.phone_number,
                email: formData.email,
            },
            purchase_details: {
                frames: [
                    {
                        price: formData.frame_price,
                        description: "", // add if needed
                        quantity: "", // add if needed
                    },
                ],
                glasses: [
                    {
                        price: formData.glass_price,
                        description: "", // add if needed
                        quantity: "", // add if needed
                    },
                ],
                advance_paid: Number(formData.advance_paid),
            },
            power_details: formData.power_details,
        };

        try {
            const res = await fetch(
                orderId ? `/api/orders/${orderId}` : `/api/orders`,
                {
                    method: orderId ? "PATCH" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("Something went wrong");

            toast.success(orderId ? "Order updated" : "Order created");
            setOpen(false);
            onSuccess();
        } catch (err: any) {
            toast.error("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{orderId ? "Edit Order" : "Add Order"}</DialogTitle>
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

                <PowerDetailsInputs
                    powerDetails={formData.power_details}
                    onChange={handlePowerChange}
                />

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : orderId ? "Update Order" : "Save Order"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
