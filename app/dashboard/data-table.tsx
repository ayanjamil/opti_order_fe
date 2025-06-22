"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import Link from "next/link";

interface DataTableProps<TData extends { id: string }, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData extends { id: string }, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.map((row) => {
                        const orderId = row.original.id;

                        return (
                            <TableRow
                                key={row.id}
                                className="cursor-pointer hover:bg-muted transition-colors"
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => {
                                    const columnId = cell.column.id;

                                    // Columns like "actions" and "status" shouldn't link
                                    const isNonClickable = columnId === "actions" || columnId === "status";

                                    return (
                                        <TableCell key={cell.id}>
                                            {isNonClickable ? (
                                                flexRender(cell.column.columnDef.cell, cell.getContext())
                                            ) : (
                                                <Link href={`/dashboard/${orderId}`} className="block w-full h-full">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </Link>
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>

            </Table>
        </div>
    );
}
