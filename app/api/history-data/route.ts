import prisma from "@/lib/prisma";
import { Period } from "@/lib/types";
import { getUserOrRedirect } from "@/utils/common";
import dayjs from "dayjs";
import { z } from "zod";

export async function GET(request: Request) {
  const user = await getUserOrRedirect();
  const getHistoryDataSchema = z.object({
    timeframe: z.enum(["month", "year"]),
    month: z.coerce.number().min(0).max(11).default(0),
    year: z.coerce.number().min(2000).max(3000),
  });

  const { searchParams } = new URL(request.url);
  const parsedBody = getHistoryDataSchema.safeParse({
    timeframe: searchParams.get("timeframe"),
    month: searchParams.get("month"),
    year: searchParams.get("year"),
  });
  if (!parsedBody.success) {
    return Response.json(parsedBody.error.message, {
      status: 400,
    });
  }

  const data = await getHistoryData(user.id, parsedBody.data.timeframe, {
    month: parsedBody.data.month,
    year: parsedBody.data.year,
  });

  return Response.json(data);
}

export type GetHistoryDataResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;

async function getHistoryData(
  userId: string,
  timeframe: "month" | "year",
  period: Period
) {
  switch (timeframe) {
    case "year":
      return await getYearHistoryData(userId, period.year);
    case "month":
      return await getMonthHistoryData(userId, period.year, period.month);
  }
}

type HistoryData = {
  month: number;
  year: number;
  income: number;
  expense: number;
  day?: number;
};

async function getYearHistoryData(userId: string, year: number) {
  const result = await prisma.yearHistory.groupBy({
    by: ["month"],
    where: {
      userId,
      year,
    },
    _sum: {
      income: true,
      expense: true,
    },
    orderBy: {
      month: "asc",
    },
  });
  if (!result || result.length === 0) return [];

  const historyData: HistoryData[] = [];

  for (let i = 0; i < 12; i++) {
    let expense = 0,
      income = 0;
    const month = result.find((row) => row.month === i);
    if (month) {
      expense = month._sum.expense || 0;
      income = month._sum.income || 0;
    }
    historyData.push({
      month: i,
      year,
      income,
      expense,
    });
  }

  return historyData;
}

async function getMonthHistoryData(
  userId: string,
  year: number,
  month: number
) {
  const result = await prisma.monthHistory.groupBy({
    by: ["day"],
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      income: true,
      expense: true,
    },
    orderBy: {
      day: "asc",
    },
  });

  if (!result || result.length === 0) return [];

  const historyData: HistoryData[] = [];
  const daysInMonth = dayjs(new Date(year, month)).daysInMonth();

  for (let i = 0; i <= daysInMonth; i++) {
    let expense = 0,
      income = 0;
    const day = result.find((row) => row.day === i);
    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }
    historyData.push({
      month,
      year,
      income,
      expense,
      day: i,
    });
  }

  return historyData;
}
