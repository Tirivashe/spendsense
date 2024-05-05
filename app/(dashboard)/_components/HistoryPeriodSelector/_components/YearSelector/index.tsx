import { GetHistoryPeriodsReturnType } from "@/app/api/history-period/route";
import { Period } from "@/lib/types";
import { Select } from "@mantine/core";
import React from "react";
import classes from "../historyperiodselector.module.css";

const YearSelector = ({
  period,
  setPeriod,
  years,
  disabled,
}: {
  period: Period;
  setPeriod: React.Dispatch<React.SetStateAction<Period>>;
  years: GetHistoryPeriodsReturnType;
  disabled: boolean;
}) => {
  return (
    <Select
      data={years.map((year) => year.toString())}
      value={period.year.toString()}
      onChange={(value) =>
        setPeriod({ month: period.month, year: Number(value) })
      }
      disabled={disabled}
      classNames={{ input: classes.input }}
    />
  );
};

export default YearSelector;
