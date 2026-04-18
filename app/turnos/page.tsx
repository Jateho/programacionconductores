'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Shell } from '@/components/Shell';
import { Loader } from '@/components/Loader';
import { turnoSchema } from '@/lib/validators';
import { z } from 'zod';

const formSchema = turnoSchema;

type FormData = z.infer<typeof formSchema>;

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function getWeekDate(date: Date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  return Array.from({ length: 7 }).map((_, index) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + index);
    return d;
  });
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function TurnosPage() {
  const conductoresQuery = useQuery(['conductores'], () => fetch('/api/conductores').then((res) => res.json()));
  const vehiculosQuery = useQuery(['vehiculos'], () => fetch('/api/vehiculos').then((res) => res.json()));
  const turnosQuery = useQuery(['turnos'], () => fetch('/api/turnos').then((res) => res.json()));
  const mutation = useMutation((payload: FormData) => fetch('/api/turnos', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  }), {
    onSuccess: async () => { toast.success('Turno creado'); await turnosQuery.refetch(); reset(); },
    onError: async (error: any) => {
      const message = error?.message || 'No se pudo crear el turno';
      toast.error(message);
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(formSchema) });
  const onSubmit = (values: FormData) => mutation.mutate(values);

  if (conductoresQuery.isLoading || vehiculosQuery.isLoading || turnosQuery.isLoading) return <Shell><Loader /></Shell>;

  const today = new Date();
  const week = getWeekDate(today);
  const groupedTurnos = turnosQuery.data.reduce((acc: Record<string, any[]>, turno: any) => {
    const key = formatDateKey(new Date(turno.fecha));
    acc[key] = acc[key] || [];
    acc[key].push(turno);
    return acc;
  }, {});

  return (
    <Shell>
      <div className="space-y-6">
        <div className="card p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Calendario semanal</p>
              <h2 className="text-2xl font-semibold text-slate-950">Programación de Turnos</h2>
            </div>
          </div>
          <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-7">
            {week.map((date, index) => {
              const key = formatDateKey(date);
              return (
                <div key={key} className="rounded-3xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{weekDays[index]}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{date.getDate()}</p>
                  <div className="mt-4 space-y-3">
                    {(groupedTurnos[key] || []).map((turno: any) => (
                      <div key={turno.id} className="rounded-3xl border border-slate-200 bg-slate-100 p-3 text-xs text-slate-700">
                        <p className="font-semibold">{turno.conductor?.codigo || 'Sin conductor'}</p>
                        <p>{turno.vehiculo?.vehiculoID || 'Sin vehículo'}</p>
                        <p>{turno.horaInicio} - {turno.horaFin}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.9fr_0.95fr]">
          <div className="card p-6">
            <h2 className="mb-4 text-xl font-semibold">Turnos recientes</h2>
            <div className="space-y-4">
              {turnosQuery.data.slice(0, 6).map((turno: any) => (
                <div key={turno.id} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{new Date(turno.fecha).toLocaleDateString()}</p>
                      <p className="text-sm text-slate-500">{turno.conductor?.codigo} / {turno.vehiculo?.vehiculoID}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {turno.horaInicio} - {turno.horaFin}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="mb-4 text-xl font-semibold">Nuevo turno</h2>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Conductor</span>
                <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('conductorId')}>
                  <option value="">Seleccionar conductor</option>
                  {conductoresQuery.data.map((conductor: any) => (
                    <option key={conductor.id} value={conductor.id}>{conductor.codigo} — {conductor.nombre}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-red-600">{errors.conductorId?.message}</p>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Vehículo</span>
                <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('vehiculoId')}>
                  <option value="">Seleccionar vehículo</option>
                  {vehiculosQuery.data.map((vehiculo: any) => (
                    <option key={vehiculo.id} value={vehiculo.id}>{vehiculo.vehiculoID} — {vehiculo.placa}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-red-600">{errors.vehiculoId?.message}</p>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Fecha</span>
                  <input type="date" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('fecha')} />
                  <p className="mt-1 text-xs text-red-600">{errors.fecha?.message}</p>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Hora inicio</span>
                  <input type="time" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('horaInicio')} />
                  <p className="mt-1 text-xs text-red-600">{errors.horaInicio?.message}</p>
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Hora fin</span>
                <input type="time" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('horaFin')} />
                <p className="mt-1 text-xs text-red-600">{errors.horaFin?.message}</p>
              </label>
              <button type="submit" className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-white hover:bg-brand-700">
                Crear turno
              </button>
            </form>
          </div>
        </div>
      </div>
    </Shell>
  );
}
