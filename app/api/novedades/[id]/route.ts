import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { novedadSchema } from '@/lib/validators';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const payload = await request.json();
  const data = novedadSchema.parse(payload);
  const novedad = await prisma.novedad.update({
    where: { id: params.id },
    data: {
      ...data,
      fechaInicio: new Date(data.fechaInicio),
      fechaFin: new Date(data.fechaFin),
    },
  });
  return NextResponse.json(novedad);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  await prisma.novedad.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
