import { z } from "zod";
const PatchCategorySchema = z.object({
  id: z.string().min(1, { message: "Id should have at least 1 letter" }),
  name: z.string().min(2, { message: "Name should have at least 2 letters" }),
});

type PatchCategory = z.infer<typeof PatchCategorySchema>;
export { PatchCategorySchema, type PatchCategory };
