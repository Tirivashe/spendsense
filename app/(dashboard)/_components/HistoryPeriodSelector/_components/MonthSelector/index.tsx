import { Period } from "@/lib/types";
import { ComboboxData, Select } from "@mantine/core";
import React from "react";

const MonthSelector = ({
  period,
  setPeriod,
  disabled,
}: {
  period: Period;
  setPeriod: React.Dispatch<React.SetStateAction<Period>>;
  disabled: boolean;
}) => {
  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
    const formattedMonth = new Date(period.year, month, 1).toLocaleString(
      "default",
      {
        month: "long",
      }
    );

    return { value: month.toString(), label: formattedMonth };
  });
  return (
    <Select
      data={months}
      value={period.month.toString()}
      onChange={(value) =>
        setPeriod({ year: period.year, month: Number(value) })
      }
      disabled={disabled}
    />
  );
};

export default MonthSelector;
