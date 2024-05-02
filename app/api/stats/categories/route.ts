import prisma from "@/lib/prisma";
import { getUserOrRedirect } from "@/utils/common";
import { OverviewQuerySchema } from "@/validation-schemas/overview";

export async function GET(request: Request) {
  const user = await getUserOrRedirect();

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const parsedBody = OverviewQuerySchema.safeParse({ from, to });
  if (!parsedBody.success) {
    return Response.json(parsedBody.error.message, {
      status: 400,
    });
  }
  const { from: fromDate, to: toDate } = parsedBody.data;

  const stats = await getCategoriesStats(user.id, fromDate, toDate);
  return Response.json(stats);
}

export type GetCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategoriesStats>
>;

async function getCategoriesStats(
  userId: string,
  fromDate: Date,
  toDate: Date
) {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryIcon"],
    where: {
      userId,
      date: {
        gte: fromDate,
        lte: toDate,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  return stats;
}
