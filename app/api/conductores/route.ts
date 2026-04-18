import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { conductorSchema } from '@/lib/validators';

export async function GET() {
  const conductores = await prisma.conductor.findMany({ orderBy: { codigo: 'asc' } });
  return NextResponse.json(conductores);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const data = conductorSchema.parse(payload);
  const conductor = await prisma.conductor.create({ data });
  return NextResponse.json(conductor, { status: 201 });
}
