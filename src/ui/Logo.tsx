import * as React from "react";
import { Svg, Defs, LinearGradient, Stop, Path, SvgProps } from "react-native-svg";

const Logo: React.FC<SvgProps> = ({
  ...props
}) => (
  <Svg
    viewBox="0 0 1080 1080"
    fillRule="evenodd"
    clipRule="evenodd"
    strokeLinejoin="round"
    strokeMiterlimit={2}
    {...props}
  >
    <Defs>
      <LinearGradient
        id="gradient1"
        x1="0"
        y1="0"
        x2="1"
        y2="0"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(681.851,0,0,681.851,199.577,467.99)"
      >
        <Stop offset="0" stopColor="#787ff6" />
        <Stop offset="1" stopColor="#69c4ff" />
      </LinearGradient>
      <LinearGradient
        id="gradient2"
        x1="0"
        y1="0"
        x2="1"
        y2="0"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(1.1121,0,0,0.846551,-0.0611607,0.48448)"
      >
        <Stop offset="0" stopColor="#787ff6" />
        <Stop offset="1" stopColor="#69c4ff" />
      </LinearGradient>
      <LinearGradient
        id="gradient3"
        x1="0"
        y1="0"
        x2="1"
        y2="0"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(408.378,0,0,408.378,473.05,584.286)"
      >
        <Stop offset="0" stopColor="#787ff6" />
        <Stop offset="1" stopColor="#69c4ff" />
      </LinearGradient>
    </Defs>

    <Path
      d="M288.857,324.383C384.853,311.928 468.535,283.596 540,245.197C611.68,283.711 695.651,312.099 792.011,324.495C693.27,403.812 612.016,497.341 540.504,599.811C468.957,497.293 387.661,403.724 288.857,324.383Z"
      fill="url(#gradient1)"
      transform="matrix(1.67587,0,0,1.88679,-366.657,-477.218)"
    />
    <Path
      d="M434.139,917.703C289.78,813.531 202.333,716.705 148.924,615.274C89.601,502.613 72.395,384.634 64.17,245.936C246.691,392.332 389.535,574.621 512.834,777.337C511.268,779.967 509.706,782.6 508.146,785.236C508.041,785.413 507.938,785.593 507.837,785.773L434.139,917.703Z"
      fill="url(#gradient2)"
      transform="matrix(1.13013,0,0,1.13013,-73,-96)"
    />
    <Path
      d="M862.724,350.572C857.177,440.468 845.574,516.935 805.569,589.956C761.291,670.777 682.322,747.088 540,833.279C524.328,823.787 509.419,814.409 495.235,805.128C495.235,805.128 544.244,720.806 546.785,716.433C632.969,576.457 732.982,450.591 862.724,350.572Z"
      fill="url(#gradient3)"
      transform="matrix(1.67587,0,0,1.74365,-366.657,-477.218)"
    />
  </Svg>
);

export default Logo;
