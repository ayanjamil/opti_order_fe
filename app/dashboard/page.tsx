"use client";

import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

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
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({
    customer_name: "",
    phone_number: "",
    email: "",
    frame_price: "",
    glass_price: "",
    advance_paid: "",
  });

  const fetchOrders = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data.data || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrder = async () => {
    if (loading) return; // Prevent double click
    setLoading(true);

    const payload = {
      ...formData,
      frame_price: Number(formData.frame_price),
      glass_price: Number(formData.glass_price),
      advance_paid: Number(formData.advance_paid),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create order");

      toast.success("Order created successfully!");
      setFormData({
        customer_name: "",
        phone_number: "",
        email: "",
        frame_price: "",
        glass_price: "",
        advance_paid: "",
      });
      setFormOpen(false);
      fetchOrders();
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };


  const filteredOrders = filterDate
    ? orders.filter(
      (order) =>
        new Date(order.order_date).toISOString().split("T")[0] === filterDate
    )
    : orders;

  return (
    <div className="p-6 space-y-6">
      {/* Header with Date Filter + Add Order */}
      <div className="flex font-extrabold text-4xl justify-center text-gray-600">Nain Opticals Admin Dashboard</div>
      <div className="flex items-center justify-between">
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="w-64"
        />
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button variant="default">+ Add Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Order</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <Input
                placeholder="Customer Name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
              />
              <Input
                placeholder="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
              <Input
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
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

            <DialogFooter>
              <Button onClick={handleAddOrder} disabled={loading}>
                {loading ? "Saving..." : "Save Order"}
              </Button>
            </DialogFooter>

          </DialogContent>
        </Dialog>
      </div>

      {/* Orders Table */}
      <DataTable columns={columns} data={filteredOrders} />
    </div>
  );
}
