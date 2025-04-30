import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { LinkComponentProps, Link as TSLink } from "@tanstack/react-router";
import React from "react";

interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> { }

const Link: React.FC<LinkComponentProps> = ({ children, ...props }) => {
  return <StyledLink {...props}>{children}</StyledLink>;
};

export const ExternalLink: React.FC<ExternalLinkProps> = ({ children, ...props }) => {
  return <StyledExternalLink {...props}>{children}</StyledExternalLink>;
};

const styles = css`
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;
  color: var(--color-text-brand);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.8;
    }
  }

  &:focus-visible {
    outline: 2px solid var(--color-violet-500);
    outline-offset: 2px;
  }
`

const StyledLink = styled(TSLink) <LinkComponentProps>`
  ${styles}
`;
const StyledExternalLink = styled.a <ExternalLinkProps>`
  ${styles}
`;

export default Link;
