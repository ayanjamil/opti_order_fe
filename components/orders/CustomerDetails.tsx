import { Input } from "@/components/ui/input";

interface Props {
    customer: {
        name: string;
        phone: string;
        email: string;
    };
    onChange: (field: 'name' | 'phone' | 'email', value: string) => void;
}

export default function CustomerDetails({ customer, onChange }: Props) {
    return (
        <div className="space-y-3">
            <div className="font-medium text-lg">Customer Information</div>
            <Input placeholder="Name" value={customer.name} onChange={(e) => onChange("name", e.target.value)} />
            <Input placeholder="Phone" value={customer.phone} onChange={(e) => onChange("phone", e.target.value)} />
            <Input placeholder="Email" value={customer.email} onChange={(e) => onChange("email", e.target.value)} />
        </div>
    );
}
