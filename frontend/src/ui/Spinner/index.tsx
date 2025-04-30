import { SpaceValues, valueToSpaceVar } from "@/styles/spaceValues";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpaceValues | (string & {} /* for narrowing */) | number;
  color?: string;
}

// Spinner Animation
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled Component for Spinner
const SpinnerRoot = styled.div<{ size?: SpaceValues | string | number; color?: string }>`
  display: inline-block;
  width: ${(props) => valueToSpaceVar(props.size || "unset")};
  height: ${(props) => valueToSpaceVar(props.size || "unset")};
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid ${(props) => props.color || "var(--color-bg-action-primary)"};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// Main Spinner Component
const Spinner: React.FC<SpinnerProps> = ({
  size = "var(--space-24)",
  color = "var(--color-bg-action-primary)",
  ...props
}) => {
  return <SpinnerRoot size={size} color={color} {...props} />;
};

export default Spinner;

// Usage Example
/*
<Spinner size="var(--space-24)" color="blue" />
*/