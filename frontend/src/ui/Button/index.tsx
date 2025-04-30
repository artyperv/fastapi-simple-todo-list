import { PrimaryColorNames } from "@/styles/colors";
import styled from "@emotion/styled";
import React, { forwardRef } from "react";
import Spinner from "../Spinner";

type ButtonVariants =
  | PrimaryColorNames
  | "outline"
  | "ghost"
  | "pill"
  | "blurry";
type ButtonShapes = "default" | "pill";
type ButtonSizes = "small" | "medium";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  shape?: ButtonShapes;
  size?: ButtonSizes;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isIconOnly?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = "primary",
  shape = "default",
  size = "medium",
  loading = false,
  iconLeft,
  iconRight,
  isIconOnly = false,
  ...props
}, ref) => {
  return !loading ? (
    <StyledButton
      ref={ref}
      variant={variant}
      size={size}
      shape={shape}
      isIconOnly={isIconOnly}
      {...props}
    >
      {iconLeft && <IconWrapper>{iconLeft}</IconWrapper>}
      {children && <span>{children}</span>}
      {iconRight && <IconWrapper>{iconRight}</IconWrapper>}
    </StyledButton>
  ) : (
    <StyledButton
      ref={ref}
      variant={variant}
      size={size}
      shape={shape}
      {...props}
      disabled={true}
    >
      <IconWrapper>
        <Spinner color="var(--color-icon-medium)" />
      </IconWrapper>
    </StyledButton>
  );
});

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  border: none;
  border-radius: ${({ shape }) =>
    shape === "pill" ? "var(--radius-round)" : "var(--radius-m)"};
  color: var(--color-text-action-primary);
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;
  font-weight: 400;
  font-size: var(--font-size-16);
  line-height: var(--font-line-height-18);

  &:hover {
    opacity: 0.8;
  }

  &:focus-visible {
    outline: 2px solid var(--color-violet-500);
    outline-offset: 2px;
  }

  ${({ variant }) =>
    variant === "primary" &&
    `
    background-color: var(--color-bg-action-primary);
    color: var(--color-text-action-primary);
  `}

  ${({ variant }) =>
    variant === "secondary" &&
    `
    color: var(--color-text-action-secondary);
    background-color: var(--color-bg-action-secondary);
  `}

  ${({ variant }) =>
    variant === "tertiary" &&
    `
    color: var(--color-text-action-tertiary);
    background-color: var(--color-bg-action-tertiary);
  `}

  ${({ variant }) =>
    variant === "fourth" &&
    `
    color: var(--color-text-action-fourth);
    background-color: var(--color-bg-action-fourth);
  `}

  ${({ variant }) =>
    variant === "fifth" &&
    `
    color: var(--color-text-action-fifth);
    background-color: var(--color-bg-action-fifth);
  `}

  ${({ variant }) =>
    variant === "outline" &&
    `
    background-color: transparent;
    color: var(--color-violet-900);
    border: 1px solid var(--color-violet-900);
  `}

  ${({ variant }) =>
    variant === "ghost" &&
    `
    background-color: transparent;
  `}

  ${({ variant }) =>
    variant === "blurry" &&
    `
    background: rgba(255, 255, 255, 0.10);
    backdrop-filter: blur(8px);
    color: var(--color-text-static-white);
  `}

  ${({ size }) =>
    size === "small" &&
    `
    padding: var(--space-4) var(--space-16);

  `}

  ${({ size }) =>
    size === "medium" &&
    `
    padding: var(--space-16) var(--space-24);
  `}

  ${({ isIconOnly }) =>
    isIconOnly &&
    `
    aspect-ratio: 1/1;
    padding: var(--space-16);
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export default Button;
