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
import { novedadSchema } from '@/lib/validators';
import { z } from 'zod';

const formSchema = novedadSchema;

type FormData = z.infer<typeof formSchema>;

export default function NovedadesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    }
  }, [router, status]);

  const conductoresQuery = useQuery({ queryKey: ['conductores'], queryFn: () => fetch('/api/conductores').then((res) => res.json()), enabled: status === 'authenticated' });
  const vehiculosQuery = useQuery({ queryKey: ['vehiculos'], queryFn: () => fetch('/api/vehiculos').then((res) => res.json()), enabled: status === 'authenticated' });
  const novedadesQuery = useQuery({ queryKey: ['novedades'], queryFn: () => fetch('/api/novedades').then((res) => res.json()), enabled: status === 'authenticated' });

  if (status === 'loading' || status === 'unauthenticated') return <Shell><Loader /></Shell>;
  if (!session) return <Shell><Loader /></Shell>;

  const mutation = useMutation({
    mutationFn: (payload: FormData) => fetch('/api/novedades', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    }),
    onSuccess: async () => { toast.success('Novedad registrada'); await novedadesQuery.refetch(); reset(); },
    onError: () => toast.error('No se pudo registrar la novedad'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/novedades/${id}`, { method: 'DELETE' }),
    onSuccess: async () => {
      toast.success('Novedad eliminada');
      await novedadesQuery.refetch();
    },
    onError: () => toast.error('No se pudo eliminar la novedad'),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(formSchema) });
  const [searchTerm, setSearchTerm] = useState('');
  const onSubmit = (values: FormData) => mutation.mutate(values);

  const filteredNovedades = novedadesQuery.data?.filter((item: any) =>
    item.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.conductor?.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vehiculo?.vehiculoID.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (conductoresQuery.isLoading || vehiculosQuery.isLoading || novedadesQuery.isLoading) {
    return <Shell><Loader /></Shell>;
  }

  const totalNovedades = novedadesQuery.data.length;
  const totalConductores = conductoresQuery.data.length;
  const totalVehiculos = vehiculosQuery.data.length;

  return (
    <Shell>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card title="Novedades" subtitle="Eventos y estados recientes">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">Resultados: {filteredNovedades.length}</p>
              <input
                type="text"
                placeholder="Buscar novedades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm"
              />
            </div>
            <div className="mt-6 space-y-4">
              {filteredNovedades.map((item: any) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{item.tipo.replace('_', ' ')}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.descripcion}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {item.conductor?.codigo ?? item.vehiculo?.vehiculoID ?? 'General'}
                      </span>
                      <button onClick={() => deleteMutation.mutate(item.id)} className="rounded-lg bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700">Eliminar</button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-1 text-sm text-slate-600">
                    <p>Inicio: {new Date(item.fechaInicio).toLocaleDateString()}</p>
                    <p>Fin: {new Date(item.fechaFin).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Resumen" subtitle="Indicadores de operaciones">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Novedades</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{totalNovedades}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Conductores</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{totalConductores}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Vehículos</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{totalVehiculos}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card title="Registrar novedad" subtitle="Agrega un evento nuevo">
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
        </Card>
      </div>
    </Shell>
  );
}
