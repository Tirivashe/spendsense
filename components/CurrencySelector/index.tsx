"use client";
import { Currency, currencies } from "@/lib/currencies";
import { Notification, Select, Skeleton } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import classes from "./currencyselector.module.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserSettings } from "@prisma/client";
import { notifications } from "@mantine/notifications";
import { UpdateUserCurrency } from "@/app/wizard/_actions/userSettings";
import { IconCheck, IconX } from "@tabler/icons-react";

const CurrencySelector = () => {
  const [option, setOption] = useState<Currency | null>(null);
  const {
    data: userSettings,
    isFetching,
    isLoading,
  } = useQuery<UserSettings>({
    queryKey: ["user-settings"],
    queryFn: () => fetch("api/user-settings").then((res) => res.json()),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (option) => {
      notifications.update({
        id: "update-currency",
        loading: false,
        title: "Currency updated",
        message: "Your currency has been updated",
        color: "teal",
        icon: <IconCheck />,
        autoClose: 3000,
        withBorder: true,
      });
      setOption(
        currencies.find((currency) => currency.value === option.currency) ||
          null
      );
    },
    onError: (err) => {
      notifications.update({
        title: "Error! Failed to update currency",
        loading: false,
        message: err.message,
        color: "red",
        icon: <IconX />,
        autoClose: 3000,
        withBorder: true,
        withCloseButton: false,
        id: "update-currency",
      });
    },
  });

  const selectOption = useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        notifications.show({
          title: "Error",
          message: "Please select a currency",
          color: "red",
          icon: <IconX />,
          autoClose: 3000,
          withBorder: true,
          withCloseButton: false,
        });
        return;
      }
      notifications.show({
        loading: true,
        title: "Updating currency",
        message: "Please wait...",
        autoClose: false,
        id: "update-currency",
      });

      mutate(currency.value);
    },
    [mutate]
  );

  useEffect(() => {
    if (userSettings) {
      setOption(
        currencies.find((c) => c.value === userSettings.currency) || null
      );
    }
  }, [userSettings]);

  if (isFetching || isLoading) {
    return <Skeleton height={40} mt={10} width="100%" radius="sm" />;
  }

  return (
    <>
      <Select
        data={currencies}
        value={option ? option.value : null}
        onChange={(_, option) => selectOption(option as Currency)}
        label="Set your default currency for your transactions"
        placeholder="Select your currency"
        classNames={{
          input: classes["select-input"],
          label: classes["select-label"],
        }}
        disabled={isPending}
      />
    </>
  );
};

export default CurrencySelector;
