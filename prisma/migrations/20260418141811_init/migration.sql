-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "ConductorTipo" AS ENUM ('CONTRATISTA', 'VINCULADO');

-- CreateEnum
CREATE TYPE "ConductorEstado" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "VehiculoEstado" AS ENUM ('DISPONIBLE', 'EN_RUTA', 'EN_TALLER');

-- CreateEnum
CREATE TYPE "NovedadTipo" AS ENUM ('INCAPACIDAD', 'VACACIONES', 'DISPONIBLE', 'TALLER_ASEGURADORA', 'TALLER_MECANICO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conductor" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "tipo" "ConductorTipo" NOT NULL,
    "estado" "ConductorEstado" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conductor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehiculo" (
    "id" TEXT NOT NULL,
    "vehiculoID" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "estado" "VehiculoEstado" NOT NULL,
    "secretaria" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turno" (
    "id" TEXT NOT NULL,
    "conductorId" TEXT NOT NULL,
    "vehiculoId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Novedad" (
    "id" TEXT NOT NULL,
    "tipo" "NovedadTipo" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "conductorId" TEXT,
    "vehiculoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Novedad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Conductor_codigo_key" ON "Conductor"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_vehiculoID_key" ON "Vehiculo"("vehiculoID");

-- CreateIndex
CREATE INDEX "Turno_conductorId_idx" ON "Turno"("conductorId");

-- CreateIndex
CREATE INDEX "Turno_vehiculoId_idx" ON "Turno"("vehiculoId");

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_conductorId_fkey" FOREIGN KEY ("conductorId") REFERENCES "Conductor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Novedad" ADD CONSTRAINT "Novedad_conductorId_fkey" FOREIGN KEY ("conductorId") REFERENCES "Conductor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Novedad" ADD CONSTRAINT "Novedad_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
