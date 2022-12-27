import { prisma } from "../../config/prisma";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { getProducts, getProductsTypes } from "../../types/getProducts";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    const {
      skip,
      take,
      priceFrom,
      priceTo,
      category,
      stockFrom,
      stockTo,
      dates,
    }: getProductsTypes = req.query;

    const response = getProducts.safeParse(req.query);
    if (!response.success) {
      return res.status(400).json(response?.error?.issues);
    }
    const products = await prisma.product.findMany({
      where: {
        userId: session?.user?.id,
        price: {
          in:
            priceFrom && priceTo
              ? [parseInt(priceFrom), parseInt(priceTo)]
              : undefined,
        },
        category: {
          name: {
            equals: category ? category : undefined,
          },
        },
        date: {
          every: {
            stock: {
              in:
                stockFrom && stockTo
                  ? [parseInt(stockFrom), parseInt(stockTo)]
                  : undefined,
            },
          },
        },
      },
      skip: skip ? parseInt(skip) : 0,
      take: take ? parseInt(take) : 3,
      orderBy: [
        {
          lastUpdated: "desc",
        },
      ],
      select: {
        id: true,
        price: true,
        lastUpdated: true,
        description: true,
        categoryId: true,
        category: {
          select: {
            name: true,
          },
        },
        name: true,
        date: {
          take: dates ? parseInt(dates) : 1,
          orderBy: {
            date: "desc",
          },
          select: {
            id: true,
            stock: true,
            date: true,
          },
        },
      },
    });
    res.json(products);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
  res.end();
};
