import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function hoursFromShifts(shifts: Array<{ horaInicio: string; horaFin: string }>) {
  return shifts.reduce((total, turno) => {
    const [startH, startM] = turno.horaInicio.split(':').map(Number);
    const [endH, endM] = turno.horaFin.split(':').map(Number);
    return total + (endH * 60 + endM - (startH * 60 + startM));
  }, 0) / 60;
}

function daysFromNovedades(novedades: Array<{ fechaInicio: Date; fechaFin: Date }>) {
  return novedades.reduce((total, novedad) => {
    const diffTime = Math.abs(novedad.fechaFin.getTime() - novedad.fechaInicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return total + diffDays;
  }, 0);
}

export async function GET() {
  const conductores = await prisma.conductor.findMany({
    include: {
      turnos: true,
      novedades: true,
    },
  });

  const vehiculos = await prisma.vehiculo.findMany({
    include: {
      turnos: true,
      novedades: true,
    },
  });

  const conductorReport = conductores.map((conductor) => {
    const horasTrabajadas = hoursFromShifts(conductor.turnos);
    const horasIncapacidad = daysFromNovedades(conductor.novedades.filter((n) => n.tipo === 'INCAPACIDAD'));
    const horasVacaciones = daysFromNovedades(conductor.novedades.filter((n) => n.tipo === 'VACACIONES'));
    return {
      id: conductor.id,
      codigo: conductor.codigo,
      nombre: conductor.nombre,
      horasTrabajadas,
      horasIncapacidad,
      horasVacaciones,
      horasDisponibles: Math.max(0, 40 - horasTrabajadas),
    };
  });

  const vehiculoReport = vehiculos.map((vehiculo) => {
    const horasTrabajadas = hoursFromShifts(vehiculo.turnos);
    const horasTallerAseguradora = daysFromNovedades(vehiculo.novedades.filter((n) => n.tipo === 'TALLER_ASEGURADORA'));
    const horasTallerMecanico = daysFromNovedades(vehiculo.novedades.filter((n) => n.tipo === 'TALLER_MECANICO'));
    return {
      id: vehiculo.id,
      vehiculoID: vehiculo.vehiculoID,
      placa: vehiculo.placa,
      horasTrabajadas,
      horasTallerAseguradora,
      horasTallerMecanico,
      horasDisponibles: Math.max(0, 40 - horasTrabajadas - horasTallerAseguradora - horasTallerMecanico),
    };
  });

  return NextResponse.json({ conductorReport, vehiculoReport });
}
