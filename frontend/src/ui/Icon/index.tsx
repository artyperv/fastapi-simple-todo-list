import React from "react";
import CloseIcon from "./icons/CloseIcon";
import MoonIcon from "./icons/MoonIcon";
import PlusIcon from "./icons/PlusIcon";
import ProfileIcon from "./icons/ProfileIcon";
import SunIcon from "./icons/SunIcon";

export type IconProps = React.SVGProps<SVGSVGElement> & {
  color?: string
}

const ICONS = {
  close: (props: IconProps) => <CloseIcon {...props} />,
  plus: (props: IconProps) => <PlusIcon {...props} />,
  sun: (props: IconProps) => <SunIcon {...props} />,
  moon: (props: IconProps) => <MoonIcon {...props} />,
  profile: (props: IconProps) => <ProfileIcon {...props} />,
};

type IconContainerProps = IconProps & {
  name: keyof typeof ICONS;
}

const Icon: React.FC<IconContainerProps> = ({ name, ...rest }) => {
  const IconComponent = ICONS[name];

  return IconComponent ? <IconComponent {...rest} /> : null;
};

export default Icon;