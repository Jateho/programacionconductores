import { hash } from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const password = await hash('Admin123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@fleet.local' },
    update: {},
    create: {
      email: 'admin@fleet.local',
      name: 'Administrador Fleet',
      password,
      role: 'ADMIN',
    },
  });

  const vehicles: Array<{
    vehiculoID: string;
    placa: string;
    tipo: string;
    capacidad: number;
    estado: 'DISPONIBLE' | 'EN_RUTA' | 'EN_TALLER';
    secretaria: string;
  }> = Array.from({ length: 17 }, (_, index) => {
    const id = String(index + 1).padStart(3, '0');
    return {
      vehiculoID: `V${id}`,
      placa: `ABC-${100 + index}`,
      tipo: index % 3 === 0 ? 'Van Ejecutiva' : index % 3 === 1 ? 'Bus Articulado' : 'Van Médica',
      capacidad: index % 3 === 0 ? 18 : index % 3 === 1 ? 160 : 12,
      estado: index % 3 === 0 ? 'DISPONIBLE' : index % 3 === 1 ? 'EN_RUTA' : 'EN_TALLER',
      secretaria: index % 2 === 0 ? 'Movilidad Urbana' : 'Transporte Masivo',
    };
  });

  await prisma.vehiculo.createMany({ data: vehicles });

  await prisma.conductor.createMany({ data: [
    { codigo: 'C001', nombre: 'Carlos Mendoza', cedula: '1.234.567.890', telefono: '312 456 7890', tipo: 'VINCULADO', estado: 'ACTIVO' },
    { codigo: 'C002', nombre: 'Sandra Castro', cedula: '2.345.678.901', telefono: '300 112 3344', tipo: 'CONTRATISTA', estado: 'INACTIVO' },
    { codigo: 'C003', nombre: 'Juan Gómez', cedula: '1.011.002.333', telefono: '315 777 8899', tipo: 'VINCULADO', estado: 'ACTIVO' },
  ] as const });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
