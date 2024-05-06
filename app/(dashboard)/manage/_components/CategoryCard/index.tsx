"use client";
import { Button, Paper, Stack, Text } from "@mantine/core";
import { Category } from "@prisma/client";
import { IconCheck, IconTrash, IconX } from "@tabler/icons-react";
import React from "react";
import classes from "./categorycard.module.css";
import { modals } from "@mantine/modals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteCategory } from "@/app/(dashboard)/_actions/categories";
import { TransactionType } from "@/lib/types";
import { notifications } from "@mantine/notifications";

type Props = {
  category: Category;
};

const CategoryCard = ({ category }: Props) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: DeleteCategory,
    onSuccess: async () => {
      notifications.update({
        loading: false,
        title: "Success!!",
        message: `Category was deleted successfully`,
        withCloseButton: true,
        autoClose: 3000,
        color: "green",
        icon: <IconCheck />,
        id: "delete-category",
      });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error(error.message);
      notifications.update({
        loading: false,
        title: "Error!",
        message: "Something went wrong, could not delete category",
        color: "red",
        icon: <IconX />,
        id: "delete-category",
        autoClose: 3000,
        withCloseButton: true,
      });
    },
  });

  const handleDeleteCategory = (name: string, type: TransactionType) => {
    notifications.show({
      loading: true,
      title: "Wait",
      message: "Deleting category...",
      autoClose: false,
      id: "delete-category",
    });
    mutate({ name, type });
  };
  const openModal = () =>
    modals.openConfirmModal({
      title: "Are you sure?",
      centered: true,
      children: (
        <Text size="sm">
          This action will delete your category completely. Are you sure you
          want to proceed?
        </Text>
      ),
      labels: { confirm: "Yes, delete", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      cancelProps: { color: "gray" },
      onCancel: () => {},
      onConfirm: () =>
        handleDeleteCategory(category.name, category.type as TransactionType),
    });
  return (
    <Paper flex={1} w="100%" shadow="md">
      <Stack justify="center" align="center" gap="xs">
        <Text fz="h1">{category.icon}</Text>
        <Text fz="h4" c="white">
          {category.name}
        </Text>
        <Button
          fullWidth
          leftSection={<IconTrash />}
          className={classes.button}
          onClick={openModal}
        >
          Remove
        </Button>
      </Stack>
    </Paper>
  );
};

export default CategoryCard;
