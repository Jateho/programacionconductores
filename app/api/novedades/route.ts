import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { novedadSchema } from '@/lib/validators';

export async function GET() {
  const novedades = await prisma.novedad.findMany({
    include: { conductor: true, vehiculo: true },
    orderBy: { fechaInicio: 'desc' },
  });
  return NextResponse.json(novedades);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const data = novedadSchema.parse(payload);
  const novedad = await prisma.novedad.create({
    data: {
      ...data,
      fechaInicio: new Date(data.fechaInicio),
      fechaFin: new Date(data.fechaFin),
    },
  });
  return NextResponse.json(novedad, { status: 201 });
}
