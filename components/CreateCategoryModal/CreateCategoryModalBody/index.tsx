"use client";
import { TransactionType } from "@/lib/types";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/validation-schemas/categories";
import {
  Button,
  Group,
  Input,
  InputBase,
  Popover,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import React, { useCallback, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Category } from "@prisma/client";
import { IconCheck, IconCircleOff, IconX } from "@tabler/icons-react";
import classes from "./createcategorymodalbody.module.css";
import { CreateCategory } from "@/app/(dashboard)/_actions/categories";

type Props = {
  type: TransactionType;
  closeDialog: () => void;
  successCategoryCallback: (category: Category) => void;
};

const CreateCategoryModalBody = ({
  type,
  closeDialog,
  successCategoryCallback,
}: Props) => {
  const queryClient = useQueryClient();
  const [emoji, setEmoji] = useState("");
  const [opened, { toggle, close }] = useDisclosure(false);
  const form = useForm<CreateCategorySchemaType>({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      icon: "",
      type,
    },
    validate: zodResolver(CreateCategorySchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (category: Category) => {
      form.reset();
      notifications.update({
        loading: false,
        title: "Category created",
        message: `Category ${category.name} created successfully`,
        withCloseButton: true,
        autoClose: 3000,
        color: "green",
        icon: <IconCheck />,
        id: "create-category",
      });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      successCategoryCallback(category);
      closeDialog();
    },
    onError: (error) => {
      console.error(error.message);
      notifications.update({
        loading: false,
        title: "Error",
        message: "Something went wrong",
        color: "red",
        icon: <IconX />,
        id: "create-category",
        autoClose: 3000,
        withCloseButton: true,
      });
    },
  });

  const handleSubmit = useCallback(
    (values: CreateCategorySchemaType) => {
      notifications.show({
        loading: true,
        title: "Creating category",
        message: `Creating category ${values.name}...`,
        autoClose: false,
        id: "create-category",
      });
      mutate(values);
    },
    [mutate]
  );

  return (
    <form className={classes.form} onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        {...form.getInputProps("name")}
        label="Name"
        description="Name of the category"
        classNames={{ input: classes["name-input"] }}
      />
      <Popover opened={opened} position="top-end" offset={-200} onClose={close}>
        <Popover.Target>
          <InputBase
            component="button"
            type="button"
            pointer
            onClick={toggle}
            label="Icon"
            classNames={{
              input: classes["input-input"],
              wrapper: classes["input-wrapper"],
            }}
            error={form.errors.icon}
          >
            {emoji ? (
              <Stack align="center" justify="center">
                <Text size="3.5rem" ta="center">
                  {emoji}
                </Text>
                <Text size="0.8rem" ta="center" mt={-5} c="dimmed">
                  Click to change
                </Text>
              </Stack>
            ) : (
              <Input.Label className={classes.label}>
                <IconCircleOff size={55} />
                <Text size="xs" c="dimmed" ta="center">
                  Click to select
                </Text>
              </Input.Label>
            )}
          </InputBase>
        </Popover.Target>
        <Popover.Dropdown>
          <Picker
            data={data}
            onEmojiSelect={(e: { native: string }) => {
              setEmoji(e.native);
              form.setFieldValue("icon", e.native);
              toggle();
            }}
          />
        </Popover.Dropdown>
      </Popover>
      <Group justify="flex-end" align="center" gap="sm">
        <Button
          variant="outline"
          onClick={closeDialog}
          className={classes.button}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className={classes.button}>
          Save
        </Button>
      </Group>
    </form>
  );
};

export default CreateCategoryModalBody;
