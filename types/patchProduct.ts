import { z } from "zod";
const patchProductSchema = z.object({
  id: z.string().min(1, { message: "Id should have at least 1 letter" }),
  name: z.string().min(1, { message: "Name is required" }).optional(),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .optional(),
  price: z
    .number()
    .min(0, { message: "Price should be greater than 0" })
    .optional(),
  Date: z
    .object({
      date: z.date().optional(),
      stock: z.number().optional(),
    })
    .optional(),
  categoryId: z.string().min(0, { message: "ID is required" }).optional(),
});

type patchProductTypes = z.infer<typeof patchProductSchema>;

export { patchProductSchema, type patchProductTypes };
