'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Settings, TrendingUp, Truck, User, CalendarDays, Bell } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: TrendingUp },
  { href: '/conductores', label: 'Conductores', icon: User },
  { href: '/vehiculos', label: 'Vehículos', icon: Truck },
  { href: '/turnos', label: 'Turnos', icon: CalendarDays },
  { href: '/reportes', label: 'Reportes', icon: Bell },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen grid-cols-[280px_1fr]">
        <aside className="flex flex-col border-r border-slate-200 bg-white px-6 py-8">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-brand-600 text-white">FM</div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">FleetManager</p>
              <p className="text-lg font-semibold text-slate-900">Enterprise</p>
            </div>
          </div>
          <nav className="space-y-1">
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
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto pt-8">
            <div className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">Administración</div>
            <Link href="/auth/signin" className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
              <LogOut className="h-4 w-4" /> Salir
            </Link>
            <Link href="/" className="mt-3 flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
              <Settings className="h-4 w-4" /> Configuración
            </Link>
          </div>
        </aside>
        <main className="px-6 py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Gestión operativa</p>
              <h1 className="text-3xl font-semibold text-slate-950">Panel de control</h1>
            </div>
            <div className="inline-flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              <Bell className="h-4 w-4 text-brand-600" /> Admin User
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
