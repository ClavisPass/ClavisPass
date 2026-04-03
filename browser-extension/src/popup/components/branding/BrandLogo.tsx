import type { ImgHTMLAttributes } from "react";
import brandMark from "../../../../../src/shared/branding/clavispass-mark.svg";
import { CLAVISPASS_BRAND_NAME } from "../../../../../src/shared/branding/brand";

export function BrandLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      alt={props.alt ?? CLAVISPASS_BRAND_NAME}
      src={props.src ?? brandMark}
      {...props}
    />
  );
}
