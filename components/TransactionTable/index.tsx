"use client";
import { GetTransactionHistoryReturnType } from "@/app/api/transactions-history/route";
import { DateToUTCDate } from "@/lib/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import {
  MRT_Row,
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { Badge, Box, Button, Group, Menu, Text } from "@mantine/core";
import { mkConfig, generateCsv, download } from "export-to-csv";
import classes from "./transactiontable.module.css";
import dayjs from "dayjs";
import { IconCheck, IconDownload, IconX } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { DeleteTransaction } from "@/app/(dashboard)/transactions/_actions/deleteTransaction";
import { notifications } from "@mantine/notifications";

type Props = {
  from: Date;
  to: Date;
};

type TransactionHistoryRow = GetTransactionHistoryReturnType[0];

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const TransactionTable = ({ from, to }: Props) => {
  const queryClient = useQueryClient();
  const { data, isFetching, isLoading } =
    useQuery<GetTransactionHistoryReturnType>({
      queryKey: ["transactions", "history", from, to],
      queryFn: () =>
        fetch(
          `api/transactions-history?from=${DateToUTCDate(
            from
          )}&to=${DateToUTCDate(to)}`
        ).then((res) => res.json()),
    });

  const { mutate } = useMutation({
    mutationFn: DeleteTransaction,
    onSuccess: async () => {
      notifications.update({
        id: "delete-transaction",
        loading: false,
        title: "Success!",
        message: "Transaction deleted successfully",
        autoClose: 3000,
        color: "green",
        icon: <IconCheck size={16} />,
      });
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      console.error(error.message);
      notifications.update({
        loading: false,
        title: "Error",
        message: "Something went wrong",
        color: "red",
        icon: <IconX />,
        id: "delete-transaction",
        autoClose: 3000,
        withCloseButton: true,
      });
    },
  });

  const tableData = data || [];

  const columns = useMemo<MRT_ColumnDef<TransactionHistoryRow>[]>(
    () => [
      {
        accessorKey: "category",
        header: "Category",
        Cell: ({ row }) => (
          <Text tt="capitalize" c="white">
            {row.original.categoryIcon} {row.original.category}
          </Text>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        Cell: ({ row }) => (
          <Text tt="capitalize" c="white">
            {row.original.description}
          </Text>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        enableSorting: false,
        Cell: ({ row }) => {
          const date = new Date(row.original.date);
          const formattedDate = date.toLocaleDateString("default", {
            timeZone: "UTC",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });

          return <Text>{formattedDate}</Text>;
        },
      },
      {
        accessorKey: "type",
        header: "Type",
        Cell: ({ row }) => (
          <Badge
            size="lg"
            radius="xs"
            data-type={row.original.type}
            className={classes.badge}
          >
            {row.original.type}
          </Badge>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        Cell: ({ row }) => <Text>{row.original.formattedAmount}</Text>,
      },
    ],
    []
  );

  const handleExportRows = (rows: MRT_Row<TransactionHistoryRow>[]) => {
    const rowData = rows.map((row) => ({
      category: row.original.category,
      categoryIcon: row.original.categoryIcon,
      description: row.original.description,
      date: dayjs(row.original.date).format("YYYY-MM-DD"),
      type: row.original.type,
      amount: row.original.amount,
      formattedAmount: row.original.formattedAmount,
    }));
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const deleteTransaction = (id: string) =>
    modals.openConfirmModal({
      title: "You are about to delete a transaction",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this transaction? This action cannot
          be reversed once done.
        </Text>
      ),
      labels: { confirm: "Delete transaction", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: () => {
        notifications.show({
          loading: true,
          title: "Please wait",
          message: "Deleting transaction...",
          autoClose: false,
          id: "delete-transaction",
        });
        mutate(id);
      },
    });

  const table = useMantineReactTable({
    columns,
    data: tableData,
    enableColumnActions: false,
    state: {
      showLoadingOverlay: isLoading,
      showProgressBars: isFetching,
      showSkeletons: isLoading,
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Group p="sm" wrap="wrap" flex={1}>
        <Button
          className={classes.button}
          size="compact-sm"
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          leftSection={<IconDownload size={20} />}
          variant="filled"
        >
          Export CSV
        </Button>
      </Group>
    ),
    positionActionsColumn: "last",
    enableRowActions: true,
    renderRowActionMenuItems: ({ row }) => (
      <>
        <Menu.Item onClick={() => deleteTransaction(row.original.id)}>
          Delete
        </Menu.Item>
      </>
    ),
  });

  return (
    <Box py="1.5rem" px="2.5rem">
      <MantineReactTable table={table} />
    </Box>
  );
};

export default TransactionTable;
