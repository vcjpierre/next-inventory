import { z } from "zod";
const DeleteDateSchema = z.object({
  productId: z.string().min(1, { message: "Id should have at least 1 letter" }),
  id: z.string().min(1, { message: "Id should have at least 1 letter" }),
});

type DeleteDateTypes = z.infer<typeof DeleteDateSchema>;
export { DeleteDateSchema, type DeleteDateTypes };
