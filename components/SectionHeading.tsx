'use client';

export function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}
