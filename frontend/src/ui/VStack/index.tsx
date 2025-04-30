import { SpaceValues, valueToSpaceVar } from "@/styles/spaceValues";
import styled from "@emotion/styled";
import React from "react";

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: SpaceValues | (string & {} /* for narrowing */) | number;
}

const VStack: React.FC<DivProps> = ({ gap, children, ...props }) => {
  return <StyledFlexVerticalDiv gap={gap} {...props}>{children}</StyledFlexVerticalDiv>;
};

const StyledFlexVerticalDiv = styled.div<{ gap?: SpaceValues | string | number }>`
  display: flex;
  flex-direction: column;
  gap: ${props => valueToSpaceVar(props.gap || "0")};
`;

export default VStack;
