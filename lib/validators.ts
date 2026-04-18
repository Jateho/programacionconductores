import { z } from 'zod';

export const conductorSchema = z.object({
  codigo: z.string().min(3, 'Código requerido'),
  nombre: z.string().min(3, 'Nombre requerido'),
  cedula: z.string().min(6, 'Cédula requerida'),
  telefono: z.string().min(7, 'Teléfono requerido'),
  tipo: z.enum(['CONTRATISTA', 'VINCULADO']),
  estado: z.enum(['ACTIVO', 'INACTIVO']),
});

export const vehiculoSchema = z.object({
  vehiculoID: z.string().min(2, 'ID de vehículo requerido'),
  placa: z.string().min(3, 'Placa requerida'),
  tipo: z.string().min(2, 'Tipo requerido'),
  capacidad: z.number().min(1, 'Capacidad requerida'),
  estado: z.enum(['DISPONIBLE', 'EN_RUTA', 'EN_TALLER']),
  secretaria: z.string().min(2, 'Secretaría requerida'),
});

export const turnoSchema = z.object({
  conductorId: z.string().min(1, 'Conductor requerido'),
  vehiculoId: z.string().min(1, 'Vehículo requerido'),
  fecha: z.string().min(1, 'Fecha requerida'),
  horaInicio: z.string().min(1, 'Hora inicio requerida'),
  horaFin: z.string().min(1, 'Hora fin requerida'),
});

export const novedadSchema = z.object({
  tipo: z.enum([
    'INCAPACIDAD',
    'VACACIONES',
    'DISPONIBLE',
    'TALLER_ASEGURADORA',
    'TALLER_MECANICO',
  ]),
  descripcion: z.string().min(5, 'Descripción requerida'),
  fechaInicio: z.string().min(1, 'Fecha inicio requerida'),
  fechaFin: z.string().min(1, 'Fecha fin requerida'),
  conductorId: z.string().optional(),
  vehiculoId: z.string().optional(),
});
