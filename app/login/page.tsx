'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;

    // TODO: Replace prototype localStorage login with Supabase Auth.
    // TODO: Add email login magic link flow and onboarding completion state.
    window.localStorage.setItem('aimUserEmail', email.trim());
    router.push('/onboarding');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#03030b] px-6 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center_top,rgba(139,92,246,0.18),transparent_30%),radial-gradient(circle_at_bottom,rgba(37,99,235,0.08),transparent_42%)]" />
      <section className="relative w-full max-w-[520px] rounded-[2rem] border border-violet-300/15 bg-[#080713]/95 p-8 text-center shadow-[0_30px_120px_rgba(109,40,217,0.24)] backdrop-blur-xl">
        <div className="mx-auto flex justify-center">
          <Image src="/alex-logo.svg" alt="Alex by AIM" width={260} height={96} priority className="h-auto w-[220px]" />
        </div>
        <h1 className="mt-8 text-4xl font-semibold text-white">Your AI music manager.</h1>
        <p className="mt-4 text-sm leading-6 text-[#B7C8DA]">
          Sign in to start building your artist profile with Alex.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.28em] text-violet-200">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="artist@example.com"
              className="mt-3 w-full rounded-[1.25rem] border border-white/10 bg-black/45 px-4 py-4 text-sm text-white outline-none transition placeholder:text-[#7f9fbe] focus:border-violet-300/45 focus:ring-2 focus:ring-violet-500/15"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-br from-violet-400 via-indigo-500 to-cyan-300 px-5 py-4 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Continue
          </button>
        </form>
      </section>
    </main>
  );
}
