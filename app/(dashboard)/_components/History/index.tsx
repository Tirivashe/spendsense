"use client";
import { getFormatterForCurrency } from "@/lib/helpers";
import { Period, Timeframe } from "@/lib/types";
import {
  Box,
  Center,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { BarChart } from "@mantine/charts";
import { UserSettings } from "@prisma/client";
import React, { useCallback, useMemo, useState } from "react";
import classes from "./history.module.css";
import HistoryPeriodSelector from "../HistoryPeriodSelector";
import { useQuery } from "@tanstack/react-query";
import { GetHistoryDataResponseType } from "@/app/api/history-data/route";
import dayjs from "dayjs";
import { TooltipProps } from "recharts";
import CountUp from "react-countup";

type Props = {
  userSettings: UserSettings;
};

const History = ({ userSettings }: Props) => {
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const formatter = useMemo(() => {
    return getFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const formatFn = useCallback(
    (val: number) => formatter.format(val),
    [formatter]
  );

  const { data, isFetching, isLoading } = useQuery<GetHistoryDataResponseType>({
    queryKey: ["overview", "history", timeframe, period],
    queryFn: () =>
      fetch(
        `/api/history-data?timeframe=${timeframe}&month=${period.month}&year=${period.year}`
      ).then((res) => res.json()),
  });

  const renderCustomTooltip = useCallback(
    ({ active, payload }: TooltipProps<any, any>) => {
      if (active && payload && payload.length) {
        const balance = payload[0].value - payload[1].value;
        const { year, month, day } = payload[0].payload;
        let date: Date;
        let displayDate: string;
        if (day) {
          date = new Date(year, month, day);
          displayDate = dayjs(date).format("ddd, MMM DD, YYYY");
        } else {
          date = new Date(year, month);
          displayDate = dayjs(date).format("MMM YYYY");
        }
        return (
          <Paper withBorder px="md" py="sm" maw={300}>
            <Text>{displayDate}</Text>
            <Box py="sm">
              {payload.map((item) => (
                <React.Fragment key={item.name}>
                  <Group justify="space-between" align="center">
                    <Text
                      tt="capitalize"
                      data-label={item.name}
                      className={classes["tooltip-label"]}
                    >
                      {item.name}
                    </Text>
                    <CountUp
                      preserveValue
                      end={item.value}
                      decimals={2}
                      formattingFn={formatFn}
                      redraw={false}
                      data-label={item.name}
                      className={classes["tooltip-value"]}
                      duration={0.3}
                    />
                  </Group>
                </React.Fragment>
              ))}
              <Group justify="space-between" align="center">
                <Text data-label="balance" className={classes["tooltip-label"]}>
                  Balance
                </Text>
                <CountUp
                  preserveValue
                  end={balance}
                  decimals={2}
                  formattingFn={formatFn}
                  data-label="balance"
                  redraw={false}
                  className={classes["tooltip-value"]}
                  duration={0.3}
                />
              </Group>
            </Box>
          </Paper>
        );
      }

      return null;
    },
    [formatFn]
  );

  const xAxisDataFormatter = useCallback(
    (data: GetHistoryDataResponseType[0]) => {
      const { year, month, day } = data;
      if (day) {
        const date = new Date(year, month, day);
        return dayjs(date).format("DD");
      }
      const date = new Date(year, month);
      return dayjs(date).format("MMM");
    },
    []
  );

  const dataIsAvailable = data && data.length > 0;

  return (
    <Box>
      <Title order={2} c="white" py="lg">
        History
      </Title>
      <Paper className={classes.paper}>
        <Group align="center" justify="space-between" p="lg">
          <HistoryPeriodSelector
            period={period}
            setPeriod={setPeriod}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
        </Group>
        {(isFetching || isLoading) && (
          <Skeleton h={400} w="100%" radius="md" mt="sm" />
        )}
        {!dataIsAvailable && !isFetching && !isLoading && (
          <Center
            h="400"
            w="100%"
            style={{
              border: "1px solid var(--mantine-color-gray-9)",
              borderRadius: "var(--mantine-radius-md)",
            }}
          >
            <Stack gap={0}>
              <Text ta="center" fz="h2" fw="bold" c="white">
                No data for the selected period
              </Text>
              <Text ta="center" size="xs" c="dimmed" mt={-5}>
                Try selecting a different period or adding transactions
              </Text>
            </Stack>
          </Center>
        )}
        {dataIsAvailable && !isFetching && !isLoading && (
          <BarChart
            px="lg"
            withLegend
            h={400}
            data={data}
            valueFormatter={(value) => formatter.format(value)}
            dataKey={timeframe === "year" ? "month" : "day"}
            xAxisProps={{
              dataKey: xAxisDataFormatter,
            }}
            yAxisProps={{ tickMargin: -20 }}
            tooltipProps={{
              content: renderCustomTooltip,
            }}
            series={[
              { name: "income", color: "green.5", label: "Income" },
              { name: "expense", color: "red.5", label: "Expense" },
            ]}
            xAxisLabel={timeframe === "year" ? "Month" : "Date"}
            yAxisLabel="Amount"
            tooltipAnimationDuration={200}
          />
        )}
      </Paper>
    </Box>
  );
};

export default History;
