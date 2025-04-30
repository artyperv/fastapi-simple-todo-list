import { ColorNames } from "@/styles/colors";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import React, { createContext, useContext } from "react";
import Text, { TextProps, TextVariants } from "../Text";

type TagSize = "s" | "xs";
const SIZE_MAPPING: Record<string, keyof typeof TextVariants> = {
  xs: "labelXS",
  s: "labelS",
};

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  colored?: ColorNames;
  size?: TagSize;
}

const StyledText = styled(Text)`
  color: inherit;
`

// Styled Components
const Root = styled.div<RootProps>`
  display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: var(--radius-round);
    padding: 0 var(--space-8);

    ${(props) =>
    props.size === "s" &&
    css`
        height: 21px;
          padding: 0 var(--space-10);
          flex-shrink: 0;
      `}

    ${(props) =>
    props.colored === "primary" &&
    css`
        background-color: var(--color-bg-brand-light);
          color: var(--color-text-brand);
      `}

    ${(props) =>
    props.colored === "secondary" &&
    css`
        background-color: var(--color-bg-secondary);
        color: var(--color-text-secondary);
      `}

    ${(props) =>
    props.colored === "tertiary" &&
    css`
        background-color: var(--color-bg-tertiary);
        color: var(--color-text-tertiary);
      `}

    ${(props) =>
    props.colored === "fourth" &&
    css`
        background-color: var(--color-bg-fourth);
        color: var(--color-text-warning);
      `}

    ${(props) =>
    props.colored === "gradient" &&
    css`
        background: linear-gradient(143deg, var(--color-violet-300) 0%, var(--color-pink-400) 100%);
        color: var(--color-text-brand);
      `}

    ${(props) =>
    props.colored === "success" &&
    css`
        background-color: var(--color-bg-success);
        color: var(--color-text-success);
      `}

    ${(props) =>
    props.colored === "warning" &&
    css`
        background-color: var(--color-bg-warning);
        color: var(--color-text-warning);
      `}

    ${(props) =>
    props.colored === "danger" &&
    css`
        background-color: var(--color-bg-danger);
        color: var(--color-text-danger);
      `}

    ${(props) =>
    props.colored === "neutral" &&
    css`
        background-color: var(--color-bg-neutral);
        color: var(--color-text-neutral);
      `}
`;

const TagColoredContext = createContext<{ size: TagSize }>({ size: "xs" });

// Main TagColored Component
const TagColored = ({ children, size = "xs", colored = "primary", ...props }: RootProps) => {
  return (
    <TagColoredContext.Provider value={{ size }}>
      <Root colored={colored} size={size} {...props}>
        {children}
      </Root>
    </TagColoredContext.Provider>
  );
};

// Text Component as a child of TagColored
TagColored.Text = ({ children, size, ...props }: TextProps) => {
  const context = useContext(TagColoredContext); // Get the size from context
  return <StyledText size={size || SIZE_MAPPING[context.size]} {...props}>{children}</StyledText>;
};

export default TagColored;

// Usage Example
/*
<TagColored colored="primary">
  <TagColored.Text>Primary Tag</TagColored.Text>
</TagColored>

<TagColored colored="secondary">
  <TagColored.Text>Secondary Tag</TagColored.Text>
</TagColored>
*/