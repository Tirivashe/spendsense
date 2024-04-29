import prisma from "@/lib/prisma";
import { getUserOrRedirect } from "@/utils/common";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const user = await getUserOrRedirect();

  let userSettings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  });

  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        currency: "USD",
        userId: user.id,
      },
    });
  }

  revalidatePath("/");
  return Response.json(userSettings);
}
