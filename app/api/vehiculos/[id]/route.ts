import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { vehiculoSchema } from '@/lib/validators';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const vehiculo = await prisma.vehiculo.findUnique({ where: { id: params.id } });
  if (!vehiculo) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json(vehiculo);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const payload = await request.json();
  const data = vehiculoSchema.parse(payload);
  const vehiculo = await prisma.vehiculo.update({ where: { id: params.id }, data });
  return NextResponse.json(vehiculo);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await prisma.vehiculo.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
