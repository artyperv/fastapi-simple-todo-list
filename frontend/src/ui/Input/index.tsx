import { css } from "@emotion/react";
import styled from "@emotion/styled";

import React from "react";

// Define reusable styles
const InputStyles = {
  root: css`
    display: flex;
    flex-direction: row;
    align-items: center;

    &:disabled {
      opacity: 0.4;
    }
  `,
  icon: css`
    color: var(--color-text-basic);
    opacity: 0.3;

    &:disabled {
      opacity: 0.7;
    }
  `,
  input: css`
    flex: 1;
    background-color: var(--color-bg-brand-light);
    height: var(--space-56);
    border: none;
    border-radius: var(--radius-l);
    color: var(--color-text-basic);
    font-size: var(--font-size-16);
    font-weight: 300;
    font-family: var(--font-family-text);
    padding: 16px;

    &::placeholder {
      color: var(--color-text-light);
    }

    &:focus {
      outline: none;
      box-shadow: inset 0 0 0 2px var(--color-border-brand);
      border-radius: var(--radius-l);
    }

    &:disabled {
      cursor: not-allowed;
    }

    /* Remove arrows in Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Remove arrows in Firefox */
    &[type="number"] {
      -moz-appearance: textfield;
      appearance: textfield;
    }
  `,
  slot: css`
    display: flex;
    justify-content: center;
    align-items: center;

    &:disabled {
      cursor: not-allowed;
    }
  `,
};

// Styled Components
const Root = styled.div`
  ${InputStyles.root}
`;

const Icon = styled.div`
  ${InputStyles.icon}
`;

const Slot = styled.button`
  ${InputStyles.slot}
`;

const InputField = styled.input`
  ${InputStyles.input}
`;

// Main Input Component
const Input = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Root {...props}>
      {children}
    </Root>
  );
};

Input.Icon = ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <Icon {...props} />;
};

Input.Slot = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <Slot {...props}>{children}</Slot>;
};

Input.Field = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ ...props }, ref) => {
    return <InputField ref={ref} {...props} />;
  }
);

Input.Field.displayName = 'InputField';

export default Input;

// Usage Example
/*
<Input>
  <Input.Icon>🔍</Input.Icon>
  <Input.Field placeholder="Enter text" />
  <Input.Slot>Click Me</Input.Slot>
</Input>
*/