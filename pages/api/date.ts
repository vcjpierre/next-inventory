import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../config/prisma";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { DateTime } from "luxon";
import { PostDateSchema } from "../../types/postDate";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session) {
    //post new date to product
    if (req.method === "POST") {
      const { productId, stock, date } = req.body;
      let prismaDate = DateTime.fromISO(date ? date : new date()).toJSDate();
      const isValid = PostDateSchema.safeParse({
        productId,
        stock,
        date: prismaDate,
      });

      if (!isValid.success) {
        console.log(isValid.error);
        return res.status(400).json({
          message: isValid?.error.issues,
        });
      }

      const requestDate = DateTime.fromISO(date).toJSDate();
      const now = new Date();
      requestDate.setHours(now.getHours());
      requestDate.setMinutes(now.getMinutes());
      requestDate.setSeconds(now.getSeconds());

      const product = await prisma.product.findMany({
        where: {
          id: productId,
          userId: session.user?.id,
        },
      });

      if (product.length > 0) {
        try {
          const product = await prisma.product.update({
            where: {
              id: productId,
            },
            data: {
              date: {
                create: {
                  stock: stock,
                  date: date ? requestDate : (Date.now() as any),
                },
              },
            },
          });
          res.json(product);
        } catch (e) {
          console.log(e);
          res.status(500).json({ message: "Something went wrong" });
        }
      }
    }

    //delete date from product
    if (req.method === "DELETE") {
      const { productId, id } = req.body;
      try {
        const deletedDate = await prisma.date.deleteMany({
          where: {
            id: id,
            productId: productId,
            product: {
              userId: session.user?.id,
            },
          },
        });
        if (deletedDate.count > 0) {
          res.json({ message: "Date deleted", date: deletedDate });
        } else {
          res.status(404).json({ message: "Date not found" });
        }
      } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Something went wrong" });
      }
    }
  } else {
    res.status(401).json({
      message: "You are not authorized to perform this action",
    });
  }
  res.end();
};
