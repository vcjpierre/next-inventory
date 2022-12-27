import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../config/prisma";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    const categories = await prisma.category.findMany({
      where: {
        userId: session?.user?.id,
      },
      select: {
        products: {
          select: {
            name: true,
            price: true,
            id: true,
            lastUpdated: true,
            date: {
              select: {
                stock: true,
              },
              take: 1,
            },
          },
        },
        name: true,
        id: true,
      },
    });

    res.json(categories);
  } else {
    res.status(401).json({ message: "You are not authenticated" });
  }
  res.end();
};
