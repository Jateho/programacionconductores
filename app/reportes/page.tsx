'use client';

import { useQuery } from '@tanstack/react-query';
import { Shell } from '@/components/Shell';
import { Loader } from '@/components/Loader';
import { Card } from '@/components/Card';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function downloadCsv(filename: string, rows: string) {
  const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.click();
}

export default function ReportesPage() {
  const { data, isLoading } = useQuery(['reportes'], () => fetch('/api/reports').then((res) => res.json()));

  if (isLoading) return <Shell><Loader /></Shell>;
  if (!data) return <Shell><div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800">Error cargando los reportes.</div></Shell>;

  const conductorCsv = ['Código,Nombre,Horas trabajadas,Horas incapacidad,Horas vacaciones,Horas disponibles',
    ...data.conductorReport.map((item: any) => `${item.codigo},${item.nombre},${item.horasTrabajadas.toFixed(1)},${item.horasIncapacidad.toFixed(1)},${item.horasVacaciones.toFixed(1)},${item.horasDisponibles.toFixed(1)}`)].join('\n');

  const vehiculoCsv = ['ID,Placa,Horas trabajadas,Horas taller aseguradora,Horas taller mecánico,Horas disponibles',
    ...data.vehiculoReport.map((item: any) => `${item.vehiculoID},${item.placa},${item.horasTrabajadas.toFixed(1)},${item.horasTallerAseguradora.toFixed(1)},${item.horasTallerMecanico.toFixed(1)},${item.horasDisponibles.toFixed(1)}`)].join('\n');

  return (
    <Shell>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Reporte por conductor" subtitle="Resumen de horas">
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <button className="rounded-2xl bg-brand-600 px-4 py-3 text-white hover:bg-brand-700" onClick={() => downloadCsv('conductor-report.csv', conductorCsv)}>
              Exportar Excel
            </button>
            <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 hover:bg-slate-50" onClick={() => window.print()}>
              Exportar PDF
            </button>
          </div>
          <div className="space-y-3">
            {data.conductorReport.slice(0, 5).map((item: any) => (
              <div key={item.id} className="rounded-3xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">{item.nombre}</p>
                <p className="text-sm text-slate-600">Horas trabajadas: {item.horasTrabajadas.toFixed(1)}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Reporte por vehículo" subtitle="Estado operativo">
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <button className="rounded-2xl bg-brand-600 px-4 py-3 text-white hover:bg-brand-700" onClick={() => downloadCsv('vehiculo-report.csv', vehiculoCsv)}>
              Exportar Excel
            </button>
            <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 hover:bg-slate-50" onClick={() => window.print()}>
              Exportar PDF
            </button>
          </div>
          <div className="space-y-3">
            {data.vehiculoReport.slice(0, 5).map((item: any) => (
              <div key={item.id} className="rounded-3xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">{item.vehiculoID} - {item.placa}</p>
                <p className="text-sm text-slate-600">Horas en taller: {(item.horasTallerAseguradora + item.horasTallerMecanico).toFixed(1)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-slate-950">Tendencia de horas por conductor</h2>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.conductorReport.slice(0, 6)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="codigo" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="horasTrabajadas" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Shell>
  );
}
