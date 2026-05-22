import { z } from "zod";

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategories = string[];
