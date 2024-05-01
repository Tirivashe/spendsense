import prisma from "@/lib/prisma";
import { getUserOrRedirect } from "@/utils/common";
import { z } from "zod";

export async function GET(request: Request) {
  const user = await getUserOrRedirect();
  const { searchParams } = new URL(request.url);
  const paramType = searchParams.get("type");

  const validator = z.enum(["income", "expense"]).nullable();
  const queryParams = validator.safeParse(paramType);
  if (!queryParams.success) {
    return Response.json(queryParams.error, {
      status: 400,
    });
  }

  const type = queryParams.data;
  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }), // this includes the value into an object if it is defined
    },
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(categories);
}
