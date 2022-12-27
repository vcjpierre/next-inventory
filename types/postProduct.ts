import { z } from "zod";

const postProductSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  price: z.number().min(0, { message: "Price must be greater than 0" }),
  description: z.string().min(1, { message: "Description is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
});

type postProductTypes = z.infer<typeof postProductSchema>;

export default postProductTypes;
export { postProductSchema, type postProductTypes };
