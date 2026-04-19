import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { conductorSchema } from '@/lib/validators';

export async function GET() {
  const conductores = await prisma.conductor.findMany({ orderBy: { codigo: 'asc' } });
  return NextResponse.json(conductores);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const imagenFile = formData.get('imagen') as File | null;

  const payload = {
    codigo: String(formData.get('codigo') || ''),
    nombre: String(formData.get('nombre') || ''),
    cedula: String(formData.get('cedula') || ''),
    telefono: String(formData.get('telefono') || ''),
    tipo: String(formData.get('tipo') || ''),
    estado: String(formData.get('estado') || ''),
  };

  const data = conductorSchema.parse(payload);

  let imagenUrl: string | undefined;
  if (imagenFile && typeof imagenFile.arrayBuffer === 'function') {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.promises.mkdir(uploadsDir, { recursive: true });
    const filename = `${Date.now()}-${imagenFile.name}`;
    const filePath = path.join(uploadsDir, filename);
    const buffer = Buffer.from(await imagenFile.arrayBuffer());
    await fs.promises.writeFile(filePath, buffer);
    imagenUrl = `/uploads/${filename}`;
  }

  const conductor = await prisma.conductor.create({
    data: {
      ...data,
      imagenUrl,
    },
  });

  return NextResponse.json(conductor, { status: 201 });
}
