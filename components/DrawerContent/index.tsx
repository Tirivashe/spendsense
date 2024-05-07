import { useClerk } from "@clerk/nextjs";
import { Button, Center, Divider, NavLink, Stack } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback } from "react";

type Props = {
  navPaths: { label: string; link: string }[];
  close: () => void;
};

const DrawerContent = ({ navPaths, close }: Props) => {
  const { signOut } = useClerk();
  const logout = useCallback(() => {
    signOut();
  }, [signOut]);
  const pathname = usePathname();
  return (
    <Stack>
      {navPaths.map(({ label, link }) => (
        <NavLink
          component={Link}
          href={link}
          key={link}
          label={label}
          onClick={close}
          active={pathname === link}
          color="orange.3"
          variant="subtle"
        />
      ))}
      <Divider />
      <Center>
        <Button variant="subtle" color="white" onClick={logout}>
          Log out
        </Button>
      </Center>
    </Stack>
  );
};

export default DrawerContent;
