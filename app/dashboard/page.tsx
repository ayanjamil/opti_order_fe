"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
// import AddOrderDialog from "./AddOrderDialog";
// import AddOrderDialog from "@/components/AddOrderDialog";
import AddOrderDialog from "@/components/orders/AddOrderDialog";
// import { Order } from "./types";
import { Order } from "@/lib/types";
import { LoaderIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const json = await res.json();
    setOrders(json.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = filterDate
    ? orders.filter(
      (order) =>
        new Date(order.order_date).toISOString().split("T")[0] ===
        filterDate
    )
    : orders;

  return (
    isLoading ? (
      // <Skeleton></Skeleton>
      <>
        <div className="mt-24">

          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>        </div>
      </>
    ) : (
      <div className="p-6 space-y-6 pt-10 mt-10">
        <div className="flex font-extrabold text-4xl justify-center text-gray-600">

        </div>

        <div className="flex items-center justify-between">
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-64"
          />
          <AddOrderDialog onSuccess={fetchOrders} />
        </div>

        <DataTable columns={columns} data={filteredOrders} />
      </div>
    )

  );
}
