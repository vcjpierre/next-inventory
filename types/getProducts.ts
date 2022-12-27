import { Date, Product, Category } from "@prisma/client";
import { z } from "zod";
const getProducts = z.object({
  skip: z.string().optional(),
  take: z.string().optional(),
  priceFrom: z.string().optional(),
  priceTo: z.string().optional(),
  category: z.string().optional(),
  stockFrom: z.string().optional(),
  stockTo: z.string().optional(),
  dates: z.string().optional(),
});

type getProductsTypes = z.infer<typeof getProducts>;
type ProductsWithDate = Product & { date: Date[] } & {
  category: { name: Category["name"] & { dates: Date[] } };
};

export default getProductsTypes;
export { getProducts, type getProductsTypes, type ProductsWithDate };
