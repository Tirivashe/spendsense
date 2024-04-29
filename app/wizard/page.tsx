import Logo from "@/components/Logo";
import {
  Button,
  Center,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import React from "react";
import classes from "./wizardpage.module.css";
import CurrencySelector from "@/components/CurrencySelector";
import Link from "next/link";
import { getUserOrRedirect } from "@/utils/common";

const WizardPage = async () => {
  const user = await getUserOrRedirect();
  return (
    <Center h="100vh">
      <Paper component={Stack} justify="center" gap="xs" px="md">
        <Text fz="h1" ta="center">
          Welcome,{" "}
          <Text span fz="h1" fw="bold" c="white">
            {user.firstName}! 👋
          </Text>
        </Text>
        <Text fz="h3" ta="center">
          Let&apos;s get you set up with your currency of choice
        </Text>
        <Text ta="center" fz="h4">
          You can change your settings at any time
        </Text>
        <Divider my="md" className={classes.divider} />
        <Paper
          component={Stack}
          justify="center"
          gap="xs"
          withBorder
          p="md"
          radius="md"
          className={classes["currency-paper"]}
        >
          <Text fz="h2" c="white" fw="bold">
            Currency
          </Text>
          <CurrencySelector />
        </Paper>
        <Divider my="md" className={classes.divider} />
        <Button className={classes.button} mx="md" component={Link} href="/">
          I&apos;m done! Take me to the dashboard
        </Button>
        <Group align="center" justify="center" mt="md">
          <Logo />
        </Group>
      </Paper>
    </Center>
  );
};

export default WizardPage;
