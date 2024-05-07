"use client";
import {
  Anchor,
  Avatar,
  Burger,
  Drawer,
  Group,
  Menu,
  rem,
} from "@mantine/core";
import React, { useCallback } from "react";
import Logo from "../Logo";
import Link from "next/link";
import classes from "./Header.module.css";
import { usePathname } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import DrawerContent from "../DrawerContent";
import { IconLogout } from "@tabler/icons-react";
import { useClerk, useUser } from "@clerk/nextjs";

type Props = {};

const Header = (props: Props) => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const pathname = usePathname();
  const [opened, { open, close }] = useDisclosure(false);
  const navPaths: { label: string; link: string }[] = [
    { label: "Dashboard", link: "/" },
    { label: "Transactions", link: "/transactions" },
    { label: "Manage", link: "/manage" },
  ];

  const initials = user
    ? `${user?.firstName?.charAt(0).toUpperCase()}${user?.lastName
        ?.charAt(0)
        .toUpperCase()}`
    : "U";

  const logout = useCallback(() => {
    signOut();
  }, [signOut]);
  return (
    <Group align="center" px="lg" h="100%" gap="xl">
      <Logo />
      <Group align="center" gap="xl" h="100%">
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
      <Group
        justify="flex-end"
        align="center"
        flex={1}
        px="lg"
        visibleFrom="sm"
      >
        <Menu>
          <Menu.Target>
            <Avatar
              style={{ cursor: "pointer" }}
              src={user?.imageUrl}
              alt="profile_pic"
            >
              {!user?.hasImage && initials}
            </Avatar>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item
              color="red"
              leftSection={
                <IconLogout style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={logout}
            >
              Log out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
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
