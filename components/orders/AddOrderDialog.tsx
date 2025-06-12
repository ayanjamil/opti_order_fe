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

    const handleCustomerChange = (field: keyof typeof customerData, value: string) => {
        setCustomerData((prev) => ({ ...prev, [field]: value }));
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
        setLoading(true);

        const payload = {
            customer_data: customerData,
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                        <Input
                            placeholder="Customer Name"
                            value={customerData.name}
                            onChange={(e) => handleCustomerChange("name", e.target.value)}
                        />
                        <Input
                            placeholder="Phone Number"
                            value={customerData.phone}
                            onChange={(e) => handleCustomerChange("phone", e.target.value)}
                        />
                        <Input
                            placeholder="Email"
                            value={customerData.email}
                            onChange={(e) => handleCustomerChange("email", e.target.value)}
                        />
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
