"use client";
import { Anchor, Burger, Drawer, Group } from "@mantine/core";
import React from "react";
import Logo from "../Logo";
import Link from "next/link";
import classes from "./Header.module.css";
import { usePathname } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import DrawerContent from "../DrawerContent";

type Props = {};

const Header = (props: Props) => {
  const pathname = usePathname();
  const [opened, { open, close }] = useDisclosure(false);
  const navPaths: { label: string; link: string }[] = [
    { label: "Dashboard", link: "/" },
    { label: "Transactions", link: "/transactions" },
    { label: "Manage", link: "/manage" },
  ];
  return (
    <Group align="center" px="lg" h="100%" gap="xl">
      <Logo />
      <Group align="center" gap="xl">
        {navPaths.map(({ label, link }) => (
          <React.Fragment key={link}>
            <Anchor
              component={Link}
              href={link}
              underline="never"
              className={classes.nav}
              data-active={pathname === link}
              visibleFrom="sm"
            >
              {label}
            </Anchor>
          </React.Fragment>
        ))}
      </Group>
      <Group hiddenFrom="sm" justify="flex-end" px="md" flex={1}>
        <Burger
          opened={opened}
          onClick={open}
          aria-label="Menu drawer toggle"
        />
        <Drawer
          offset={8}
          radius="md"
          opened={opened}
          onClose={close}
          position="right"
          size="100%"
          title={<Logo />}
        >
          <DrawerContent navPaths={navPaths} close={close} />
        </Drawer>
      </Group>
    </Group>
  );
};
export default Header;
