import { Anchor, Text } from "@mantine/core";
import Link from "next/link";
import { IconMoneybag } from "@tabler/icons-react";
import classes from "./Logo.module.css";

const Logo = () => {
  return (
    <Anchor
      component={Link}
      href="/"
      className={classes.root}
      underline="never"
    >
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
    </Anchor>
  );
};

export default Logo;
