import prisma from "@/lib/prisma";
import { getUserOrRedirect } from "@/utils/common";
import { Box, Group, Text } from "@mantine/core";
import { redirect } from "next/navigation";
import React from "react";
import classes from "./dashbord.module.css";
import NewTransaction from "./_components/NewTransaction";

type Props = {};

const Dashboard = async (props: Props) => {
  const user = await getUserOrRedirect();
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  });

  if (!userSettings) redirect("/wizard");

  return (
    <Box>
      <Group
        justify="space-between"
        align="center"
        className={classes.container}
      >
        <Text fz="h3">
          Hello,{" "}
          <Text span fz="h3" fw="bolder" c="white">
            {user.firstName}
          </Text>{" "}
          👋
        </Text>
        <NewTransaction />
      </Group>
    </Box>
  );
};

export default Dashboard;
