"use server";

import prisma from "@/lib/prisma";
import { getUserOrRedirect } from "@/utils/common";
import { UpdateUserCurrencySchema } from "@/validation-schemas/userSettings";

export async function UpdateUserCurrency(currency: string) {
  const parsedBody = UpdateUserCurrencySchema.safeParse({
    currency,
  });

  if (!parsedBody.success) throw parsedBody.error;

  const user = await getUserOrRedirect();

  const userSettings = await prisma.userSettings.update({
    where: { userId: user.id },
    data: { currency },
  });

  return userSettings;
}
