import { breakpoints } from "@/utils/breakpoints";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import React from "react";

export const TextVariants = {
  // Display
  display1: css`
    font-family: var(--font-family-display);
    font-weight: var(--font-weight-light);
    font-size: var(--font-size-32);
    line-height: var(--font-line-height-32);
  `,
  display2: css`
    font-family: var(--font-family-display);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-26);
    line-height: var(--font-line-height-32);

    @media (max-width: ${breakpoints.tabletM}) {
      font-size: var(--font-size-24);
      line-height: var(--font-line-height-28);
    }
  `,
  display3: css`
    font-family: var(--font-family-display);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-20);
    line-height: var(--font-line-height-22);
  `,
  display4: css`
    font-family: var(--font-family-display);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-18);
    line-height: var(--font-line-height-20);
  `,
  display5: css`
    font-family: var(--font-family-display);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-16);
    line-height: var(--font-line-height-22);
  `,

  // Text
  textL: css`
    font-family: var(--font-family-body);
    font-weight: var(--font-weight-light);
    font-size: var(--font-size-18);
    line-height: var(--font-line-height-22);
  `,
  textM: css`
    font-family: var(--font-family-body);
    font-weight: var(--font-weight-light);
    font-size: var(--font-size-16);
    line-height: var(--font-line-height-20);
  `,
  textS: css`
    font-family: var(--font-family-body);
    font-weight: var(--font-weight-light);
    font-size: var(--font-size-14);
    line-height: var(--font-line-height-18);
  `,
  textXS: css`
    font-family: var(--font-family-body);
    font-weight: var(--font-weight-light);
    font-size: var(--font-size-12);
    line-height: var(--font-line-height-16);
  `,

  // Label
  labelL: css`
    font-family: var(--font-family-body);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-18);
    line-height: var(--font-line-height-18);
  `,
  labelM: css`
    font-family: var(--font-family-body);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-16);
    line-height: var(--font-line-height-18);
  `,
  labelS: css`
    font-family: var(--font-family-body);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-14);
    line-height: var(--font-line-height-18);
  `,
  labelXS: css`
    font-family: var(--font-family-body);
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-12);
    line-height: var(--font-line-height-16);
  `,
};

// Define the static styles for each text size
const StyledText = styled.div<{ size: keyof typeof TextVariants }>`
  /* Default styles */
  margin: 0;
  padding: 0;
  color: var(--color-text-basic);
  font-weight: 400;
  text-wrap: balance;
  /* Specific styles based on size */
  ${({ size }) => TextVariants[size]}
`;

export interface TextProps
  extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
  children?: React.ReactNode;
  size?: keyof typeof TextVariants;
  as?: keyof JSX.IntrinsicElements;
}

const Text: React.FC<TextProps> = ({
  children,
  size = "textM",
  as = "p",
  ...props
}) => {
  return (
    <StyledText as={as} size={size} {...props}>
      {children}
    </StyledText>
  );
};

export default Text;
