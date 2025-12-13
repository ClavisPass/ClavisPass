import * as React from "react";
import { Svg, Path, SvgProps } from "react-native-svg";

const Blob1: React.FC<SvgProps> = ({ ...props }) => (
  <Svg viewBox="0 0 200 200" {...props}>
    <Path
      fill="#787FF6"
      d="M40.5,-48.3C51.6,-39,59,-25.4,65.8,-8.4C72.5,8.5,78.6,28.7,70.7,39.5C62.9,50.4,41.2,51.9,21.9,58C2.6,64,-14.2,74.6,-29.2,72.6C-44.3,70.5,-57.5,55.7,-62.4,39.7C-67.3,23.7,-63.8,6.5,-59.9,-9.7C-56,-25.9,-51.7,-41.2,-41.7,-50.7C-31.6,-60.2,-15.8,-63.8,-0.5,-63.1C14.7,-62.5,29.4,-57.5,40.5,-48.3Z"
      transform="translate(100 100)"
    />
  </Svg>
);

export default Blob1;
