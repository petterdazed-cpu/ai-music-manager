import Link from 'next/link';
import SectionLayout from '@/components/SectionLayout';
import { opportunities } from '@/lib/mockData';

export default function OpportunitiesPage() {
  return (
    <SectionLayout
      title="Opportunities"
      subtitle="Browse industry leads and turn relevant opportunities into tasks, submissions and campaigns."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {opportunities.map((opportunity) => (
          <Link
            key={opportunity.id}
            href={`/opportunities/${opportunity.id}`}
            className="group rounded-[2rem] border border-[#0ea5e9]/15 bg-white/[0.04] p-6 text-left transition hover:border-[#0ea5e9]/25 hover:bg-[#0ea5ff]/5"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-[#0ea5e9]/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-[#AED7FF]">
                  {opportunity.type}
                </span>
                <h2 className="mt-4 text-2xl font-semibold text-white">{opportunity.headline}</h2>
              </div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#0ea5e9]/10 text-xl text-[#0ea5ff]">
                {opportunity.source.charAt(0)}
              </div>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-[#B7C8DA] sm:grid-cols-2">
              <div>{opportunity.location}</div>
              <div>{opportunity.date}</div>
              <div>{opportunity.genres.join(', ')}</div>
              <div>Deadline {opportunity.deadline}</div>
            </div>
            <p className="mt-4 text-sm text-[#D7E6FF]">{opportunity.summary}</p>
            <div className="mt-5 flex items-center justify-between text-sm text-[#8ec6ff]">
              <span>{opportunity.source}</span>
              <span className="text-[#0ea5ff] transition group-hover:text-white">View details →</span>
            </div>
          </Link>
        ))}
      </div>
    </SectionLayout>
  );
}
