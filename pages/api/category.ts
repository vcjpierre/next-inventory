import { prisma } from "../../config/prisma";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { PostCategorySchema } from "../../types/postCategory";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    if (req.method === "POST") {
      const { name } = req.body;
      const response = PostCategorySchema.safeParse(req.body);
      if (!response.success) return res.status(400).json(response.error.issues);
      try {
        const category = await prisma.category.create({
          data: {
            name: name,
            userId: session?.user?.id,
          },
        });
        res.status(201).json(category);
      } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Something went wrong" });
      }
    } else if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: "No id provided" });
      try {
        const category = await prisma.category.deleteMany({
          where: {
            userId: session.user?.id,
            id: id.toString(),
          },
        });
        res.status(201).json(category);
      } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Something went wrong" });
      }
    } else if (req.method === "PATCH") {
      const { id, name } = req.body;
      if (!id || !name)
        return res.status(400).json({ message: "No id  or name provided" });
      try {
        const category = await prisma.category.updateMany({
          where: {
            userId: session.user?.id,
            id: id.toString(),
          },
          data: {
            name: name,
          },
        });
        res.status(201).json(category);
      } catch {
        return res.status(500).json({ message: "Something went wrong" });
      }
    } else {
      res.status(400).json({ message: "Method not allowed" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
  res.end();
};
