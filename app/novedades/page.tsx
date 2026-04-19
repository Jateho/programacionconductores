'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Shell } from '@/components/Shell';
import { Loader } from '@/components/Loader';
import { novedadSchema } from '@/lib/validators';
import { conductorSchema, vehiculoSchema } from '@/lib/validators';
import { z } from 'zod';

const formSchema = novedadSchema;

type FormData = z.infer<typeof formSchema>;

export default function NovedadesPage() {
  const conductoresQuery = useQuery({ queryKey: ['conductores'], queryFn: () => fetch('/api/conductores').then((res) => res.json()) });
  const vehiculosQuery = useQuery({ queryKey: ['vehiculos'], queryFn: () => fetch('/api/vehiculos').then((res) => res.json()) });
  const novedadesQuery = useQuery({ queryKey: ['novedades'], queryFn: () => fetch('/api/novedades').then((res) => res.json()) });
  const mutation = useMutation({
    mutationFn: (payload: FormData) => fetch('/api/novedades', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    }),
    onSuccess: async () => { toast.success('Novedad registrada'); await novedadesQuery.refetch(); reset(); },
    onError: () => toast.error('No se pudo registrar la novedad'),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(formSchema) });
  const onSubmit = (values: FormData) => mutation.mutate(values);

  if (conductoresQuery.isLoading || vehiculosQuery.isLoading || novedadesQuery.isLoading) {
    return <Shell><Loader /></Shell>;
  }

  return (
    <Shell>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_0.95fr]">
        <div className="card p-6">
          <h2 className="mb-4 text-xl font-semibold">Novedades</h2>
          <div className="space-y-4">
            {novedadesQuery.data.map((item: any) => (
              <div key={item.id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{item.tipo.replace('_', ' ')}</p>
                    <p className="text-sm text-slate-500">{item.descripcion}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {item.conductor?.codigo ?? item.vehiculo?.vehiculoID ?? 'General'}
                  </span>
                </div>
                <div className="mt-3 grid gap-1 text-sm text-slate-600">
                  <p>Inicio: {new Date(item.fechaInicio).toLocaleDateString()}</p>
                  <p>Fin: {new Date(item.fechaFin).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="mb-4 text-xl font-semibold">Registrar novedad</h2>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Tipo</span>
              <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('tipo')}>
                <option value="INCAPACIDAD">Incapacidad</option>
                <option value="VACACIONES">Vacaciones</option>
                <option value="DISPONIBLE">Disponible</option>
                <option value="TALLER_ASEGURADORA">Taller aseguradora</option>
                <option value="TALLER_MECANICO">Taller mecánico</option>
              </select>
              <p className="mt-1 text-xs text-red-600">{errors.tipo?.message}</p>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Descripción</span>
              <textarea className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" rows={4} {...register('descripcion')} />
              <p className="mt-1 text-xs text-red-600">{errors.descripcion?.message}</p>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Fecha inicio</span>
                <input type="date" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('fechaInicio')} />
                <p className="mt-1 text-xs text-red-600">{errors.fechaInicio?.message}</p>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Fecha fin</span>
                <input type="date" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('fechaFin')} />
                <p className="mt-1 text-xs text-red-600">{errors.fechaFin?.message}</p>
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Conductor (opcional)</span>
              <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('conductorId')}>
                <option value="">Seleccionar conductor</option>
                {conductoresQuery.data.map((conductor: any) => (
                  <option key={conductor.id} value={conductor.id}>{conductor.codigo} — {conductor.nombre}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Vehículo (opcional)</span>
              <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('vehiculoId')}>
                <option value="">Seleccionar vehículo</option>
                {vehiculosQuery.data.map((vehiculo: any) => (
                  <option key={vehiculo.id} value={vehiculo.id}>{vehiculo.vehiculoID} — {vehiculo.placa}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-white hover:bg-brand-700">
              Registrar novedad
            </button>
          </form>
        </div>
      </div>
    </Shell>
  );
}
