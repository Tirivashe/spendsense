"use server";
import prisma from "@/lib/prisma";
import { getUserOrRedirect } from "@/utils/common";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/validation-schemas/categories";

export async function CreateCategory(form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Bad request");
  }

  const user = await getUserOrRedirect();
  const { icon, name, type } = parsedBody.data;

  return await prisma.category.create({
    data: {
      icon,
      name,
      type,
      userId: user.id,
    },
  });
}
