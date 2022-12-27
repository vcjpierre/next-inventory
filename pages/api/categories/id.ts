import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "../../../config/prisma";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    try {
      const categories = await prisma.category.findMany({
        where: {
          userId: session?.user?.id,
        },
        select: {
          id: true,
          name: true,
        },
      });
      res.status(200).json(categories);
    } catch (e) {
      res.status(500).json({ message: "Something Went Wrong" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
  res.end();
};
