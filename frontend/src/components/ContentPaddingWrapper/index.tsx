import { breakpoints } from "@/utils/breakpoints";
import styled from "@emotion/styled";

function PaddingWrapper({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) {
    return (
        <PaddingWrapperStyled style={style}>{children}</PaddingWrapperStyled>
    );
}

const PaddingWrapperStyled = styled.div`
  padding: var(--space-8) var(--space-16);

  @media(min-width: ${breakpoints.tabletL}) {
      padding: var(--space-8) var(--space-16) var(--space-16);
  }
  
  @media(max-width: ${breakpoints.tabletL}) {
      padding: var(--space-8);
  }
`;

export default PaddingWrapper;
