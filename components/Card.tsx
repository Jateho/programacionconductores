'use client';

export function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{subtitle}</p>
          <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
