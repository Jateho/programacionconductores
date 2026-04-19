'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@fleet.local');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    setLoading(false);

    if (result?.error) {
      toast.error('Credenciales inválidas');
      return;
    }
    toast.success('Inicio de sesión correcto');
    router.push('/dashboard');
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-100 px-4 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-brand-500 to-transparent opacity-30" />
      <div className="relative mx-auto w-full max-w-2xl rounded-[40px] border border-slate-200 bg-white/95 p-10 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-600 text-2xl font-bold text-white shadow-lg">FM</div>
          <h1 className="text-3xl font-semibold text-slate-950">FleetManager Enterprise</h1>
          <p className="mt-2 text-sm text-slate-500">Accede al panel de administración</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Correo
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Contraseña
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </main>
  );
}
