import Link from 'next/link';
import type { ReactNode } from 'react';

const navItems = [
  { label: 'Music', icon: '♪', href: '/music' },
  { label: 'Artwork', icon: '▧', href: '/artwork' },
  { label: 'Goals', icon: '◎', href: '/goals' },
  { label: 'Release', icon: '↗', href: '/release' },
  { label: 'Settings', icon: '⚙', href: '/settings' },
];

export default function SectionLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center_top,rgba(14,132,255,0.14),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,118,255,0.06),transparent_40%)]" />
      <div className="absolute top-8 right-8">
        <Link href="/manager" className="relative block w-16 h-16 rounded-full bg-gradient-to-br from-[#0ea5ff]/75 via-[#339cff]/70 to-[#0a72ff]/40 p-[2px] shadow-[0_0_30px_rgba(14,165,233,0.35)]">
          <div className="relative h-full w-full rounded-full bg-slate-950 overflow-hidden">
            <div className="absolute left-1/2 top-3 h-7 w-7 -translate-x-1/2 rounded-full bg-slate-700" />
            <div className="absolute left-1/2 bottom-3 h-4 w-8 -translate-x-1/2 rounded-full bg-slate-700" />
            <div className="absolute left-1/2 top-[56%] h-1.5 w-8 -translate-x-1/2 rounded-full bg-[#0ea5ff]/20" />
          </div>
        </Link>
      </div>

      <aside className="fixed left-0 top-0 flex h-screen w-44 flex-col items-center justify-start border-r border-white/10 bg-black/80 pt-8 px-4 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-8 w-full">
          <Link href="/" className="block w-full text-center">
            <img src="/aim-logo-v2.svg" alt="AIM" className="mx-auto w-[145px] h-auto object-contain mb-8" />
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-2 text-sm text-[#AED7FF] transition hover:text-white"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-3xl border border-[#0ea5e9]/15 bg-black/40 text-[#0ea5e9] text-3xl shadow-[0_0_20px_rgba(14,165,233,0.15)]">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-8 pl-48">
        <div className="w-full max-w-[1080px] text-left">
          <div className="mb-10 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-5xl font-semibold tracking-tight">{title}</h1>
              <span className="rounded-full bg-[#0ea5e9]/10 px-3 py-1 text-sm font-medium text-[#AED7FF]">
                Prototype
              </span>
            </div>
            <p className="max-w-2xl text-lg text-[#B7C8DA]">{subtitle}</p>
            <Link href="/" className="text-sm text-[#AED7FF] transition hover:text-white">
              Back to home
            </Link>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
