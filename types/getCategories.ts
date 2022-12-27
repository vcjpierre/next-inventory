import { Category, Date, Product } from "@prisma/client";

export type CategoryProduct = Product & { date: Date[] };

export interface GetCategory {
  name: Category["name"];
  id: Category["id"];
  products: CategoryProduct[];
}
