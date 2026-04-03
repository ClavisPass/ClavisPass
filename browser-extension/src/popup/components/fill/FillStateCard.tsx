import type { PreparedFillSummary } from "../../../shared/types";

interface FillStateCardProps {
  preparedFill?: PreparedFillSummary;
  detail: string;
}

export function FillStateCard({ preparedFill, detail }: FillStateCardProps) {
  return (
    <section className="prepare-card">
      <p className="section-title">{preparedFill?.title ?? "Selected entry"}</p>
      <p className="subtle">{detail}</p>
    </section>
  );
}
