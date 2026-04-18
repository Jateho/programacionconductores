import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { vehiculoSchema } from '@/lib/validators';

export async function GET() {
  const vehiculos = await prisma.vehiculo.findMany({ orderBy: { vehiculoID: 'asc' } });
  return NextResponse.json(vehiculos);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const data = vehiculoSchema.parse(payload);
  const vehiculo = await prisma.vehiculo.create({ data });
  return NextResponse.json(vehiculo, { status: 201 });
}
