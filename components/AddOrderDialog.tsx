"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import PowerDetailsInputs from "./PowerDetailsInputs";
// import { PowerDetails } from "./types";
import { PowerDetails } from "@/lib/types";

interface Props {
    onSuccess: () => void;
}

export default function AddOrderDialog({ onSuccess }: Props) {
    const [open, setOpen] = useState(false);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePowerChange = (power: PowerDetails) => {
        setFormData((prev) => ({ ...prev, power_details: power }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            ...formData,
            frame_price: Number(formData.frame_price),
            glass_price: Number(formData.glass_price),
            advance_paid: Number(formData.advance_paid),
        };

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to create order");

            toast.success("Order created successfully!");
            setFormData({
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
                },
            });
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
            <DialogTrigger asChild>
                <Button>+ Add Order</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Order</DialogTitle>
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
                        {loading ? "Saving..." : "Save Order"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
