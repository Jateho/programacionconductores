'use client';

export function Card({ title, subtitle, actions, children, className }: { title: string; subtitle?: string; actions?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[32px] border border-slate-200/70 bg-white/95 p-6 shadow-sm backdrop-blur-sm ${className ?? ''}`}>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {subtitle ? <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{subtitle}</p> : null}
          <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
      <div>{children}</div>
    </div>
  );
}
