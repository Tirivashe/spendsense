import { Group, Text } from "@mantine/core";
import Link from "next/link";
import { IconMoneybag } from "@tabler/icons-react";

const Logo = () => {
  return (
    <Group gap="xs" align="center" justify="center">
      <IconMoneybag size={34} color="orange" stroke={1} />
      <Text
        fz="1.7rem"
        variant="gradient"
        gradient={{ from: "yellow.4", to: "orange.5" }}
        component={Link}
        href="/"
        fw={900}
      >
        SpendSense
      </Text>
    </Group>
  );
};

export default Logo;
