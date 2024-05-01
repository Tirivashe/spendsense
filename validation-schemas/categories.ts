import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(3, "Name is required and must be at least 3 characters long")
    .max(20),
  icon: z.string().min(1, "Icon is required").max(20),
  type: z.enum(["income", "expense"]),
});

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;
