import Header from "@/components/Header";
import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppShell header={{ height: 70 }}>
      <AppShellHeader>
        <Header />
      </AppShellHeader>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
};

export default DashboardLayout;
