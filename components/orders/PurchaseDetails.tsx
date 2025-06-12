import { Input } from "@/components/ui/input";

interface Item {
    description: string;
    price: string;
    quantity: string;
}

interface Props {
    frames: Item[];
    glasses: Item[];
    advancePaid: string;
    onItemChange: (type: "frames" | "glasses", index: number, field: keyof Item, value: string) => void;
    onAddItem: (type: "frames" | "glasses") => void;
    onAdvanceChange: (value: string) => void;
}

export default function PurchaseDetails({ frames, glasses, onItemChange, onAddItem, advancePaid, onAdvanceChange }: Props) {
    return (
        <div className="space-y-3">
            <div className="text-lg font-semibold">Purchase Details</div>

            <div>
                <div className="font-medium">Frames</div>
                {frames.map((frame, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                        <Input placeholder="Description" value={frame.description} onChange={(e) => onItemChange("frames", i, "description", e.target.value)} />
                        <Input placeholder="Price" value={frame.price} onChange={(e) => onItemChange("frames", i, "price", e.target.value)} />
                        <Input placeholder="Quantity" value={frame.quantity} onChange={(e) => onItemChange("frames", i, "quantity", e.target.value)} />
                    </div>
                ))}
                <button onClick={() => onAddItem("frames")} className="text-blue-500 text-sm mt-1">+ Add Frame</button>
            </div>

            <div>
                <div className="font-medium">Glasses</div>
                {glasses.map((glass, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                        <Input placeholder="Description" value={glass.description} onChange={(e) => onItemChange("glasses", i, "description", e.target.value)} />
                        <Input placeholder="Price" value={glass.price} onChange={(e) => onItemChange("glasses", i, "price", e.target.value)} />
                        <Input placeholder="Quantity" value={glass.quantity} onChange={(e) => onItemChange("glasses", i, "quantity", e.target.value)} />
                    </div>
                ))}
                <button onClick={() => onAddItem("glasses")} className="text-blue-500 text-sm mt-1">+ Add Glass</button>
            </div>

            <Input placeholder="Advance Paid" value={advancePaid} onChange={(e) => onAdvanceChange(e.target.value)} />
        </div>
    );
}
