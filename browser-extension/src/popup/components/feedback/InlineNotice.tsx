import type { ReactNode } from "react";

interface InlineNoticeProps {
  children: ReactNode;
  tone?: "default" | "error";
}

export function InlineNotice({ children, tone = "default" }: InlineNoticeProps) {
  return <p className={tone === "error" ? "error-inline" : "subtle"}>{children}</p>;
}
