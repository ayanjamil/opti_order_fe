import { z } from "zod";

export type CustomerData = {
    name: string;
    phone: string;
    email: string;
};

export type CustomerErrors = {
    name?: string;
    phone?: string;
    email?: string;
};

const NAME_PATTERN = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/;

export const customerSchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Customer name is required")
        .regex(NAME_PATTERN, {
            message: "Name must start with a letter and can only contain letters, spaces, apostrophes, periods, and hyphens (2-80 chars)"
        }),
    phone: z.string()
        .min(1, "Phone number is required")
        .regex(/^\d{10}$/, {
            message: "Phone number must be exactly 10 digits"
        }),
    email: z.string()
        .trim()
        .min(1, "Email address is required")
        .email({
            message: "Please enter a valid email address"
        }),
});

export function sanitizeCustomerData(customerData: Partial<CustomerData>): CustomerData {
    return {
        name: (customerData.name || "").replace(/\s+/g, " ").trim(),
        phone: (customerData.phone || "").replace(/\D/g, "").slice(0, 10),
        email: (customerData.email || "").trim().toLowerCase(),
    };
}

export function validateCustomerFields(customerData: Partial<CustomerData>): CustomerErrors {
    const normalized = sanitizeCustomerData(customerData);
    const result = customerSchema.safeParse(normalized);

    if (result.success) {
        return {};
    }

    const errors: CustomerErrors = {};
    for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof CustomerErrors;
        if (!errors[path]) {
            errors[path] = issue.message;
        }
    }
    return errors;
}

export function validateCustomerData(customerData: Partial<CustomerData>): string | null {
    const errors = validateCustomerFields(customerData);
    if (errors.name) return errors.name;
    if (errors.phone) return errors.phone;
    if (errors.email) return errors.email;
    return null;
}
