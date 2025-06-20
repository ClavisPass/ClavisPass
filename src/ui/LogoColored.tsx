import * as React from "react";
import { Svg, Path, SvgProps } from "react-native-svg";

interface ClavisPassProps extends SvgProps {
  fillColor?: string;
}

const LogoColored: React.FC<ClavisPassProps> = ({
  fillColor = "#fff",
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
    <Path
      d="M288.857 324.383c95.996-12.455 179.678-40.787 251.143-79.186 71.68 38.514 155.651 66.902 252.011 79.298-98.741 79.317-179.995 172.846-251.507 275.316-71.547-102.518-152.843-196.087-251.647-275.428Z"
      fill={fillColor}
      transform="matrix(1.67587 0 0 1.88679 -365.814 -404.855)"
    />
    <Path
      d="M434.139 917.703C289.78 813.531 202.333 716.705 148.924 615.274 89.601 502.613 72.395 384.634 64.17 245.936c182.521 146.396 325.365 328.685 448.664 531.401-1.566 2.63-3.128 5.263-4.688 7.899a25.78 25.78 0 0 0-.309.537l-73.698 131.93Z"
      fill={fillColor}
      transform="matrix(1.13013 0 0 1.13013 -72.52 -97.387)"
    />
    <Path
      d="M862.724 350.572c-5.547 89.896-17.15 166.363-57.155 239.384C761.291 670.777 682.322 747.088 540 833.279c-15.672-9.492-30.581-18.87-44.765-28.151l51.55-88.695c86.184-139.976 186.197-265.842 315.939-365.861Z"
      fill={fillColor}
      transform="matrix(1.67587 0 0 1.74365 -365.814 -430.72)"
    />
  </Svg>
);

export default LogoColored;
