import { z } from "zod";
const PostCategorySchema = z.object({
  name: z.string().min(2, { message: "Name should have at least 2 letters" }),
});

type PostCategory = z.infer<typeof PostCategorySchema>;
export { PostCategorySchema, type PostCategory };
