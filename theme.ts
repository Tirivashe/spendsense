"use client";
import { CSSVariablesResolver, MantineThemeOverride } from "@mantine/core";

export const resolver: CSSVariablesResolver = (theme) => ({
  variables: {},
  light: {},
  dark: {
    "--mantine-color-body": theme.black,
  },
});
