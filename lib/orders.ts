import { getSql } from "@/lib/db";
import { sanitizeCustomerData, validateCustomerData } from "@/lib/orderValidation";

type OrderItem = {
    description?: string;
    price?: string | number;
    quantity?: string | number;
};

type PurchaseDetails = {
    frames?: OrderItem[];
    glasses?: OrderItem[];
    advance_paid?: number;
    total_amount?: number;
};

const toNumber = (value: unknown): number => {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : 0;
};

const itemTotal = (items: OrderItem[] = []) =>
    items.reduce((sum, item) => {
        const quantity = toNumber(item.quantity) || 1;
        return sum + toNumber(item.price) * quantity;
    }, 0);

export function withTotalAmount(purchaseDetails: PurchaseDetails = {}) {
    const totalAmount =
        itemTotal(purchaseDetails.frames) + itemTotal(purchaseDetails.glasses);

    return {
        ...purchaseDetails,
        total_amount: totalAmount,
    };
}

export async function listOrders() {
    const sql = getSql();

    return (await sql`
        SELECT *
        FROM orders
        WHERE deleted_at IS NULL
        ORDER BY order_date DESC
    `) as any[];
}

export async function getOrderById(id: string) {
    const sql = getSql();
    const rows = (await sql`
        SELECT *
        FROM orders
        WHERE id = ${id}
        LIMIT 1
    `) as any[];

    return rows[0] ?? null;
}

export async function createOrder(body: any) {
    const sql = getSql();
    const customerData = sanitizeCustomerData(body.customer_data ?? {});
    const customerValidationError = validateCustomerData(customerData);

    if (customerValidationError) {
        throw new Error(customerValidationError);
    }

    const purchaseDetails = withTotalAmount(body.purchase_details);

    const rows = (await sql`
        INSERT INTO orders (
            customer_data,
            purchase_details,
            power_details,
            status
        )
        VALUES (
            ${JSON.stringify(customerData)}::jsonb,
            ${JSON.stringify(purchaseDetails)}::jsonb,
            ${JSON.stringify(body.power_details ?? {})}::jsonb,
            'pending'
        )
        RETURNING *
    `) as any[];

    return rows[0];
}

export async function updateOrder(id: string, updates: any) {
    const sql = getSql();
    const values: unknown[] = [];
    const assignments: string[] = [];

    const addAssignment = (column: string, value: unknown, cast = "") => {
        values.push(value);
        assignments.push(`${column} = $${values.length}${cast}`);
    };

    if ("customer_data" in updates) {
        const customerData = sanitizeCustomerData(updates.customer_data ?? {});
        const customerValidationError = validateCustomerData(customerData);

        if (customerValidationError) {
            throw new Error(customerValidationError);
        }

        addAssignment("customer_data", JSON.stringify(customerData), "::jsonb");
    }

    if ("purchase_details" in updates) {
        addAssignment(
            "purchase_details",
            JSON.stringify(withTotalAmount(updates.purchase_details)),
            "::jsonb"
        );
    }

    if ("power_details" in updates) {
        addAssignment("power_details", JSON.stringify(updates.power_details), "::jsonb");
    }

    if ("status" in updates) {
        addAssignment("status", updates.status);
    }

    if ("notes" in updates) {
        addAssignment("notes", updates.notes);
    }

    if ("deleted_at" in updates) {
        addAssignment("deleted_at", updates.deleted_at);
    }

    if (assignments.length === 0) {
        return getOrderById(id);
    }

    values.push(id);

    const rows = (await sql.query(
        `
            UPDATE orders
            SET ${assignments.join(", ")}
            WHERE id = $${values.length}
            RETURNING *
        `,
        values
    )) as any[];

    return rows[0] ?? null;
}

export async function deleteOrder(id: string) {
    const sql = getSql();

    await sql`
        DELETE FROM orders
        WHERE id = ${id}
    `;
}
