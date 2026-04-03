interface BridgeStatusBadgeProps {
  label: string;
  tone: "ready" | "not_ready" | "protocol_error" | "pending" | "locked" | "unpaired" | "host_unreachable";
}

export function BridgeStatusBadge({ label, tone }: BridgeStatusBadgeProps) {
  return <span className={`status-badge status-${tone}`}>{label}</span>;
}
