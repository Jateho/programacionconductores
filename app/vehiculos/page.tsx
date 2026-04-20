'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Shell } from '@/components/Shell';
import { Loader } from '@/components/Loader';
import { Card } from '@/components/Card';
import { vehiculoSchema } from '@/lib/validators';
import { z } from 'zod';

const formSchema = vehiculoSchema;

type FormData = z.infer<typeof formSchema>;

export default function VehiculosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    }
  }, [router, status]);

  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: () => fetch('/api/vehiculos').then((res) => res.json()),
    enabled: status === 'authenticated',
  });

  if (status === 'loading' || status === 'unauthenticated') return <Shell><Loader /></Shell>;
  if (!session) return <Shell><Loader /></Shell>;

  const mutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const formData = new FormData();
      formData.append('vehiculoID', payload.vehiculoID);
      formData.append('placa', payload.placa);
      formData.append('tipo', payload.tipo);
      formData.append('capacidad', String(payload.capacidad));
      formData.append('secretaria', payload.secretaria);
      formData.append('estado', payload.estado);
      if (payload.imagen?.[0]) {
        formData.append('imagen', payload.imagen[0]);
      }
      return fetch('/api/vehiculos', {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: async () => {
      toast.success('Vehículo creado');
      await refetch();
      reset();
    },
    onError: () => toast.error('No se pudo crear el vehículo'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/vehiculos/${id}`, { method: 'DELETE' }),
    onSuccess: async () => {
      toast.success('Vehículo eliminado');
      await refetch();
    },
    onError: () => toast.error('No se pudo eliminar el vehículo'),
  });

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(formSchema) });
  const imagenFile = watch('imagen');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string>();

  const filteredData = (data ?? []).filter((vehiculo: any) =>
    vehiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.vehiculoID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Vehículos</p>
            <h2 className="mt-4 text-3xl font-semibold">Flota en tiempo real</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Controla los vehículos de la empresa con fotos e información detallada. Agrega nuevas unidades y mantén el inventario actualizado de manera visual.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Vehículos disponibles</p>
                <p className="mt-3 text-3xl font-semibold">{data.filter((item: any) => item.estado === 'DISPONIBLE').length}</p>
              </div>
              <div className="rounded-3xl bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Total de vehículos</p>
                <p className="mt-3 text-3xl font-semibold">{data.length}</p>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="overflow-hidden rounded-[32px] bg-white shadow-xl">
              <img src="/images/vehicle-sample.svg" alt="Ejemplo vehículo" className="h-72 w-full object-cover" />
            </div>
            <div className="rounded-[32px] bg-white p-6 shadow-xl">
              <p className="text-sm font-medium text-slate-500">Inventario visual</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">Fotos y datos de cada unidad</p>
              <p className="mt-3 text-sm text-slate-600">
                Usa la imagen del vehículo para identificar cada unidad rápidamente y evita errores de seguimiento manual.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_0.95fr]">
          <Card title="Vehículos registrados" subtitle="Flota disponible">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-slate-500">Resultados encontrados: {filteredData.length}</p>
              <input
                type="text"
                placeholder="Buscar vehículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
              />
            </div>
            <div className="mt-6 space-y-4">
              {filteredData.map((vehiculo: any) => (
                <div key={vehiculo.id} className="grid gap-4 rounded-[28px] border border-slate-200 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
                  <div className="h-24 w-24 overflow-hidden rounded-3xl bg-slate-100">
                    <img
                      src={vehiculo.imagenUrl || '/images/vehicle-sample.svg'}
                      alt={vehiculo.placa}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-semibold text-slate-900">{vehiculo.placa}</p>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{vehiculo.estado}</span>
                    </div>
                    <p className="text-sm text-slate-500">{vehiculo.vehiculoID} · {vehiculo.tipo}</p>
                    <p className="text-sm text-slate-500">Secretaría {vehiculo.secretaria} · Capacidad {vehiculo.capacidad}</p>
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-lg bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700">Editar</button>
                      <button onClick={() => deleteMutation.mutate(vehiculo.id)} className="rounded-lg bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700">Eliminar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Agregar vehículo" subtitle="Nueva unidad">
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

              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>

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

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Foto del vehículo</span>
                <div className="mt-2 rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Vista previa vehículo" className="mx-auto h-44 w-full max-w-sm rounded-3xl object-cover" />
                  ) : (
                    <div className="space-y-3">
                      <img src="/images/vehicle-sample.svg" alt="Ejemplo vehículo" className="mx-auto h-40 w-full max-w-sm rounded-3xl object-cover" />
                      <p className="text-sm text-slate-500">Seleccione un archivo JPG o PNG</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="mt-4 w-full cursor-pointer rounded-2xl border border-slate-200 bg-white px-3 py-2" {...register('imagen')} />
                </div>
                <p className="mt-1 text-xs text-red-600">{typeof errors.imagen?.message === 'string' ? errors.imagen.message : ''}</p>
              </label>

              <button type="submit" className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-white transition hover:bg-brand-700">
                Agregar vehículo
              </button>
            </form>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
