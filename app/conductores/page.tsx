'use client';

import { useEffect, useState } from 'react';
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
  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ['conductores'],
    queryFn: () => fetch('/api/conductores').then((res) => res.json()),
  });

  const mutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const formData = new FormData();
      formData.append('codigo', payload.codigo);
      formData.append('nombre', payload.nombre);
      formData.append('cedula', payload.cedula);
      formData.append('telefono', payload.telefono);
      formData.append('tipo', payload.tipo);
      formData.append('estado', payload.estado);
      if (payload.imagen?.[0]) {
        formData.append('imagen', payload.imagen[0]);
      }
      return fetch('/api/conductores', {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: async () => {
      toast.success('Conductor creado');
      await refetch();
      reset();
    },
    onError: () => toast.error('No se pudo crear el conductor'),
  });

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(formSchema) });
  const imagenFile = watch('imagen');
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!imagenFile?.[0]) {
      setPreviewUrl(undefined);
      return;
    }

    const file = imagenFile[0] as File;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [imagenFile]);

  const onSubmit = (values: FormData) => mutation.mutate(values);

  if (isLoading) return <Shell><Loader /></Shell>;

  return (
    <Shell>
      <div className="space-y-6">
        <section className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Conductores</p>
            <h2 className="mt-4 text-3xl font-semibold">Gestiona tu flota de conductores</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Agrega nuevos conductores, sube su foto y mantén un registro visual actualizado de la flota. El panel está listo para mostrar tarjetas y datos al instante.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Conductores activos</p>
                <p className="mt-3 text-3xl font-semibold">{data.filter((item: any) => item.estado === 'ACTIVO').length}</p>
              </div>
              <div className="rounded-3xl bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Total de conductores</p>
                <p className="mt-3 text-3xl font-semibold">{data.length}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="overflow-hidden rounded-[32px] bg-white shadow-xl">
              <img src="/images/driver-sample.svg" alt="Ejemplo conductor" className="h-72 w-full object-cover" />
            </div>
            <div className="rounded-[32px] bg-white p-6 shadow-xl">
              <p className="text-sm font-medium text-slate-500">Lista de conductores</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">Ejemplos y fotos</p>
              <p className="mt-3 text-sm text-slate-600">
                Cada conductor puede tener una imagen asociada y estado visible en el panel. Sube fotos reales para mejorar el control visual.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_0.95fr]">
          <div className="space-y-4 rounded-[32px] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Conductores registrados</h2>
            <div className="space-y-4">
              {(data ?? []).map((conductor: any) => (
                <div key={conductor.id} className="grid gap-4 rounded-[28px] border border-slate-200 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
                  <div className="h-24 w-24 overflow-hidden rounded-3xl bg-slate-100">
                    <img
                      src={conductor.imagenUrl || '/images/driver-sample.svg'}
                      alt={conductor.nombre}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-semibold text-slate-900">{conductor.nombre}</p>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{conductor.estado}</span>
                    </div>
                    <p className="text-sm text-slate-500">Código {conductor.codigo} · {conductor.tipo}</p>
                    <p className="text-sm text-slate-500">Cédula {conductor.cedula} · {conductor.telefono}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Agregar conductor</h2>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Código</span>
                  <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('codigo')} />
                  <p className="mt-1 text-xs text-red-600">{errors.codigo?.message}</p>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Tipo</span>
                  <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('tipo')}>
                    <option value="CONTRATISTA">Contratista</option>
                    <option value="VINCULADO">Vinculado</option>
                  </select>
                  <p className="mt-1 text-xs text-red-600">{errors.tipo?.message}</p>
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Nombre completo</span>
                <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('nombre')} />
                <p className="mt-1 text-xs text-red-600">{errors.nombre?.message}</p>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Estado</span>
                <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" {...register('estado')}>
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
                <p className="mt-1 text-xs text-red-600">{errors.estado?.message}</p>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Imagen del conductor</span>
                <div className="mt-2 rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Vista previa conductor" className="mx-auto h-44 w-full max-w-sm rounded-3xl object-cover" />
                  ) : (
                    <div className="space-y-3">
                      <img src="/images/driver-sample.svg" alt="Ejemplo conductor" className="mx-auto h-40 w-full max-w-sm rounded-3xl object-cover" />
                      <p className="text-sm text-slate-500">Seleccione un archivo JPG o PNG</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="mt-4 w-full cursor-pointer rounded-2xl border border-slate-200 bg-white px-3 py-2" {...register('imagen')} />
                </div>
                <p className="mt-1 text-xs text-red-600">{typeof errors.imagen?.message === 'string' ? errors.imagen.message : ''}</p>
              </label>

              <button type="submit" className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-white transition hover:bg-brand-700">
                Agregar conductor
              </button>
            </form>
          </div>
        </div>
      </div>
    </Shell>
  );
}
