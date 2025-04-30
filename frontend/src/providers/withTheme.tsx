import { ThemeProvider } from "@/context/ThemeProvider";
import type { FC } from "react";

export const withTheme = (Component: FC) => () => {
  return (
    <ThemeProvider>
      <Component />
    </ThemeProvider>
  );
};
