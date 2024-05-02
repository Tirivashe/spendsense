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

  const stats = await getBalanceStats(user.id, fromDate, toDate);
  return Response.json(stats);
}

export type GetBalanceResponseType = Awaited<
  ReturnType<typeof getBalanceStats>
>;

async function getBalanceStats(userId: string, fromDate: Date, toDate: Date) {
  const total = await prisma.transaction.groupBy({
    by: ["type"],
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
  });

  const expense = total.find((t) => t.type === "expense")?._sum.amount || 0;
  const income = total.find((t) => t.type === "income")?._sum.amount || 0;

  return { expense, income };
}
