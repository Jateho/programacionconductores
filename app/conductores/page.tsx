'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Shell } from '@/components/Shell';
import { Loader } from '@/components/Loader';
import { conductorSchema } from '@/lib/validators';
import { z } from 'zod';

const formSchema = conductorSchema;

type FormData = z.infer<typeof formSchema>;

export default function ConductoresPage() {
  const { data, isLoading, refetch } = useQuery(['conductores'], () => fetch('/api/conductores').then((res) => res.json()));
  const mutation = useMutation((payload: FormData) => fetch('/api/conductores', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  }), {
    onSuccess: async () => { toast.success('Conductor creado'); await refetch(); reset(); },
    onError: () => toast.error('No se pudo crear el conductor'),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const onSubmit = (values: FormData) => mutation.mutate(values);

  if (isLoading) return <Shell><Loader /></Shell>;

  return (
    <Shell>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_0.85fr]">
        <div className="card p-6">
          <h2 className="mb-4 text-xl font-semibold">Conductores</h2>
          <div className="space-y-4">
            {data.map((conductor: any) => (
              <div key={conductor.id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{conductor.nombre}</p>
                    <p className="text-sm text-slate-500">{conductor.codigo} • {conductor.tipo}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{conductor.estado}</span>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-slate-600">
                  <p>Cédula: {conductor.cedula}</p>
                  <p>Teléfono: {conductor.telefono}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="mb-4 text-xl font-semibold">Nuevo conductor</h2>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Código</span>
              <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('codigo')} />
              <p className="mt-1 text-xs text-red-600">{errors.codigo?.message}</p>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Nombre completo</span>
              <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('nombre')} />
              <p className="mt-1 text-xs text-red-600">{errors.nombre?.message}</p>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Cédula</span>
              <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('cedula')} />
              <p className="mt-1 text-xs text-red-600">{errors.cedula?.message}</p>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Teléfono</span>
              <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('telefono')} />
              <p className="mt-1 text-xs text-red-600">{errors.telefono?.message}</p>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Tipo</span>
                <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('tipo')}>
                  <option value="CONTRATISTA">Contratista</option>
                  <option value="VINCULADO">Vinculado</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Estado</span>
                <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('estado')}>
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
              </label>
            </div>
            <button type="submit" className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-white hover:bg-brand-700">
              Agregar conductor
            </button>
          </form>
        </div>
      </div>
    </Shell>
  );
}
