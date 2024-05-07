"use server";

import prisma from "@/lib/prisma";
import { getUserOrRedirect } from "@/utils/common";

export async function DeleteTransaction(id: string) {
  const user = await getUserOrRedirect();

  const transaction = await prisma.transaction.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });

  if (!transaction) throw new Error("Bad request");

  await prisma.$transaction([
    prisma.transaction.delete({
      where: {
        id,
        userId: user.id,
      },
    }),
    prisma.monthHistory.update({
      where: {
        userId_day_month_year: {
          userId: user.id,
          day: transaction.date.getUTCDate() + 1,
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
    prisma.yearHistory.update({
      where: {
        userId_month_year: {
          userId: user.id,
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
  ]);
}
