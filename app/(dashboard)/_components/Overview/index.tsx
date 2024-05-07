"use client";
import { Box, Group, Title } from "@mantine/core";
import { UserSettings } from "@prisma/client";
import React, { useState } from "react";
import dayjs from "dayjs";
import StatsCards from "../StatsCards";
import CategoryStats from "../CategoryStats";
import DateRangePicker from "@/components/DateRangePicker";

type Props = {
  userSettings: UserSettings;
};

const Overview = ({ userSettings }: Props) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    dayjs().startOf("M").toDate(),
    new Date(),
  ]);
  const [from, to] = dateRange;

  return (
    <Box py="lg">
      <Group justify="space-between" align="center">
        <Title order={2} c="white">
          Overview
        </Title>
        <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      </Group>
      <StatsCards userSettings={userSettings} from={from} to={to} />
      <CategoryStats userSettings={userSettings} from={from} to={to} />
    </Box>
  );
};

export default Overview;
