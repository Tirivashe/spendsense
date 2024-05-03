"use client";
import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import { DateToUTCDate, getFormatterForCurrency } from "@/lib/helpers";
import { SimpleGrid, Skeleton } from "@mantine/core";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import CategoryCard from "../CategoryCard";

type Props = {
  userSettings: UserSettings;
  from: Date | null;
  to: Date | null;
};

const CategoryStats = ({ userSettings, from, to }: Props) => {
  const fromDate = from || dayjs().startOf("M").toDate();
  const toDate = to || new Date();
  const { data, isFetching, isLoading } =
    useQuery<GetCategoriesStatsResponseType>({
      queryKey: ["overview", "stats", "categories", fromDate, toDate],
      queryFn: () =>
        fetch(
          `/api/stats/categories?from=${DateToUTCDate(
            fromDate
          )}&to=${DateToUTCDate(toDate)}`
        ).then((res) => res.json()),
    });

  const formatter = useMemo(() => {
    return getFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  if (isFetching || isLoading || !data) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="5px">
        <Skeleton height={300} />
        <Skeleton height={300} />
      </SimpleGrid>
    );
  }
  return (
    <SimpleGrid spacing="5px" cols={{ base: 1, sm: 2 }}>
      <CategoryCard type="income" data={data} currency={formatter} />
      <CategoryCard type="expense" data={data} currency={formatter} />
    </SimpleGrid>
  );
};

export default CategoryStats;
