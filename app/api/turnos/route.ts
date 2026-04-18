import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { turnoSchema } from '@/lib/validators';

function parseTime(time: string) {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const conductorId = url.searchParams.get('conductorId');
  const vehiculoId = url.searchParams.get('vehiculoId');
  const where: any = {};
  if (conductorId) where.conductorId = conductorId;
  if (vehiculoId) where.vehiculoId = vehiculoId;
  const turnos = await prisma.turno.findMany({
    where,
    include: { conductor: true, vehiculo: true },
    orderBy: { fecha: 'asc' },
  });
  return NextResponse.json(turnos);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const data = turnoSchema.parse(payload);
  const fecha = new Date(data.fecha);
  const inicio = parseTime(data.horaInicio);
  const fin = parseTime(data.horaFin);

  const overlap = await prisma.turno.findFirst({
    where: {
      fecha,
      OR: [
        {
          conductorId: data.conductorId,
          AND: [{ horaInicio: { lte: data.horaFin } }, { horaFin: { gte: data.horaInicio } }],
        },
        {
          vehiculoId: data.vehiculoId,
          AND: [{ horaInicio: { lte: data.horaFin } }, { horaFin: { gte: data.horaInicio } }],
        },
      ],
    },
  });

  if (overlap) {
    return NextResponse.json({ error: 'Turno solapado para conductor o vehículo' }, { status: 400 });
  }

  const turno = await prisma.turno.create({ data: { ...data, fecha } });
  return NextResponse.json(turno, { status: 201 });
}
