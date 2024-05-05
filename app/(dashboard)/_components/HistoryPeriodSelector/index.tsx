import { GetHistoryPeriodsReturnType } from "@/app/api/history-period/route";
import { Period, Timeframe } from "@/lib/types";
import { Group, Select, Tabs } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import YearSelector from "./_components/YearSelector";
import MonthSelector from "./_components/MonthSelector";

type Props = {
  period: Period;
  setPeriod: React.Dispatch<React.SetStateAction<Period>>;
  timeframe: Timeframe;
  setTimeframe: React.Dispatch<React.SetStateAction<Timeframe>>;
};

const HistoryPeriodSelector = ({
  period,
  setPeriod,
  timeframe,
  setTimeframe,
}: Props) => {
  const { data, isFetching, isLoading } = useQuery<GetHistoryPeriodsReturnType>(
    {
      queryKey: ["overview", "history", "periods"],
      queryFn: () => fetch("/api/history-period").then((res) => res.json()),
    }
  );
  return (
    <Group align="center" gap="md" wrap="wrap">
      <Tabs
        value={timeframe}
        onChange={(value) => setTimeframe(value as Timeframe)}
      >
        <Tabs.List>
          <Tabs.Tab value="year" disabled={isFetching || isLoading}>
            Year
          </Tabs.Tab>
          <Tabs.Tab value="month" disabled={isFetching || isLoading}>
            Month
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <YearSelector
        period={period}
        setPeriod={setPeriod}
        years={data || []}
        disabled={isFetching || isLoading}
      />
      {timeframe === "month" && (
        <MonthSelector
          period={period}
          setPeriod={setPeriod}
          disabled={isFetching || isLoading}
        />
      )}
    </Group>
  );
};
export default HistoryPeriodSelector;
