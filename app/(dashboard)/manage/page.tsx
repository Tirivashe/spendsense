"use client";
import React from "react";
import classes from "./manage.module.css";
import { Box, Paper, Text, Title } from "@mantine/core";
import CurrencySelector from "@/components/CurrencySelector";
import CategoryList from "./_components/CategoryList";

const Manage = () => {
  return (
    <Box>
      <Paper px="2.5rem" py="1.5rem" className={classes.paper}>
        <Title order={2} c="white">
          Manage
        </Title>
        <Text size="xs" c="dimmed">
          Manage your account settings and categories
        </Text>
      </Paper>
      <Paper px="2.5rem" py="1.5rem" mt="lg" className={classes.paper}>
        <Title order={2} c="white" py="xs">
          Currency
        </Title>
        <Box mt={-10}>
          <CurrencySelector />
        </Box>
      </Paper>
      <CategoryList type="income" />
      <CategoryList type="expense" />
    </Box>
  );
};
export default Manage;
