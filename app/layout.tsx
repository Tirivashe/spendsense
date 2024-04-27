// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
// import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";

import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import { ClerkProvider } from "@clerk/nextjs";
import { resolver } from "@/theme";

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
          <MantineProvider
            forceColorScheme="dark"
            cssVariablesResolver={resolver}
          >
            {children}
          </MantineProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
