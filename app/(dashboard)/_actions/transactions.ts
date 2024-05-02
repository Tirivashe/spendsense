"use server";

import prisma from "@/lib/prisma";
import { getUserOrRedirect } from "@/utils/common";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/validation-schemas/transaction";

export const CreateTransaction = async (
  values: CreateTransactionSchemaType
) => {
  const parsedBody = CreateTransactionSchema.safeParse(values);
  if (!parsedBody.success) throw new Error(parsedBody.error.message);

  const user = await getUserOrRedirect();
  const { amount, category, date, type, description } = parsedBody.data;
  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });
  if (!categoryRow) throw new Error("Category not found");

  await prisma.$transaction([
    // create a new transaction
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        category: categoryRow.name,
        date,
        type,
        description: description || "",
        categoryIcon: categoryRow.icon,
      },
    }),

    prisma.monthHistory.upsert({
      where: {
        userId_day_month_year: {
          userId: user.id,
          day: date.getUTCDate() + 1,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate() + 1,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        income: type === "income" ? amount : 0,
        expense: type === "expense" ? amount : 0,
      },
      update: {
        income: {
          increment: type === "income" ? amount : 0,
        },
        expense: {
          increment: type === "expense" ? amount : 0,
        },
      },
    }),

    prisma.yearHistory.upsert({
      where: {
        userId_month_year: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        income: type === "income" ? amount : 0,
        expense: type === "expense" ? amount : 0,
      },
      update: {
        income: {
          increment: type === "income" ? amount : 0,
        },
        expense: {
          increment: type === "expense" ? amount : 0,
        },
      },
    }),
  ]);
};
