import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { conductorSchema } from '@/lib/validators';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const conductor = await prisma.conductor.findUnique({ where: { id: params.id } });
  if (!conductor) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json(conductor);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const payload = await request.json();
  const data = conductorSchema.parse(payload);
  const conductor = await prisma.conductor.update({ where: { id: params.id }, data });
  return NextResponse.json(conductor);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await prisma.conductor.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
