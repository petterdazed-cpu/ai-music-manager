import Link from 'next/link';
import SectionLayout from '@/components/SectionLayout';
import { opportunities } from '@/lib/mockData';

type OpportunityDetailProps = {
  params: {
    id: string;
  };
};

export default function OpportunityDetailPage({ params }: OpportunityDetailProps) {
  const opportunity = opportunities.find((item) => item.id === params.id);

  if (!opportunity) {
    return (
      <SectionLayout title="Opportunity not found" subtitle="The opportunity you selected could not be found.">
        <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-8 text-center text-[#B7C8DA]">
          <p>Try returning to the industry feed or checking another opportunity.</p>
          <Link href="/opportunities" className="mt-5 inline-flex rounded-full bg-[#0ea5ff] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#12b0ff]">
            Browse opportunities
          </Link>
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout title="Opportunity detail" subtitle={opportunity.headline}>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-white/[0.04] p-8 shadow-[0_20px_90px_rgba(10,132,255,0.14)] backdrop-blur-xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">{opportunity.type}</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">{opportunity.headline}</h2>
                <p className="mt-4 text-sm text-[#B7C8DA]">{opportunity.summary}</p>
              </div>
              <div className="flex flex-col items-end gap-3 rounded-[1.5rem] border border-white/10 bg-[#041227]/95 p-4 text-right">
                <p className="text-xs uppercase tracking-[0.3em] text-[#8ec6ff]">From</p>
                <div className="text-lg font-semibold text-white">{opportunity.source}</div>
                <p className="text-sm text-[#B7C8DA]">Deadline {opportunity.deadline}</p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] bg-[#041C33]/95 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-[#8ec6ff]">Location</p>
                <p className="mt-3 text-base font-semibold text-white">{opportunity.location}</p>
              </div>
              <div className="rounded-[1.75rem] bg-[#041C33]/95 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-[#8ec6ff]">Genre fit</p>
                <p className="mt-3 text-base font-semibold text-white">{opportunity.genres.join(', ')}</p>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Required assets</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {opportunity.requiredAssets.map((asset) => (
                  <div key={asset} className="rounded-3xl border border-white/10 bg-[#06152a]/95 px-4 py-3 text-sm text-[#D7E6FF]">
                    {asset}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-8 shadow-[0_20px_90px_rgba(10,132,255,0.16)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Contact</p>
            <div className="mt-5 space-y-3 text-sm text-[#D7E6FF]">
              <p><span className="font-semibold text-white">Email:</span> {opportunity.email}</p>
              <p><span className="font-semibold text-white">Website:</span> <a href={opportunity.website} target="_blank" rel="noreferrer" className="text-[#1E90FF] hover:text-white">{opportunity.website}</a></p>
              <p><span className="font-semibold text-white">Submission deadline:</span> {opportunity.deadline}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-full bg-[#0ea5ff] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#12b0ff]">Draft submission email</button>
              <button className="rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-[#D7E6FF] transition hover:bg-white/10">Build press kit</button>
              <button className="rounded-full bg-[#1a1f2d] px-5 py-3 text-sm font-semibold text-[#AED7FF] transition hover:bg-[#0ea5ff]/10">Save for later</button>
              <button className="rounded-full bg-[#0d1b32] px-5 py-3 text-sm font-semibold text-[#D7E6FF] transition hover:bg-[#0ea5ff]/10">Turn into task</button>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-[#041227]/95 p-6 shadow-[0_20px_90px_rgba(10,132,255,0.14)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">AI manager</p>
            <h3 className="mt-4 text-2xl font-semibold text-white">This looks relevant for your artist profile.</h3>
            <p className="mt-4 text-sm text-[#B7C8DA]">Alex has flagged this opportunity as high priority for your next campaign and ready assets.</p>
            <div className="mt-6 space-y-3">
              {[
                'This looks relevant for your artist profile.',
                'Want me to help you submit?',
                'We can turn this into a release task or press outreach sequence.',
              ].map((line) => (
                <p key={line} className="rounded-3xl bg-[#0a162d]/95 px-4 py-3 text-sm text-[#D7E6FF]">{line}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-full bg-[#0ea5ff] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#12b0ff]">Draft submission email</button>
              <button className="rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-[#D7E6FF] transition hover:bg-white/10">Turn into task</button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-6 shadow-[0_20px_90px_rgba(10,132,255,0.16)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Opportunity quick facts</p>
            <div className="mt-6 space-y-4 text-sm text-[#D7E6FF]">
              <div className="rounded-3xl bg-[#081420]/95 px-4 py-3">Source: {opportunity.source}</div>
              <div className="rounded-3xl bg-[#081420]/95 px-4 py-3">Type: {opportunity.type}</div>
              <div className="rounded-3xl bg-[#081420]/95 px-4 py-3">Relevance: {opportunity.relevance}</div>
            </div>
          </div>
        </aside>
      </div>
    </SectionLayout>
  );
}
