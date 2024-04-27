import { NavLink, Stack } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  navPaths: { label: string; link: string }[];
  close: () => void;
};

const DrawerContent = ({ navPaths, close }: Props) => {
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
    </Stack>
  );
};

export default DrawerContent;
