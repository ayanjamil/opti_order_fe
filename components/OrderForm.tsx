import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PowerDetailsInputs from "./PowerDetailsInputs";
import { PowerDetails } from "@/lib/types";
import { sanitizeCustomerData, validateCustomerFields } from "@/lib/orderValidation";

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
    const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
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
        const { name, value } = e.target;
        let cleanValue = value;

        if (name === "phone_number") {
            cleanValue = value.replace(/\D/g, "").slice(0, 10);
        } else if (name === "customer_name") {
            cleanValue = value.replace(/[^A-Za-z\s.'-]/g, "");
            if (cleanValue.startsWith(" ")) {
                cleanValue = cleanValue.trimStart();
            }
            cleanValue = cleanValue.replace(/\s{2,}/g, " ");
        } else if (name === "email") {
            cleanValue = value.replace(/\s/g, "");
        }

        setFormData((prev) => {
            const updated = { ...prev, [name]: cleanValue };
            
            // If errors exist for the modified customer fields, validate on change to clear them dynamically
            if (name === "customer_name" || name === "phone_number" || name === "email") {
                const fieldKey = name === "customer_name" ? "name" : name === "phone_number" ? "phone" : "email";
                if (errors[fieldKey]) {
                    const fieldErrors = validateCustomerFields({
                        name: updated.customer_name,
                        phone: updated.phone_number,
                        email: updated.email,
                    });
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [fieldKey]: fieldErrors[fieldKey],
                    }));
                }
            }
            return updated;
        });
    };

    const handleBlur = (name: string) => {
        if (name === "customer_name" || name === "phone_number" || name === "email") {
            const fieldKey = name === "customer_name" ? "name" : name === "phone_number" ? "phone" : "email";
            const fieldErrors = validateCustomerFields({
                name: formData.customer_name,
                phone: formData.phone_number,
                email: formData.email,
            });
            setErrors((prevErrors) => ({
                ...prevErrors,
                [fieldKey]: fieldErrors[fieldKey],
            }));
        }
    };

    const handlePowerChange = (power: PowerDetails) => {
        setFormData((prev) => ({ ...prev, power_details: power }));
    };

    const handleSubmit = async () => {
        const normalizedCustomerData = sanitizeCustomerData({
            name: formData.customer_name,
            phone: formData.phone_number,
            email: formData.email,
        });
        const fieldErrors = validateCustomerFields(normalizedCustomerData);

        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            const firstError = fieldErrors.name || fieldErrors.phone || fieldErrors.email;
            if (firstError) {
                toast.error(firstError);
            }
            return;
        }

        setErrors({});
        setLoading(true);
        const payload = {
            ...formData,
            customer_name: normalizedCustomerData.name,
            phone_number: normalizedCustomerData.phone,
            email: normalizedCustomerData.email,
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
                <div>
                    <Input
                        name="customer_name"
                        placeholder="Customer Name"
                        autoComplete="name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        onBlur={() => handleBlur("customer_name")}
                        maxLength={80}
                        aria-invalid={Boolean(errors.name)}
                        className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    <p className="text-[11px] text-red-600 mt-1 min-h-4 leading-normal">{errors.name}</p>
                </div>
                <div>
                    <Input
                        name="phone_number"
                        placeholder="10-digit Phone Number"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        value={formData.phone_number}
                        onChange={handleChange}
                        onBlur={() => handleBlur("phone_number")}
                        maxLength={10}
                        aria-invalid={Boolean(errors.phone)}
                        className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    <p className="text-[11px] text-red-600 mt-1 min-h-4 leading-normal">{errors.phone}</p>
                </div>
                <div className="md:col-span-2">
                    <Input
                        name="email"
                        placeholder="Email Address"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur("email")}
                        maxLength={254}
                        aria-invalid={Boolean(errors.email)}
                        className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    <p className="text-[11px] text-red-600 mt-1 min-h-4 leading-normal">{errors.email}</p>
                </div>
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
