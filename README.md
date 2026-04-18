# FleetManager Enterprise

Aplicación web de gestión de conductores y vehículos construida con Next.js (App Router), TypeScript, TailwindCSS, Prisma y PostgreSQL.

## Características

- Dashboard operativo con métricas clave.
- CRUD completo de conductores y vehículos.
- Gestión de turnos con validación de solapamientos.
- Registro de novedades por conductor o vehículo.
- Reportes por conductor y vehículo con exportación básica.
- Autenticación con NextAuth (credenciales).
- Estado con React Query.

## Tecnologías

- Next.js App Router
- TypeScript
- TailwindCSS
- Prisma + PostgreSQL
- NextAuth
- React Query
- React Hook Form + Zod
- Recharts

## Instalación

1. Copia `.env.example` a `.env` y actualiza las variables.
2. Instala dependencias:

```bash
npm install
```

3. Genera Prisma y ejecuta migraciones:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

4. Inicia la aplicación:

```bash
npm run dev
```

## Usuario de prueba

- Email: `admin@fleet.local`
- Contraseña: `Admin123!`

## Estructura

- `/app` - Rutas de la aplicación.
- `/components` - UI reutilizable.
- `/lib` - Prisma, autenticación y utilidades.
- `/hooks` - Query hooks.
- `/prisma` - Esquema y seed.

## Notas

- Compatible con Vercel y PostgreSQL (Neon, Supabase, Railway).
- Cambia `NEXTAUTH_SECRET` por un valor seguro en producción.
- Ajusta las políticas de sesión y host según tu despliegue.
