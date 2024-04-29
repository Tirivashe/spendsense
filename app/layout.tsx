// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
// import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ClerkProvider } from "@clerk/nextjs";
import { resolver } from "@/theme";
import RootProvider from "@/providers/RootProvider";

export const metadata = {
  title: "My Mantine app",
  description: "I have followed setup instructions carefully",
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
              {children}
            </MantineProvider>
          </RootProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
