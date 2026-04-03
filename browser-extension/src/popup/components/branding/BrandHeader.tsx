import type { ReactNode } from "react";

interface BrandHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  visual?: ReactNode;
}

export function BrandHeader({ eyebrow, title, description, visual }: BrandHeaderProps) {
  return (
    <section className="hero-card">
      <div className="section-header-row">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="subtle">{description}</p>
        </div>
        {visual}
      </div>
    </section>
  );
}
