"use client";
import { Box, Group, Paper, Title } from "@mantine/core";
import React, { useState } from "react";
import classes from "./transactions.module.css";
import dayjs from "dayjs";
import DateRangePicker from "@/components/DateRangePicker";
import TransactionTable from "@/components/TransactionTable";

type Props = {};

const Transactions = (props: Props) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    dayjs().startOf("M").toDate(),
    new Date(),
  ]);
  const [from, to] = dateRange;
  const fromDate = from ?? dayjs().startOf("M").toDate();
  const toDate = to ?? new Date();

  return (
    <Box>
      <Paper px="2.5rem" py="1.5rem" className={classes.paper}>
        <Group justify="space-between">
          <Title order={2} c="white">
            Transactions History
          </Title>
          <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
        </Group>
      </Paper>
      <TransactionTable from={fromDate} to={toDate} />
    </Box>
  );
};

export default Transactions;
