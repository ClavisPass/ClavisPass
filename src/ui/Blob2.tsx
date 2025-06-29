import * as React from "react";
import { Svg, Path, SvgProps } from "react-native-svg";

const Blob2: React.FC<SvgProps> = ({ ...props }) => (
  <Svg viewBox="0 0 200 200" {...props}>
    <Path
      fill="#69C4FF"
      d="M34.7,-34.5C46.7,-31.4,59.3,-22,63.1,-9.7C67,2.6,62.2,17.9,52.5,26.2C42.8,34.6,28.2,36,13.9,43.5C-0.4,51,-14.4,64.5,-25.9,63.6C-37.4,62.7,-46.5,47.4,-56.9,31.7C-67.3,16,-79,0,-74.9,-11.5C-70.9,-23,-51,-30.1,-35.9,-32.7C-20.8,-35.3,-10.4,-33.5,0.5,-34.1C11.4,-34.7,22.8,-37.7,34.7,-34.5Z"
      transform="translate(100 100)"
    />
  </Svg>
);

export default Blob2;
