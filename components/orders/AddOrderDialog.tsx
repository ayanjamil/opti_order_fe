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
import PowerDetailsInputs from "../PowerDetailsInputs";
import { PowerDetails } from "@/lib/types";
import { sanitizeCustomerData, validateCustomerFields } from "@/lib/orderValidation";

interface Props {
    onSuccess: () => void;
}

export default function AddOrderDialog({ onSuccess }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [customerData, setCustomerData] = useState({ name: "", phone: "", email: "" });
    const [frames, setFrames] = useState([{ description: "", price: "", quantity: "" }]);
    const [glasses, setGlasses] = useState([{ description: "", price: "", quantity: "" }]);
    const [advancePaid, setAdvancePaid] = useState("");
    const [powerDetails, setPowerDetails] = useState<PowerDetails>({
        sph: { left: "", right: "" },
        cyl: { left: "", right: "" },
        axis: { left: "", right: "" },
        addition: "",
        pd_readings: "",
    });
    const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

    const handleCustomerChange = (field: keyof typeof customerData, value: string) => {
        let cleanValue = value;
        if (field === "phone") {
            cleanValue = value.replace(/\D/g, "").slice(0, 10);
        } else if (field === "name") {
            cleanValue = value.replace(/[^A-Za-z\s.'-]/g, "");
            if (cleanValue.startsWith(" ")) {
                cleanValue = cleanValue.trimStart();
            }
            cleanValue = cleanValue.replace(/\s{2,}/g, " ");
        } else if (field === "email") {
            cleanValue = value.replace(/\s/g, "");
        }

        setCustomerData((prev) => {
            const updated = { ...prev, [field]: cleanValue };
            if (errors[field]) {
                const fieldErrors = validateCustomerFields(updated);
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [field]: fieldErrors[field],
                }));
            }
            return updated;
        });
    };

    const handleBlur = (field: keyof typeof customerData) => {
        const fieldErrors = validateCustomerFields(customerData);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: fieldErrors[field],
        }));
    };

    const handleItemChange = (
        type: "frames" | "glasses",
        index: number,
        field: "description" | "price" | "quantity",
        value: string
    ) => {
        const items = type === "frames" ? [...frames] : [...glasses];
        items[index][field] = value;
        type === "frames" ? setFrames(items) : setGlasses(items);
    };

    const handleAddItem = (type: "frames" | "glasses") => {
        const newItem = { description: "", price: "", quantity: "" };
        type === "frames" ? setFrames([...frames, newItem]) : setGlasses([...glasses, newItem]);
    };

    const handleSubmit = async () => {
        const normalizedCustomerData = sanitizeCustomerData(customerData);
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
                frames,
                glasses,
                advance_paid: Number(advancePaid),
            },
            power_details: powerDetails,
        };

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to create order");

            toast.success("Order created successfully!");

            // Reset all state
            setCustomerData({ name: "", phone: "", email: "" });
            setErrors({});
            setFrames([{ description: "", price: "", quantity: "" }]);
            setGlasses([{ description: "", price: "", quantity: "" }]);
            setAdvancePaid("");
            setPowerDetails({
                sph: { left: "", right: "" },
                cyl: { left: "", right: "" },
                axis: { left: "", right: "" },
                addition: "",
                pd_readings: "",
            });

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
            <DialogTrigger asChild>
                <Button>+ Add Order</Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Order</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Input
                                placeholder="Customer Name"
                                autoComplete="name"
                                value={customerData.name}
                                onChange={(e) => handleCustomerChange("name", e.target.value)}
                                onBlur={() => handleBlur("name")}
                                maxLength={80}
                                aria-invalid={Boolean(errors.name)}
                                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            <p className="text-[11px] text-red-600 mt-1 min-h-4 leading-normal">{errors.name}</p>
                        </div>
                        <div>
                            <Input
                                placeholder="10-digit Phone Number"
                                type="tel"
                                inputMode="numeric"
                                autoComplete="tel"
                                value={customerData.phone}
                                onChange={(e) => handleCustomerChange("phone", e.target.value)}
                                onBlur={() => handleBlur("phone")}
                                maxLength={10}
                                aria-invalid={Boolean(errors.phone)}
                                className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            <p className="text-[11px] text-red-600 mt-1 min-h-4 leading-normal">{errors.phone}</p>
                        </div>
                        <div className="md:col-span-2">
                            <Input
                                placeholder="Email Address"
                                type="email"
                                autoComplete="email"
                                value={customerData.email}
                                onChange={(e) => handleCustomerChange("email", e.target.value)}
                                onBlur={() => handleBlur("email")}
                                maxLength={254}
                                aria-invalid={Boolean(errors.email)}
                                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            <p className="text-[11px] text-red-600 mt-1 min-h-4 leading-normal">{errors.email}</p>
                        </div>
                    </div>

                    {/* Frames */}
                    <div>
                        <div className="font-medium">Frames</div>
                        {frames.map((item, i) => (
                            <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                                <Input
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) => handleItemChange("frames", i, "description", e.target.value)}
                                />
                                <Input
                                    placeholder="Price"
                                    value={item.price}
                                    onChange={(e) => handleItemChange("frames", i, "price", e.target.value)}
                                />
                                <Input
                                    placeholder="Quantity"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange("frames", i, "quantity", e.target.value)}
                                />
                            </div>
                        ))}
                        <Button variant="ghost" size="sm" onClick={() => handleAddItem("frames")}>
                            + Add Frame
                        </Button>
                    </div>

                    {/* Glasses */}
                    <div>
                        <div className="font-medium">Glasses</div>
                        {glasses.map((item, i) => (
                            <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                                <Input
                                    placeholder="Description"
                                    value={item.description}
                                    onChange={(e) => handleItemChange("glasses", i, "description", e.target.value)}
                                />
                                <Input
                                    placeholder="Price"
                                    value={item.price}
                                    onChange={(e) => handleItemChange("glasses", i, "price", e.target.value)}
                                />
                                <Input
                                    placeholder="Quantity"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange("glasses", i, "quantity", e.target.value)}
                                />
                            </div>
                        ))}
                        <Button variant="ghost" size="sm" onClick={() => handleAddItem("glasses")}>
                            + Add Glass
                        </Button>
                    </div>

                    {/* Advance */}
                    <div className="font-medium">Advance Paid</div>

                    <Input
                        placeholder="Advance Paid"
                        type="number"
                        value={advancePaid}
                        onChange={(e) => setAdvancePaid(e.target.value)}
                    />

                    {/* Power Details */}
                    <PowerDetailsInputs powerDetails={powerDetails} onChange={setPowerDetails} />
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : "Save Order"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
