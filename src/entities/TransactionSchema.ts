import { z } from "zod";
import { CategorySchema } from "./CategorySchema";

export const TransactionSchema = z.object({
  date: z
    .string()
    .min(1, "Date is required")
    .refine((val) => !isNaN(new Date(val).getTime()), "Invalid date")
    .refine(
      (val) => new Date(val) < new Date("2000-01-01"),
      "Date must be after January 1, 2000",
    ),

  title: z
    .string()
    .min(3, "Must be at least 3 characters")
    .max(128, "Must be at most 128 characters"),

  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => Number(val) > 0, "Must be greater than 0"),

  type: z.enum(["expense", "earning"]),

  categories: z.array(CategorySchema).min(1, "Select at leasts one category"),
});

export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransaction = Transaction;
