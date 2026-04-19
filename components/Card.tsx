'use client';

export function Card({ title, subtitle, children, className }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`card p-6 ${className ?? ''}`}>
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          {subtitle ? <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{subtitle}</p> : null}
          <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
