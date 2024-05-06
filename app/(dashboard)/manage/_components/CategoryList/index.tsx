import { TransactionType } from "@/lib/types";
import {
  Box,
  Button,
  Center,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Category } from "@prisma/client";
import {
  IconPlus,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import classes from "./categorylist.module.css";
import CreateCategoryModal from "@/components/CreateCategoryModal";
import CategoryCard from "../CategoryCard";

type Props = {
  type: TransactionType;
};

const CategoryList = ({ type }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { data, isFetching, isLoading, refetch } = useQuery<Category[]>({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const dataAvailable = data && data.length > 0;

  if (isFetching || isLoading) {
    return <Skeleton h={100} my="md" />;
  }

  if (!dataAvailable) {
    return (
      <Center h={200} component={Stack} gap="xs">
        <Title>No categories</Title>
        <Text size="xs" c="dimmed">
          You have no {type} categories. Add some to manage
        </Text>
      </Center>
    );
  }

  return (
    <>
      <Paper px="2.5rem" py="1.5rem" mt="lg" className={classes.paper}>
        <Group justify="space-between">
          <Group gap="sm" justify="flex-start">
            {type === "income" ? (
              <IconTrendingUp
                size={50}
                className={`${classes.icon} ${classes["icon-income"]}`}
              />
            ) : (
              <IconTrendingDown
                size={50}
                className={`${classes.icon} ${classes["icon-expense"]}`}
              />
            )}
            <Box>
              <Title order={2} c="white">
                <Text span fz="inherit" fw="inherit" tt="capitalize">
                  {type}
                </Text>{" "}
                categories
              </Title>
              <Text size="sm" mt={-5}>
                Sorted by name
              </Text>
            </Box>
          </Group>
          <Button
            leftSection={<IconPlus />}
            onClick={open}
            className={classes.button}
          >
            Add category
          </Button>
        </Group>
        <Divider my="xs" />
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
          {data.map((category) => (
            <React.Fragment key={category.name}>
              <CategoryCard category={category} />
            </React.Fragment>
          ))}
        </SimpleGrid>
      </Paper>
      <CreateCategoryModal
        opened={opened}
        close={close}
        type={type}
        successCategoryCallback={() => refetch()}
      />
    </>
  );
};

export default CategoryList;
