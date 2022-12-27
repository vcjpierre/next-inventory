import { prisma } from "../../config/prisma";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { PostCategorySchema } from "../../types/postCategory";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    const delAcc = await prisma.user.delete({
      where: {
        id: session?.user?.id,
      },
    });
    res.status(401).json(delAcc?.id);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
  res.end();
};
