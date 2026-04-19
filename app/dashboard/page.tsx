'use client';

import { Bell, CalendarDays, Truck, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Shell } from '@/components/Shell';
import { Card } from '@/components/Card';
import { Loader } from '@/components/Loader';

async function fetchStats() {
  const [conductores, vehiculos, turnos, novedades] = await Promise.all([
    fetch('/api/conductores').then((res) => res.json()),
    fetch('/api/vehiculos').then((res) => res.json()),
    fetch('/api/turnos').then((res) => res.json()),
    fetch('/api/novedades').then((res) => res.json()),
  ]);

  return {
    conductores: conductores.length,
    vehiculos: vehiculos.length,
    turnos: turnos.length,
    novedades: novedades.length,
  };
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['dashboard'], queryFn: fetchStats });

  if (isLoading) return <Shell><Loader /></Shell>;
  if (error || !data) return <Shell><div className="rounded-[32px] border border-red-200 bg-red-50 p-6 text-red-800">Error cargando métricas.</div></Shell>;

  return (
    <Shell>
      <div className="grid gap-6">
        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-[32px] bg-gradient-to-br from-brand-600 via-slate-950 to-slate-900 p-8 text-white shadow-xl">
            <div>
              <p className="text-sm uppercase tracking-[0.33em] text-brand-200">Resumen</p>
              <h2 className="mt-4 text-4xl font-semibold">Centro de control de la flota</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200/90">
                Supervisa los indicadores clave de conductores, vehículos y turnos con una vista clara y optimizada para decisiones rápidas.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[28px] bg-white/10 p-5 shadow-sm backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Vehículos</p>
                <p className="mt-3 text-3xl font-semibold">{data.vehiculos}</p>
              </div>
              <div className="rounded-[28px] bg-white/10 p-5 shadow-sm backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Conductores</p>
                <p className="mt-3 text-3xl font-semibold">{data.conductores}</p>
              </div>
              <div className="rounded-[28px] bg-white/10 p-5 shadow-sm backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Turnos</p>
                <p className="mt-3 text-3xl font-semibold">{data.turnos}</p>
              </div>
              <div className="rounded-[28px] bg-white/10 p-5 shadow-sm backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Novedades</p>
                <p className="mt-3 text-3xl font-semibold">{data.novedades}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <Card title="Actividad reciente" subtitle="Estado de la flota" className="overflow-hidden">
              <div className="rounded-[28px] bg-slate-950 p-6 text-white">
                <p className="text-sm text-slate-300">Últimos movimientos y alertas en la flota.</p>
                <div className="mt-4 grid gap-4">
                  <div className="flex items-center justify-between rounded-3xl bg-slate-900/80 px-4 py-3">
                    <span className="text-sm text-slate-300">Turnos por iniciar</span>
                    <span className="text-lg font-semibold">{data.turnos}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-3xl bg-slate-900/80 px-4 py-3">
                    <span className="text-sm text-slate-300">Novedades activas</span>
                    <span className="text-lg font-semibold">{data.novedades}</span>
                  </div>
                </div>
              </div>
            </Card>
            <Card title="Resumen rápido" subtitle="Información clave">
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <Truck className="h-5 w-5 text-brand-600" />
                  <p className="text-sm text-slate-700">Control completo de vehículos.</p>
                </div>
                <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <User className="h-5 w-5 text-brand-600" />
                  <p className="text-sm text-slate-700">Pilotos y conductores siempre visibles.</p>
                </div>
                <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <CalendarDays className="h-5 w-5 text-brand-600" />
                  <p className="text-sm text-slate-700">Planificación más precisa.</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card title="Planificación semanal" subtitle="Vista rápida" className="overflow-hidden">
            <p className="text-sm text-slate-500">Genera reportes y ajusta turnos sin solapamientos.</p>
          </Card>
          <Card title="Reportes operativos" subtitle="Rendimiento" className="overflow-hidden">
            <p className="text-sm text-slate-500">Monitoreo de horas trabajadas y disponibilidad.</p>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
