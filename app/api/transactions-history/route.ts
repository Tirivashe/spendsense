import { getFormatterForCurrency } from "@/lib/helpers";
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
  const transactions = await getTransactionsHistory(user.id, fromDate, toDate);
  return Response.json(transactions);
}

export type GetTransactionHistoryReturnType = Awaited<
  ReturnType<typeof getTransactionsHistory>
>;

async function getTransactionsHistory(
  userId: string,
  fromDate: Date,
  toDate: Date
) {
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId },
  });
  if (!userSettings) throw new Error("User settings not found");

  const formatter = getFormatterForCurrency(userSettings.currency);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: fromDate,
        lte: toDate,
      },
    },
    orderBy: {
      date: "desc",
    },
  });
  return transactions.map((transaction) => {
    return {
      ...transaction,
      formattedAmount: formatter.format(transaction.amount),
    };
  });
}
