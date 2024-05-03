"use client";
import { GetBalanceResponseType } from "@/app/api/stats/balance/route";
import { DateToUTCDate, getFormatterForCurrency } from "@/lib/helpers";
import { SimpleGrid, Skeleton } from "@mantine/core";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import StatCard from "../StatCard";
import {
  IconTrendingDown,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";
import classes from "./statscards.module.css";

type Props = {
  userSettings: UserSettings;
  from: Date | null;
  to: Date | null;
};

const StatsCards = ({ userSettings, from, to }: Props) => {
  const fromDate = from || dayjs().startOf("M").toDate();
  const toDate = to || new Date();

  const { data, isFetching, isLoading } = useQuery<GetBalanceResponseType>({
    queryKey: ["overview", "stats", fromDate, toDate],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(fromDate)}&to=${DateToUTCDate(
          toDate
        )}`
      ).then((res) => res.json()),
  });
  const income = data?.income || 0;
  const expense = data?.expense || 0;
  const balance = income - expense;
  const formatter = useMemo(() => {
    return getFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  if (isFetching || isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="5px" pt="xl" pb="5px">
        <Skeleton height={100} />
        <Skeleton height={100} />
        <Skeleton height={100} />
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid spacing="5px" cols={{ base: 1, sm: 3 }} pt="xl" pb="5px">
      <StatCard
        title="Income"
        value={income}
        icon={
          <IconTrendingUp
            size={50}
            className={`${classes.icon} ${classes["icon-income"]}`}
          />
        }
        currency={formatter}
      />
      <StatCard
        title="Expense"
        value={expense}
        currency={formatter}
        icon={
          <IconTrendingDown
            size={50}
            className={`${classes.icon} ${classes["icon-expense"]}`}
          />
        }
      />
      <StatCard
        title="Balance"
        value={balance}
        icon={
          <IconWallet
            size={50}
            className={`${classes.icon} ${classes["icon-balance"]}`}
          />
        }
        currency={formatter}
      />
    </SimpleGrid>
  );
};

export default StatsCards;
