export interface PowerDetails {
    sph: { left: string; right: string };
    cyl: { left: string; right: string };
    axis: { left: string; right: string };
    addition: string;
    pd_readings: string;
}

export interface Order {
    id: string;
    order_date: string;
    status: "pending" | "glass_arrived" | "fitted" | "completed";
    notes: string | null;
    deleted_at: string | null;
    power_details: PowerDetails;
    customer_data: {
        name: string;
        email: string;
        phone: string;
    };
    purchase_details: {
        frames: {
            price: string;
            quantity: string;
            description: string;
        }[];
        glasses: {
            price: string;
            quantity: string;
            description: string;
        }[];
        advance_paid: number;
        total_amount: number;
    };
}
