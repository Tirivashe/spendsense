import {
  Center,
  Group,
  Paper,
  Progress,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import React, { useCallback } from "react";
import classes from "./categorycard.module.css";
import { TransactionType } from "@/lib/types";
import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";

type Props = {
  type: TransactionType;
  data: GetCategoriesStatsResponseType;
  currency: Intl.NumberFormat;
};

const CategoryCard = ({ data, type, currency }: Props) => {
  const formatFn = useCallback(
    (val: number) => {
      return currency.format(val);
    },
    [currency]
  );
  const statsByType = data.filter((stat) => stat.type === type);
  const total = statsByType.reduce(
    (acc, curr) => acc + (curr._sum?.amount || 0),
    0
  );
  return (
    <Paper withBorder className={classes.paper} px="lg" py="md">
      <Title order={2}>
        {type === "income" ? "Incomes" : "Expenses"} by category
      </Title>
      {statsByType.length < 1 && (
        <Stack align="center" justify="center" h={300} gap={0}>
          <Title order={2} ta="center">
            No data for selected period
          </Title>
          <Text size="xs" ta="center">
            Try selecting a different period or adding a new {type}
          </Text>
        </Stack>
      )}
      {statsByType.length >= 1 && (
        <ScrollArea h={300} px="sm">
          <Stack gap="lg" p="md">
            {statsByType.map((stat) => {
              const amount = stat._sum?.amount || 0;
              const percentage = (amount * 100) / (total || amount);
              return (
                <React.Fragment key={stat.category}>
                  <Stack gap="sm">
                    <Group align="center" justify="space-between">
                      <Text>
                        {stat.categoryIcon} {stat.category} (
                        {percentage.toFixed(0)}%)
                      </Text>
                      <Text>{currency.format(amount)}</Text>
                    </Group>
                    <Progress
                      value={percentage}
                      color={type === "income" ? "green.5" : "red.5"}
                    />
                  </Stack>
                </React.Fragment>
              );
            })}
          </Stack>
        </ScrollArea>
      )}
    </Paper>
  );
};

export default CategoryCard;
