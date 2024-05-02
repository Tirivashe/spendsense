"use client";
import { TransactionType } from "@/lib/types";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  Input,
  InputBase,
  Combobox,
  useCombobox,
  Box,
  Group,
  ScrollArea,
  Button,
  Modal,
  Text,
  Stack,
} from "@mantine/core";
import React, { useCallback, useState } from "react";
import { IconCirclePlus, IconSearch } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import CreateNewCategoryModal from "../CreateNewCategoryModal";
import classes from "./categorypicker.module.css";
import { UseFormReturnType } from "@mantine/form";
import { CreateTransactionSchemaType } from "@/validation-schemas/transaction";
import { format } from "path";

type Props = {
  type: TransactionType;
  form: UseFormReturnType<CreateTransactionSchemaType>;
};

const CategoryPicker = ({ type, form }: Props) => {
  const combobox = useCombobox({
    onDropdownClose: () => setSearch(""),
  });
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const { data } = useQuery<Category[]>({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const selectedCategory = data?.find(
    (category: Category) => category.name === value
  );

  const options = data
    ?.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase().trim())
    )
    ?.map((category) => (
      <Combobox.Option
        key={category.name}
        value={category.name}
        className={classes.option}
      >
        <Group gap="sm">
          {category.icon} {category.name}
        </Group>
      </Combobox.Option>
    ));

  const successCategoryCallback = useCallback(
    (category: Category) => {
      setValue(category.name);
      form.setFieldValue("category", category.name);
      combobox.closeDropdown();
    },
    [combobox, form]
  );

  return (
    <Box>
      <Combobox
        store={combobox}
        onOptionSubmit={(val) => {
          setValue(val);
          form.setFieldValue("category", val);
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <InputBase
            component="button"
            type="button"
            pointer
            rightSection={<Combobox.Chevron />}
            rightSectionPointerEvents="none"
            onClick={() => combobox.openDropdown()}
            label="Category"
            classNames={{ input: classes.input }}
          >
            {value ? (
              <Text>
                {selectedCategory?.icon} {selectedCategory?.name}
              </Text>
            ) : (
              <Input.Label>Pick a category</Input.Label>
            )}
          </InputBase>
        </Combobox.Target>
        <Combobox.Dropdown p="xs" classNames={{ dropdown: classes.dropdown }}>
          <Combobox.Search
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Search for categories"
            leftSection={<IconSearch size="0.8rem" />}
            classNames={{ input: classes["search-input"] }}
          />
          <Combobox.Header>
            <Button
              leftSection={<IconCirclePlus />}
              fullWidth
              my="5px"
              variant="subtle"
              onClick={() => {
                combobox.closeDropdown();
                open();
              }}
              className={classes.button}
            >
              Create New
            </Button>
          </Combobox.Header>
          <ScrollArea.Autosize mah={200} type="scroll">
            {options?.length === 0 ? (
              <Combobox.Empty>
                <Text c="white" size="lg" ta="center">
                  No categories found
                </Text>
                <Text c="dimmed" size="xs" ta="center">
                  Tip: Try creating a new category
                </Text>
              </Combobox.Empty>
            ) : (
              options
            )}
          </ScrollArea.Autosize>
        </Combobox.Dropdown>
      </Combobox>
      <Modal
        opened={opened}
        onClose={close}
        centered
        classNames={{ content: classes["modal-content"] }}
        title={
          <Stack gap="xs">
            <Text c="white">
              Create{" "}
              <Text span c={type === "income" ? "green.5" : "red.5"}>
                {type}
              </Text>{" "}
              category
            </Text>
            <Text size="sm" ta="center" c="dimmed">
              Categories are used to group transactions
            </Text>
          </Stack>
        }
      >
        <CreateNewCategoryModal
          type={type}
          closeDialog={close}
          successCategoryCallback={successCategoryCallback}
        />
      </Modal>
    </Box>
  );
};

export default CategoryPicker;
