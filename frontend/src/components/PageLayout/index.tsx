import { breakpoints } from "@/utils/breakpoints";
import styled from "@emotion/styled";
import { forwardRef } from "react";
import Header, { HeaderProps } from "../Header/Header";

type PageLayoutProps = {
  children: React.ReactNode;
  removeDefaultStyles?: boolean;
  style?: React.CSSProperties;
  mainStyle?: React.CSSProperties;
} & HeaderProps;

const PageLayout = forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ children, removeDefaultStyles = false, style, mainStyle, ...props }, ref) => {
    return (
      <div ref={ref} style={{ ...style }}>
        <Header {...props} />
        {removeDefaultStyles ? <main style={{ ...mainStyle }}>{children}</main> : <Main style={{ ...mainStyle }}>{children}</Main>}
      </div>
    );
  }
);

const Main = styled.main`
  display: flex;
  flex-direction: column;
  max-width: ${breakpoints.desktop};
  flex: 1;
  margin: 0 auto;
`;

export default PageLayout;
