"use client";
import { Box, Button, Group, Popover, Title } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { UserSettings } from "@prisma/client";
import React, { useState } from "react";
import dayjs from "dayjs";
import { IconChevronDown } from "@tabler/icons-react";
import classes from "./overview.module.css";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import StatsCards from "../StatsCards";
import CategoryStats from "../CategoryStats";

type Props = {
  userSettings: UserSettings;
};

const Overview = ({ userSettings }: Props) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    dayjs().startOf("M").toDate(),
    new Date(),
  ]);
  const [from, to] = dateRange;
  const displayDates = (dateRange: [Date | null, Date | null]) => {
    if (!dateRange[0] || !dateRange[1]) return "Up to next 90 days";
    return `${dayjs(dateRange[0]).format("MMM DD, YYYY")} - ${dayjs(
      dateRange[1]
    ).format("MMM DD, YYYY")}`;
  };

  return (
    <Box py="lg">
      <Group justify="space-between" align="center">
        <Title order={2} c="white">
          Overview
        </Title>
        <Popover>
          <Popover.Target>
            <Button
              rightSection={<IconChevronDown />}
              variant="subtle"
              color="dimmed"
              className={classes.button}
            >
              {displayDates(dateRange)}
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <DatePicker
              value={dateRange}
              onChange={setDateRange}
              type="range"
              minDate={dayjs().startOf("M").toDate()}
              maxDate={dayjs()
                .add(MAX_DATE_RANGE_DAYS, "d")
                .startOf("M")
                .toDate()}
              classNames={{ monthCell: classes.datePicker }}
            />
          </Popover.Dropdown>
        </Popover>
      </Group>
      <StatsCards userSettings={userSettings} from={from} to={to} />
      <CategoryStats userSettings={userSettings} from={from} to={to} />
    </Box>
  );
};

export default Overview;
