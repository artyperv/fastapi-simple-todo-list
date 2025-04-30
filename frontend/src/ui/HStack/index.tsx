import { SpaceValues, valueToSpaceVar } from "@/styles/spaceValues";
import styled from "@emotion/styled";
import React, { forwardRef } from "react";

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: SpaceValues | (string & {} /* for narrowing */) | number;
}

const HStack: React.FC<DivProps> = forwardRef<HTMLDivElement, DivProps>(({ gap, children, ...props }, ref) => {
  return <StyledFlexHorizontalDiv ref={ref} gap={gap} {...props}>{children}</StyledFlexHorizontalDiv>;
});

const StyledFlexHorizontalDiv = styled.div<{ gap?: SpaceValues | string | number }>`
  display: flex;
  flex-direction: row;
  gap: ${({ gap }) => valueToSpaceVar(gap || "0")};
`;

export default HStack;
