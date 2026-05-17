"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export type SectionLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const navItems = [
  { label: 'Home', icon: '⌂', href: '/' },
  { label: 'Studio', icon: '≋', href: '/studio' },
  { label: 'Career', icon: '★', href: '/career' },
  { label: 'Releases', icon: '↗', href: '/release' },
  { label: 'Goals', icon: '◎', href: '/goals' },
  { label: 'Manager', icon: '⚙', href: '/manager' },
  { label: 'Settings', icon: '⚙', href: '/settings' },
];

export default function SectionLayout({ title, subtitle, children }: SectionLayoutProps) {
  const pathname = usePathname() || '/';
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center_top,rgba(14,132,255,0.14),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,118,255,0.06),transparent_40%)]" />

      <aside className="fixed left-0 top-0 flex h-screen w-44 flex-col items-center justify-start border-r border-white/10 bg-black/80 pt-14 px-4 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex flex-col items-center gap-2 text-sm text-[#AED7FF]">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex flex-col items-center gap-2 rounded-3xl px-3 py-2 transition ${active ? 'bg-[#0ea5e9]/10 text-white shadow-[0_0_30px_rgba(14,165,233,0.18)]' : 'hover:text-white'}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-3xl border border-[#0ea5e9]/15 bg-black/40 text-[#0ea5e9] text-3xl shadow-[0_0_20px_rgba(14,165,233,0.15)]">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      <section className="flex min-h-screen items-start justify-center px-8 pl-48 pt-24">
        <div className="w-full max-w-[1080px] text-left">
          <div className="mb-10 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-5xl font-semibold tracking-tight">{title}</h1>
              <span className="rounded-full bg-[#0ea5e9]/10 px-3 py-1 text-sm font-medium text-[#AED7FF]">Prototype</span>
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
