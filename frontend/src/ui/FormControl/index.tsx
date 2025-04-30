import { css } from "@emotion/react";
import styled from "@emotion/styled";

import React from "react";

// Define reusable styles
const FormControlStyles = {
  errorText: css`
    color: var(--color-error);
    font-size: var(--font-size-16);
    line-height: var(--font-line-height-20);
  `,
  helperText: css`
    color: var(--color-text-light);
    font-size: var(--font-size-16);
    line-height: var(--font-line-height-20);
  `,
  labelText: css`
    color: var(--color-text-light);
    font-size: var(--font-size-16);
    line-height: var(--font-line-height-20);
  `,
  labelAstrick: css`
    color: var(--color-error);
  `,
  disabled: css`
    opacity: 0.5;
    pointer-events: none;
  `,
};

// Styled components
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-12);
`;

const ErrorIcon = styled.div`
  /* Add icon-specific styles here */
`;

const ErrorText = styled.span`
  ${FormControlStyles.errorText}
`;

const HelperContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HelperText = styled.span`
  ${FormControlStyles.helperText}
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LabelText = styled.span`
  ${FormControlStyles.labelText}
`;

const LabelAstrick = styled.span`
  ${FormControlStyles.labelAstrick}
`;

const Root = styled.div<{ isDisabled?: boolean, isInvalid?: boolean }>`
  ${ErrorContainer} {
    ${({ isInvalid }) => !isInvalid && { display: "none" }}
  }

  ${({ isDisabled }) => isDisabled && FormControlStyles.disabled}
`;

// Main FormControl Component
const FormControl = ({
  children,
  isDisabled = false,
  isInvalid = false,
  isReadOnly = false,
  isRequired = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
}) => {
  return (
    <Root isDisabled={isDisabled} {...props}>{children}</Root>
  );
};

FormControl.Error = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <ErrorContainer {...props}>{children}</ErrorContainer>;
};

FormControl.ErrorIcon = ErrorIcon;

FormControl.ErrorText = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <ErrorText {...props}>{children}</ErrorText>;
};

FormControl.Helper = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <HelperContainer {...props}>{children}</HelperContainer>;
};

FormControl.HelperText = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <HelperText {...props}>{children}</HelperText>;
};

FormControl.Label = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <LabelContainer {...props}>{children}</LabelContainer>;
};

FormControl.LabelText = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <LabelText {...props}>{children}</LabelText>;
};

FormControl.LabelAstrick = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <LabelAstrick {...props}>{children}</LabelAstrick>;
};

export default FormControl;