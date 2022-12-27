import { z } from "zod";
const PostDateSchema = z.object({
  productId: z.string().min(1, { message: "Id should have at least 1 letter" }),
  date: z.date().optional(),
  stock: z
    .number()
    .min(0, { message: "Stock should be greater than 0" })
    .positive({ message: "Stock should be positive" }),
});

type PostDate = z.infer<typeof PostDateSchema>;
export { PostDateSchema, type PostDate };
