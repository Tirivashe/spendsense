import { Group, Paper, Stack, Text, Title } from "@mantine/core";
import React, { useCallback } from "react";
import classes from "./statcard.module.css";
import CountUp from "react-countup";

type Props = {
  title: string;
  value: number;
  icon: React.ReactNode;
  currency: Intl.NumberFormat;
};

const StatCard = ({ title, value, icon, currency }: Props) => {
  const formatFn = useCallback(
    (val: number) => {
      return currency.format(val);
    },
    [currency]
  );
  return (
    <Paper withBorder className={classes.paper} px="lg" py="md">
      <Group gap="sm">
        {icon}
        <Stack gap={0}>
          <Text size="sm" mb={-10}>
            {title}
          </Text>
          <CountUp
            preserveValue
            end={124}
            decimals={2}
            formattingFn={formatFn}
            redraw={false}
            style={{ fontSize: "2rem", fontWeight: 700 }}
          />
        </Stack>
      </Group>
    </Paper>
  );
};

export default StatCard;
