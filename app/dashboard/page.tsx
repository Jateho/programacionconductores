'use client';

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
  const { data, isLoading, error } = useQuery(['dashboard'], fetchStats);

  if (isLoading) return <Shell><Loader /></Shell>;
  if (error || !data) return <Shell><div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800">Error cargando métricas.</div></Shell>;

  return (
    <Shell>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <Card title={`${data.vehiculos}`} subtitle="Vehículos registrados">
          <p className="text-sm text-slate-500">Estado general de la flota.</p>
        </Card>
        <Card title={`${data.conductores}`} subtitle="Conductores activos">
          <p className="text-sm text-slate-500">Total de conductores en el sistema.</p>
        </Card>
        <Card title={`${data.turnos}`} subtitle="Turnos programados">
          <p className="text-sm text-slate-500">Turnos creados para la semana.</p>
        </Card>
        <Card title={`${data.novedades}`} subtitle="Novedades recientes">
          <p className="text-sm text-slate-500">Incidencias y mantenimientos registrados.</p>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="Planificación semanal" subtitle="Vista rápida">
          <p className="text-sm text-slate-500">Genera reportes y ajusta turnos sin solapamientos.</p>
        </Card>
        <Card title="Reportes operativos" subtitle="Rendimiento">
          <p className="text-sm text-slate-500">Monitoreo de horas trabajadas y disponibilidad.</p>
        </Card>
      </div>
    </Shell>
  );
}
