import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { Button, Popover } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconChevronDown } from "@tabler/icons-react";
import dayjs from "dayjs";
import React from "react";
import classes from "./daterangepicker.module.css";

type Props = {
  dateRange: [Date | null, Date | null];
  setDateRange: React.Dispatch<
    React.SetStateAction<[Date | null, Date | null]>
  >;
};

const DateRangePicker = ({ dateRange, setDateRange }: Props) => {
  const displayDates = (dateRange: [Date | null, Date | null]) => {
    if (!dateRange[0] || !dateRange[1]) return "Up to next 90 days";
    return `${dayjs(dateRange[0]).format("MMM DD, YYYY")} - ${dayjs(
      dateRange[1]
    ).format("MMM DD, YYYY")}`;
  };
  return (
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
          maxDate={dayjs().add(MAX_DATE_RANGE_DAYS, "d").startOf("M").toDate()}
          classNames={{ monthCell: classes.datePicker }}
        />
      </Popover.Dropdown>
    </Popover>
  );
};

export default DateRangePicker;
