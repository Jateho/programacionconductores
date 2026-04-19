import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { vehiculoSchema } from '@/lib/validators';

export async function GET() {
  const vehiculos = await prisma.vehiculo.findMany({ orderBy: { vehiculoID: 'asc' } });
  return NextResponse.json(vehiculos);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const imagenFile = formData.get('imagen') as File | null;

  const payload = {
    vehiculoID: String(formData.get('vehiculoID') || ''),
    placa: String(formData.get('placa') || ''),
    tipo: String(formData.get('tipo') || ''),
    capacidad: Number(formData.get('capacidad') || 0),
    secretaria: String(formData.get('secretaria') || ''),
    estado: String(formData.get('estado') || ''),
  };

  const data = vehiculoSchema.parse(payload);

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

  const vehiculo = await prisma.vehiculo.create({
    data: {
      ...data,
      imagenUrl,
    },
  });

  return NextResponse.json(vehiculo, { status: 201 });
}
