import { Input } from "@/components/ui/input";
import { PowerDetails } from "@/lib/types";

interface Props {
    powerDetails: PowerDetails;
    onChange: (updated: PowerDetails) => void;
}

export default function PowerDetailsInputs({ powerDetails, onChange }: Props) {
    const handleNestedChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        category: "sph" | "cyl" | "axis",
        side: "left" | "right"
    ) => {
        onChange({
            ...powerDetails,
            [category]: {
                ...powerDetails[category],
                [side]: e.target.value,
            },
        });
    };

    const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
            ...powerDetails,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="border-t pt-4 mt-4 space-y-4">
            <div className="text-lg font-semibold">Power Details</div>
            <div className="grid grid-cols-2 gap-4">
                <Input
                    placeholder="SPH Left"
                    value={powerDetails.sph.left}
                    onChange={(e) => handleNestedChange(e, "sph", "left")}
                />
                <Input
                    placeholder="SPH Right"
                    value={powerDetails.sph.right}
                    onChange={(e) => handleNestedChange(e, "sph", "right")}
                />
                <Input
                    placeholder="CYL Left"
                    value={powerDetails.cyl.left}
                    onChange={(e) => handleNestedChange(e, "cyl", "left")}
                />
                <Input
                    placeholder="CYL Right"
                    value={powerDetails.cyl.right}
                    onChange={(e) => handleNestedChange(e, "cyl", "right")}
                />
                <Input
                    placeholder="Axis Left"
                    value={powerDetails.axis.left}
                    onChange={(e) => handleNestedChange(e, "axis", "left")}
                />
                <Input
                    placeholder="Axis Right"
                    value={powerDetails.axis.right}
                    onChange={(e) => handleNestedChange(e, "axis", "right")}
                />
                <Input
                    placeholder="Addition"
                    name="addition"
                    value={powerDetails.addition}
                    onChange={handleSimpleChange}
                />
                <Input
                    placeholder="PD Readings"
                    name="pd_readings"
                    value={powerDetails.pd_readings}
                    onChange={handleSimpleChange}
                />
            </div>
        </div>
    );
}
