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
import { sanitizeCustomerData, validateCustomerFields } from "@/lib/orderValidation";

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
    const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

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
            customer_data: normalizedCustomerData,
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

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setErrors({});
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{orderId ? "Edit Order" : "Add Order"}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <div>
                        <Input
                            placeholder="Customer Name"
                            name="customer_name"
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
                            placeholder="10-digit Phone Number"
                            name="phone_number"
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
                            placeholder="Email Address"
                            name="email"
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
