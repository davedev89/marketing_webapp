type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="space-y-3">
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean">{eyebrow}</p> : null}
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h2>
        {description ? <p className="max-w-2xl text-base text-slate-600">{description}</p> : null}
      </div>
    </div>
  );
}
