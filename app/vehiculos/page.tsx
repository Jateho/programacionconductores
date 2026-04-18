'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Shell } from '@/components/Shell';
import { Loader } from '@/components/Loader';
import { vehiculoSchema } from '@/lib/validators';
import { z } from 'zod';

const formSchema = vehiculoSchema;

type FormData = z.infer<typeof formSchema>;

export default function VehiculosPage() {
  const { data, isLoading, refetch } = useQuery(['vehiculos'], () => fetch('/api/vehiculos').then((res) => res.json()));
  const mutation = useMutation((payload: FormData) => fetch('/api/vehiculos', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  }), {
    onSuccess: async () => { toast.success('Vehículo creado'); await refetch(); reset(); },
    onError: () => toast.error('No se pudo crear el vehículo'),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const onSubmit = (values: FormData) => mutation.mutate(values);

  if (isLoading) return <Shell><Loader /></Shell>;

  return (
    <Shell>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_0.85fr]">
        <div className="card p-6">
          <h2 className="mb-4 text-xl font-semibold">Vehículos</h2>
          <div className="space-y-4">
            {data.map((vehiculo: any) => (
              <div key={vehiculo.id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{vehiculo.placa}</p>
                    <p className="text-sm text-slate-500">{vehiculo.vehiculoID} • {vehiculo.tipo}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{vehiculo.estado}</span>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-slate-600">
                  <p>Secretaría: {vehiculo.secretaria}</p>
                  <p>Capacidad: {vehiculo.capacidad}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="mb-4 text-xl font-semibold">Nuevo vehículo</h2>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">ID de vehículo</span>
              <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('vehiculoID')} />
              <p className="mt-1 text-xs text-red-600">{errors.vehiculoID?.message}</p>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Placa</span>
              <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('placa')} />
              <p className="mt-1 text-xs text-red-600">{errors.placa?.message}</p>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Tipo</span>
              <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('tipo')} />
              <p className="mt-1 text-xs text-red-600">{errors.tipo?.message}</p>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Capacidad</span>
              <input type="number" className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('capacidad', { valueAsNumber: true })} />
              <p className="mt-1 text-xs text-red-600">{errors.capacidad?.message}</p>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Secretaría</span>
              <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('secretaria')} />
              <p className="mt-1 text-xs text-red-600">{errors.secretaria?.message}</p>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Estado</span>
              <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('estado')}>
                <option value="DISPONIBLE">Disponible</option>
                <option value="EN_RUTA">En ruta</option>
                <option value="EN_TALLER">En taller</option>
              </select>
            </label>
            <button type="submit" className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-white hover:bg-brand-700">
              Agregar vehículo
            </button>
          </form>
        </div>
      </div>
    </Shell>
  );
}
