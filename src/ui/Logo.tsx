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
      d="M288.857 324.383c95.996-12.455 179.678-40.787 251.143-79.186 71.68 38.514 155.651 66.902 252.011 79.298-98.741 79.317-179.995 172.846-251.507 275.316-71.547-102.518-152.843-196.087-251.647-275.428Z"
      fill="url(#gradient1)"
      transform="matrix(1.67587,0,0,1.88679,-366.657,-477.218)"
    />
    <Path
      d="M434.139 917.703C289.78 813.531 202.333 716.705 148.924 615.274 89.601 502.613 72.395 384.634 64.17 245.936c182.521 146.396 325.365 328.685 448.664 531.401-1.566 2.63-3.128 5.263-4.688 7.899a25.78 25.78 0 0 0-.309.537l-73.698 131.93Z"
      fill="url(#gradient2)"
      transform="matrix(1.13013,0,0,1.13013,-73,-96)"
    />
    <Path
      d="M862.724 350.572c-5.547 89.896-17.15 166.363-57.155 239.384C761.291 670.777 682.322 747.088 540 833.279c-15.672-9.492-30.581-18.87-44.765-28.151l51.55-88.695c86.184-139.976 186.197-265.842 315.939-365.861Z"
      fill="url(#gradient3)"
      transform="matrix(1.67587,0,0,1.74365,-366.657,-477.218)"
    />
  </Svg>
);

export default Logo;
