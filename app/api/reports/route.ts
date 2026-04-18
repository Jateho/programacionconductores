import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function hoursFromShifts(shifts: Array<{ horaInicio: string; horaFin: string }>) {
  return shifts.reduce((total, turno) => {
    const [startH, startM] = turno.horaInicio.split(':').map(Number);
    const [endH, endM] = turno.horaFin.split(':').map(Number);
    return total + (endH * 60 + endM - (startH * 60 + startM));
  }, 0) / 60;
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
    const horasIncapacidad = hoursFromShifts(conductor.novedades.filter((n) => n.tipo === 'INCAPACIDAD'));
    const horasVacaciones = hoursFromShifts(conductor.novedades.filter((n) => n.tipo === 'VACACIONES'));
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
    const horasTallerAseguradora = hoursFromShifts(vehiculo.novedades.filter((n) => n.tipo === 'TALLER_ASEGURADORA'));
    const horasTallerMecanico = hoursFromShifts(vehiculo.novedades.filter((n) => n.tipo === 'TALLER_MECANICO'));
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
