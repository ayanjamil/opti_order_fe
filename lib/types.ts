export interface PowerDetails {
    sph: { left: string; right: string };
    cyl: { left: string; right: string };
    axis: { left: string; right: string };
    addition: string;
    pd_readings: string;
}

export interface Order {
    id: string;
    customer_name: string;
    phone_number: string;
    email: string;
    frame_price: number;
    glass_price: number;
    advance_paid: number;
    total_amount: number;
    order_date: string;
    status: "pending" | "glass_arrived" | "fitted" | "completed";
    notes: string | null;
    deleted_at: string | null;
    power_details: PowerDetails;
}
