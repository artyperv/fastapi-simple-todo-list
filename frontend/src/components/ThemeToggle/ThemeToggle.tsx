import { useTheme } from "@/context/ThemeProvider";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import styled from "@emotion/styled";
import React from "react";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToggleButton
      onClick={toggleTheme}
      variant="ghost"
    >
      {theme === "light" ? <Icon name="sun" /> : <Icon name="moon" />}
    </ToggleButton>
  );
};

export default ThemeToggle;

const ToggleButton = styled(Button)`
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
  padding: 0;
  width: var(--space-32);
  height: var(--space-32);

  &:hover {
    opacity: 0.8;
  }
`;
