import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PowerDetailsInputs from "./PowerDetailsInputs";
import { PowerDetails } from "@/lib/types";

type OrderFormProps = {
    initialData?: {
        customer_name: string;
        phone_number: string;
        email: string;
        frame_price: string;
        glass_price: string;
        advance_paid: string;
        power_details: PowerDetails;
    };
    orderId?: string; // if present, edit mode
    onSuccess: () => void;
};

export default function OrderForm({ initialData, orderId, onSuccess }: OrderFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: initialData?.customer_name || "",
        phone_number: initialData?.phone_number || "",
        email: initialData?.email || "",
        frame_price: initialData?.frame_price || "",
        glass_price: initialData?.glass_price || "",
        advance_paid: initialData?.advance_paid || "",
        power_details: initialData?.power_details || {
            sph: { left: "", right: "" },
            cyl: { left: "", right: "" },
            axis: { left: "", right: "" },
            addition: "",
            pd_readings: "",
        },
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
            const res = await fetch(orderId ? `/api/orders/${orderId}` : "/api/orders", {
                method: orderId ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(orderId ? "Update failed" : "Creation failed");

            toast.success(orderId ? "Order updated!" : "Order created!");
            onSuccess();
        } catch (err: any) {
            toast.error("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <Input name="customer_name" placeholder="Customer Name" value={formData.customer_name} onChange={handleChange} />
                <Input name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} />
                <Input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                <Input name="frame_price" placeholder="Frame Price" type="number" value={formData.frame_price} onChange={handleChange} />
                <Input name="glass_price" placeholder="Glass Price" type="number" value={formData.glass_price} onChange={handleChange} />
                <Input name="advance_paid" placeholder="Advance Paid" type="number" value={formData.advance_paid} onChange={handleChange} />
            </div>

            <PowerDetailsInputs powerDetails={formData.power_details} onChange={handlePowerChange} />

            <div className="mt-4">
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? (orderId ? "Updating..." : "Creating...") : (orderId ? "Update Order" : "Save Order")}
                </Button>
            </div>
        </div>
    );
}
