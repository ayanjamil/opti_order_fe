// "use client";

// import { useEffect, useState } from "react";
// import { columns } from "../dashboard/columns";
// import { DataTable } from "@/components/ui/data-table";
// import
// // import { Order } from "./types";
// import { Input } from "@/components/ui/input";


// export interface Order {
//     id: string;
//     customer_name: string;
//     phone_number: string;
//     email: string;
//     frame_price: number;
//     glass_price: number;
//     advance_paid: number;
//     total_amount: number;
//     order_date: string;
//     status: "pending" | "glass_arrived" | "fitted" | "completed";
//     notes: string | null;
//     deleted_at: string | null;
// }


// export default function OrdersPage() {
//     const [orders, setOrders] = useState<Order[]>([]);
//     const [filterDate, setFilterDate] = useState("");

//     useEffect(() => {
//         fetch("/api/orders")
//             .then(res => res.json())
//             .then(data => setOrders(data))
//             .catch(console.error);
//     }, []);

//     const filteredOrders = filterDate
//         ? orders.filter(order =>
//             new Date(order.order_date).toISOString().split("T")[0] === filterDate
//         )
//         : orders;

//     return (
//         <div className="p-6 space-y-4">
//             <Input
//                 type="date"
//                 value={filterDate}
//                 onChange={(e) => setFilterDate(e.target.value)}
//                 className="w-64"
//             />
//             <DataTable columns={columns} data={filteredOrders} />
//         </div>
//     );
// }
