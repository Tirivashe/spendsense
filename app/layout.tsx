// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
// import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import "mantine-react-table/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { ClerkProvider } from "@clerk/nextjs";
import { resolver } from "@/theme";
import RootProvider from "@/providers/RootProvider";

export const metadata = {
  title: "SpendSense",
  description:
    "Have a sense of how you are spending your money. By Tirivashe Shamhu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <ColorSchemeScript forceColorScheme="dark" />
        </head>
        <body>
          <RootProvider>
            <MantineProvider
              forceColorScheme="dark"
              cssVariablesResolver={resolver}
            >
              <Notifications />
              <ModalsProvider>{children}</ModalsProvider>
            </MantineProvider>
          </RootProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
