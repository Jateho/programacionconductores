import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { turnoSchema } from '@/lib/validators';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const payload = await request.json();
  const data = turnoSchema.parse(payload);
  const fecha = new Date(data.fecha);
  const turno = await prisma.turno.update({ where: { id: params.id }, data: { ...data, fecha } });
  return NextResponse.json(turno);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await prisma.turno.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
