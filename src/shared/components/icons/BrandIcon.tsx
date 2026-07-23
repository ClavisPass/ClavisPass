import React from "react";
import Svg, { Path } from "react-native-svg";
import type { SimpleIcon } from "simple-icons";

type Props = {
  icon: SimpleIcon;
  size?: number;
  color?: string;
};

function BrandIcon({ icon, size = 20, color }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessibilityRole="image"
      accessibilityLabel={icon.title}
      pointerEvents="none"
    >
      <Path d={icon.path} fill={color ?? `#${icon.hex}`} />
    </Svg>
  );
}

export default BrandIcon;
