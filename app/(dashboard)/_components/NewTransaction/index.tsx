"use client";
import { TransactionType } from "@/lib/types";
import {
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import React, { useState } from "react";
import classes from "./newtransaction.module.css";
import { useDisclosure } from "@mantine/hooks";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/validation-schemas/transaction";
import { useForm, zodResolver } from "@mantine/form";
import CategoryPicker from "../CategoryPicker";

const NewTransaction = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [type, setType] = useState<TransactionType>("income");
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

  const openModal = (type: TransactionType) => {
    setType(type);
    open();
  };
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
        <Stack component="form" gap="sm">
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
        </Stack>
        <CategoryPicker type={type} form={form} />
      </Modal>
    </>
  );
};

export default NewTransaction;
