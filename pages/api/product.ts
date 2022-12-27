import { prisma } from "../../config/prisma";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { postProductSchema } from "../../types/postProduct";
import { patchProductSchema } from "../../types/patchProduct";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    if (req.method === "POST") {
      const { name, price, description, categoryId } = req.body;
      const response = postProductSchema.safeParse(req.body);
      if (!response.success) {
        return res.status(400).json(response.error.issues);
      }
      try {
        const product = await prisma.product.create({
          data: {
            name: name,
            price: parseFloat(price.toFixed(2)),
            description: description,
            category: {
              connect: {
                id: categoryId,
              },
            },
            user: {
              connect: {
                id: session.user?.id,
              },
            },
            date: {
              create: {
                date: new Date() as any,
                stock: 0,
              },
            },
          },
        });
        return res.status(200).json(product);
      } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Something went wrong" });
      }
    }
    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: "id is required" });
      }
      try {
        const product = await prisma.product.deleteMany({
          where: {
            userId: session.user?.id,
            id: id.toString(),
          },
        });
        return res.status(200).json(product);
      } catch (e) {
        return res.status(500).json({ message: "Something went wrong" });
      }
    }

    if (req.method === "PATCH") {
      const { id, name, price, description, categoryId } = req.body;
      console.log(id, name, price, description, categoryId);
      const response = patchProductSchema.safeParse(req.body);
      if (!response.success) {
        return res.status(400).json(response.error.issues);
      }

      try {
        const product = await prisma.product.updateMany({
          where: {
            id: id.toString(),
            userId: session.user?.id,
          },
          data: {
            name: name ? name : undefined,
            price: price ? parseFloat(price.toFixed(2)) : undefined,
            description: description ? description : undefined,
            categoryId: categoryId ? categoryId : undefined,
            lastUpdated: new Date() as any,
          },
        });
        return res.status(200).json(product);
      } catch (e) {
        return res.status(500).json({ message: "Something went wrong" });
      }
    }
  } else {
    return res.status(401).end();
  }
};
