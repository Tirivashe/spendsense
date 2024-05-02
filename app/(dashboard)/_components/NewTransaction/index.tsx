"use client";
import React, { useCallback, useState } from "react";
import { TransactionType } from "@/lib/types";
import {
  Box,
  Button,
  Flex,
  Group,
  Modal,
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import classes from "./newtransaction.module.css";
import { useDisclosure } from "@mantine/hooks";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/validation-schemas/transaction";
import { useForm, zodResolver } from "@mantine/form";
import CategoryPicker from "../CategoryPicker";
import { IconCalendar, IconCheck, IconX } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransaction } from "../../_actions/transactions";
import { notifications } from "@mantine/notifications";

const NewTransaction = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [type, setType] = useState<TransactionType>("income");
  const queryClient = useQueryClient();
  const form = useForm<CreateTransactionSchemaType>({
    mode: "uncontrolled",
    initialValues: {
      amount: 0,
      description: "",
      date: new Date(),
      category: "",
      type,
    },
    validate: zodResolver(CreateTransactionSchema),
  });

  const openModal = (newType: TransactionType) => {
    setType(newType);
    form.setFieldValue("type", newType);
    open();
  };
  const cancel = () => {
    form.reset();
    close();
  };
  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: async () => {
      form.reset();
      notifications.update({
        id: "create-transaction",
        loading: false,
        title: "Transaction created",
        message: "Transaction created successfully",
        autoClose: 3000,
        color: "green",
        icon: <IconCheck />,
        withCloseButton: true,
      });
      await queryClient.invalidateQueries({ queryKey: ["overview"] });
      close();
    },
    onError: (error) => {
      console.error(error.message);
      notifications.update({
        loading: false,
        title: "Error",
        message: "Something went wrong",
        color: "red",
        icon: <IconX />,
        id: "create-transaction",
        autoClose: 3000,
        withCloseButton: true,
      });
    },
  });

  const handleSubmit = useCallback(
    (values: CreateTransactionSchemaType) => {
      notifications.show({
        id: "create-transaction",
        loading: true,
        title: "Creating Transaction",
        message: "Please wait...",
        autoClose: false,
        disallowClose: true,
      });
      mutate(values);
    },
    [mutate]
  );

  return (
    <>
      <Group gap="xs">
        <Button
          size="sm"
          className={classes["button-income"]}
          onClick={() => openModal("income")}
        >
          New Income
        </Button>
        <Button
          size="sm"
          className={classes["button-expense"]}
          onClick={() => openModal("expense")}
        >
          New Expense
        </Button>
      </Group>
      <Modal
        opened={opened}
        onClose={close}
        centered
        classNames={{ content: classes["modal-content"] }}
        title={
          <Text c="white">
            Create a new{" "}
            <Text span c={type === "income" ? "green.5" : "red.5"}>
              {type}
            </Text>{" "}
            transaction
          </Text>
        }
      >
        <form onSubmit={form.onSubmit(handleSubmit)} className={classes.form}>
          <TextInput
            {...form.getInputProps("description")}
            label="Description"
            description="Give a description of your transaction (Optional)"
            classNames={{ input: classes.input }}
          />
          <NumberInput
            {...form.getInputProps("amount")}
            min={0.01}
            label="Amount"
            prefix="$"
            allowDecimal
            allowNegative={false}
            decimalScale={2}
            fixedDecimalScale
            classNames={{ input: classes.input }}
          />
          <SimpleGrid
            cols={{ base: 1, md: 2 }}
            spacing="md"
            verticalSpacing="md"
            mt="md"
          >
            <CategoryPicker type={type} form={form} />
            <DatePickerInput
              label="Transaction Date"
              placeholder="Pick the transaction date"
              {...form.getInputProps("date")}
              rightSection={<IconCalendar size={18} />}
              classNames={{
                input: classes.input,
                monthCell: classes.monthCell,
              }}
            />
          </SimpleGrid>
          <Group justify="flex-end" align="center" mt="md" gap="xs">
            <Button onClick={cancel} className={classes["button-cancel"]}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isPending}
              className={classes["button-confirm"]}
            >
              Create
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

export default NewTransaction;
