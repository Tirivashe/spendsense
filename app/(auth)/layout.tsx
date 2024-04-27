import Logo from "@/components/Logo";
import { Center, Stack } from "@mantine/core";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <Center h="100vh" style={{ overflow: "hidden" }}>
      <Stack>
        <Logo />
        {children}
      </Stack>
    </Center>
  );
};

export default AuthLayout;
