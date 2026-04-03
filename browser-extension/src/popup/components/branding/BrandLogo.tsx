import type { ImgHTMLAttributes } from "react";
import brandMark from "../../assets/logo/clavispass-mark.svg";

export function BrandLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
  return <img alt={props.alt ?? "ClavisPass"} src={props.src ?? brandMark} {...props} />;
}
