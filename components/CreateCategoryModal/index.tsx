import { TransactionType } from "@/lib/types";
import { Modal, Stack, Text } from "@mantine/core";
import { Category } from "@prisma/client";
import React from "react";
import classes from "./createcategorymodal.module.css";
import CreateCategoryModalBody from "./CreateCategoryModalBody";

type Props = {
  opened: boolean;
  close: () => void;
  type: TransactionType;
  successCategoryCallback: (category: Category) => void;
};

const CreateCategoryModal = ({
  opened,
  close,
  successCategoryCallback,
  type,
}: Props) => {
  return (
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
      <CreateCategoryModalBody
        type={type}
        closeDialog={close}
        successCategoryCallback={successCategoryCallback}
      />
    </Modal>
  );
};

export default CreateCategoryModal;
