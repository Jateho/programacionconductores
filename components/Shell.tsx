'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Settings, TrendingUp, Truck, User, CalendarDays, Bell, Search, Sparkles } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: TrendingUp },
  { href: '/conductores', label: 'Conductores', icon: User },
  { href: '/vehiculos', label: 'Vehículos', icon: Truck },
  { href: '/turnos', label: 'Turnos', icon: CalendarDays },
  { href: '/reportes', label: 'Reportes', icon: Bell },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const pageMeta: Record<string, { title: string; subtitle: string }> = {
    '/dashboard': { title: 'Panel de control', subtitle: 'Visión general de la flota' },
    '/conductores': { title: 'Conductores', subtitle: 'Control y registro de la plantilla' },
    '/vehiculos': { title: 'Vehículos', subtitle: 'Gestión del parque automotor' },
    '/turnos': { title: 'Turnos', subtitle: 'Programación y agenda semanal' },
    '/reportes': { title: 'Reportes', subtitle: 'Análisis operativo y métricas' },
    '/novedades': { title: 'Novedades', subtitle: 'Eventos y estados de la flota' },
  };

  const meta = pageMeta[pathname] ?? { title: 'Panel de control', subtitle: 'Gestión operativa' };

  return (
    <div className="min-h-screen bg-slate-100" style={{ minHeight: '100vh', backgroundColor: '#eff5ff', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#111827' }}>
      <div className="grid min-h-screen grid-cols-[280px_1fr] gap-6" style={{ display: 'grid', minHeight: '100vh', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
        <aside className="flex flex-col border-r border-slate-200/70 bg-white/95 px-6 py-8 shadow-sm backdrop-blur-sm" style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(148,163,184,0.35)', backgroundColor: 'rgba(255,255,255,0.95)', padding: '32px 24px', boxShadow: '0 10px 30px rgba(15,23,42,0.08)' }}>
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-600 text-xl font-bold text-white shadow-lg" style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '24px', backgroundColor: '#2d79f6', color: '#fff', boxShadow: '0 20px 40px rgba(45,121,246,0.15)' }}>FM</div>
            <div>
              <p className="text-xs uppercase tracking-[0.33em] text-slate-400" style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>FleetManager</p>
              <p className="text-lg font-semibold text-slate-950" style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>Enterprise Edition</p>
            </div>
          </div>

          <Link href="#" className="mb-6 inline-flex items-center justify-center rounded-3xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700" style={{ borderRadius: '24px', backgroundColor: '#2d79f6', color: '#ffffff', textDecoration: 'none' }}>
            + New Dispatch
          </Link>

          <nav className="space-y-2" style={{ display: 'grid', gap: '8px' }}>
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                    active ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '24px', padding: '12px 16px', textDecoration: 'none', color: active ? '#fff' : '#334155', backgroundColor: active ? '#2d79f6' : 'transparent' }}
                >
                  <Icon className="h-5 w-5" style={{ width: '20px', height: '20px' }} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto pt-8" style={{ marginTop: 'auto', paddingTop: '32px' }}>
            <div className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-400" style={{ marginBottom: '16px', fontSize: '10px', letterSpacing: '0.16em', color: '#94a3b8', textTransform: 'uppercase' }}>Administración</div>
            <Link href="/auth/signin" className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100" style={{ display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '24px', padding: '12px 16px', textDecoration: 'none', color: '#334155', backgroundColor: 'rgba(248,250,252,1)' }}>
              <LogOut className="h-4 w-4" style={{ width: '16px', height: '16px' }} /> Salir
            </Link>
            <Link href="/" className="mt-3 flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100" style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '24px', padding: '12px 16px', textDecoration: 'none', color: '#334155', backgroundColor: 'rgba(248,250,252,1)' }}>
              <Settings className="h-4 w-4" style={{ width: '16px', height: '16px' }} /> Configuración
            </Link>
          </div>
        </aside>

        <main className="px-6 py-8" style={{ padding: '32px' }}>
          <div className="mx-auto max-w-7xl space-y-6" style={{ maxWidth: '1120px', margin: '0 auto', display: 'grid', gap: '24px' }}>
            <div className="rounded-[32px] border border-slate-200/70 bg-white/90 p-6 shadow-sm backdrop-blur-sm" style={{ borderRadius: '32px', border: '1px solid rgba(148,163,184,0.35)', backgroundColor: 'rgba(255,255,255,0.9)', padding: '24px', boxShadow: '0 10px 30px rgba(15,23,42,0.06)' }}>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <p className="text-sm text-slate-500">Buscar flota, conductores o rutas...</p>
                  <div className="relative mt-4 max-w-xl">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar flota, conductores o rutas..."
                      className="w-full rounded-[24px] border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-slate-600 shadow-sm transition hover:bg-slate-100">
                    <Bell className="h-5 w-5" />
                  </button>
                  <button className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-slate-600 shadow-sm transition hover:bg-slate-100">
                    <CalendarDays className="h-5 w-5" />
                  </button>
                  <div className="hidden items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex">
                    <img src="/images/driver-sample.svg" alt="Admin user" className="h-10 w-10 rounded-3xl object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-slate-950">Admin User</p>
                      <p className="text-xs text-slate-500">Fleet Director</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
