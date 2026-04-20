import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'FleetManager Enterprise',
  description: 'Gestión de conductores, vehículos y turnos.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-100" style={{ margin: 0, backgroundColor: '#eff5ff', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#111827' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
