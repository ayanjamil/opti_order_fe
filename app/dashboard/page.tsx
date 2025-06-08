"use client";

import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Input } from "@/components/ui/input";

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
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
        const json = await res.json();
        setOrders(json.data || []); // Make sure `json.data` exists
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = filterDate
    ? orders.filter(order =>
      new Date(order.order_date).toISOString().split("T")[0] === filterDate
    )
    : orders;

  return (
    <div className="p-6 space-y-4">
      <Input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="w-64"
      />
      <DataTable columns={columns} data={filteredOrders} />
    </div>
  );
}
