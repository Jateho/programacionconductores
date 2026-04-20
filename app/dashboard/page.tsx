'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AlertTriangle, CalendarDays, Truck, User } from 'lucide-react';
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
    recentTurnos: turnos.slice(0, 3),
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    }
  }, [router, status]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchStats,
    enabled: status === 'authenticated',
  });

  if (status === 'loading' || status === 'unauthenticated' || !session) return <Shell><Loader /></Shell>;
  if (isLoading) return <Shell><Loader /></Shell>;
  if (error || !data) return <Shell><div className="rounded-[32px] border border-red-200 bg-red-50 p-6 text-red-800">Error cargando métricas.</div></Shell>;

  return (
    <Shell>
      <div className="grid gap-6">
        <div className="rounded-[32px] border border-slate-200/70 bg-white/95 p-8 shadow-sm backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Dashboard principal</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">Visión general del estado operativo de la flota en tiempo real</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Visión general del estado operativo de la flota en tiempo real.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-brand-600">
                  <Truck className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">82% activo</span>
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-slate-500">Vehículos activos</p>
              <p className="mt-4 text-3xl font-semibold text-slate-950">{data.vehiculos}/17</p>
              <div className="mt-5 h-1 rounded-full bg-slate-100">
                <div className="h-1 rounded-full bg-brand-600" style={{ width: '84%' }} />
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-brand-600">
                  <User className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-emerald-700">+2 vs ayer</span>
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-slate-500">Conductores disponibles</p>
              <p className="mt-4 text-3xl font-semibold text-slate-950">{data.conductores}</p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-brand-600">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Hoy</span>
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-slate-500">Turnos hoy</p>
              <p className="mt-4 text-3xl font-semibold text-slate-950">{data.turnos}</p>
            </div>

            <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">Atención requerida</span>
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-red-600">Novedades críticas</p>
              <p className="mt-4 text-3xl font-semibold text-slate-950">{data.novedades}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <Card title="Uso de vehículos por semana" subtitle="Promedio de utilización de la flota total" className="overflow-hidden">
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">Promedio de utilización de la flota total.</p>
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 p-1">
                  <button className="rounded-full bg-brand-700 px-4 py-2 text-xs font-semibold text-white">Semana</button>
                  <button className="rounded-full px-4 py-2 text-xs font-semibold text-slate-600">Mes</button>
                </div>
              </div>
              <div className="space-y-4">
                {['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'].map((day, index) => (
                  <div key={day} className="grid gap-3 sm:grid-cols-[72px_1fr] sm:items-center">
                    <span className="text-xs font-semibold uppercase text-slate-500">{day}</span>
                    <div className="h-4 rounded-full bg-slate-100">
                      <div className="h-4 rounded-full bg-brand-600" style={{ width: `${45 + index * 7}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Ubicación de flota" subtitle="Última actualización hace 2 minutos" className="overflow-hidden">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950">
                <img src="/images/dashboard-map.svg" alt="Mapa de flota" className="h-72 w-full object-cover" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Unidades en línea</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">14</p>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Alertas recientes</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">3</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                <span>Última actualización: hace 2m</span>
                <a href="#" className="font-semibold text-brand-700">Ver mapa completo</a>
              </div>
            </div>
          </Card>
        </div>

        <Card title="Turnos recientes" subtitle="Registro de las últimas asignaciones completadas y en curso" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-600">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-4 py-4 font-medium">Conductor</th>
                  <th className="px-4 py-4 font-medium">Vehículo</th>
                  <th className="px-4 py-4 font-medium">Horario</th>
                  <th className="px-4 py-4 font-medium">Estado</th>
                  <th className="px-4 py-4 font-medium text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.recentTurnos.length > 0 ? (
                  data.recentTurnos.map((turno: any) => (
                    <tr key={turno.id} className="bg-white">
                      <td className="px-4 py-4">
                        <div className="text-sm font-semibold text-slate-950">{turno.conductor?.nombre ?? 'Conductor'}</div>
                        <div className="text-xs text-slate-500">ID: {turno.conductor?.id ?? '---'}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-semibold text-slate-950">{turno.vehiculo?.marca ?? 'Vehículo'}</div>
                        <div className="text-xs text-slate-500">{turno.vehiculo?.placa ?? '---'}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-semibold text-slate-950">{turno.horaInicio} - {turno.horaFin}</div>
                        <div className="text-xs text-slate-500">{new Date(turno.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={
                          `inline-flex rounded-full px-3 py-1 text-xs font-semibold ${turno.estado === 'Finalizado' ? 'bg-emerald-100 text-emerald-700' : turno.estado === 'Pendiente' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`
                        }>{turno.estado ?? 'En curso'}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="text-sm font-semibold text-brand-700">DETALLES</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">No hay turnos recientes disponibles.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
