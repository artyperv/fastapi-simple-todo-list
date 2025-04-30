import styled from "@emotion/styled";
import React, { forwardRef } from "react";

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> { }

const Center: React.FC<CenterProps> = forwardRef<HTMLDivElement, CenterProps>(({ children, ...props }, ref) => {
  return <StyledCenterDiv ref={ref} {...props}>{children}</StyledCenterDiv>;
});

const StyledCenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default Center;
