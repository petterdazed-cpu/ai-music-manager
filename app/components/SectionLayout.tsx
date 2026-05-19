import Link from 'next/link';
import type { ReactNode } from 'react';

const navItems = [
  { label: 'Home', icon: '⌂', href: '/' },
  { label: 'Studio', icon: '≋', href: '/studio' },
  { label: 'Career', icon: '★', href: '/career' },
  { label: 'Releases', icon: '↗', href: '/release' },
  { label: 'Goals', icon: '◎', href: '/goals' },
  { label: 'Manager', icon: '⚙', href: '/manager' },
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
    <main className="relative min-h-screen overflow-hidden bg-[#03030b] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center_top,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_bottom,rgba(37,99,235,0.08),transparent_42%)]" />

      <aside className="fixed left-0 top-0 flex h-screen w-44 flex-col items-center justify-start border-r border-violet-200/10 bg-[#050510]/78 px-4 pt-8 shadow-[20px_0_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <div className="flex w-full flex-col items-center gap-8">
          <img src="/alex-logo.svg" alt="Alex by AIM" className="mb-2 h-auto w-[118px]" />
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-2 rounded-3xl px-3 py-2 text-sm text-violet-100/70 transition hover:text-white"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200/10 bg-white/[0.035] text-2xl text-violet-200 shadow-[0_0_24px_rgba(139,92,246,0.12)]">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      <section className="flex min-h-screen items-start justify-center px-8 pl-48 pt-24">
        <div className="w-full max-w-[1180px] text-left">
          <div className="mb-10 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-5xl font-semibold tracking-tight">{title}</h1>
              <span className="rounded-full bg-violet-500/12 px-3 py-1 text-sm font-medium text-violet-100">
                Prototype
              </span>
            </div>
            <p className="max-w-2xl text-lg text-[#B7C8DA]">{subtitle}</p>
            <Link href="/" className="text-sm text-violet-100 transition hover:text-white">
              Back to home
            </Link>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
