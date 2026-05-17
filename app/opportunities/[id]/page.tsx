import SectionLayout from '@/components/SectionLayout';
import PrototypeAction from '@/components/PrototypeAction';
import { opportunities, type Opportunity } from '@/lib/mockData';

type OpportunityDetailProps = {
  params: {
    id: string;
  };
};

export default function OpportunityDetailPage({ params }: OpportunityDetailProps) {
  const opportunity = opportunities.find((item) => item.id === params.id) || createPrototypeOpportunity(params.id);

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
            <div className="mt-8 rounded-[1.75rem] border border-[#0ea5e9]/12 bg-[#06152a]/95 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Recommended next step</p>
              <p className="mt-3 text-sm leading-6 text-[#D7E6FF]">
                Ask Alex to draft a concise outreach note, attach the strongest live clip or press asset, and turn the deadline into a follow-up task.
              </p>
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
              <PrototypeAction label="Draft submission email" result="Draft created" title="Submission email drafted" message={`Alex drafted outreach for ${opportunity.source} and queued it with this opportunity's deadline.`} />
              <PrototypeAction label="Build press kit" result="Press kit started" title="Press kit draft created" message="A prototype press kit checklist is ready with bio, artwork, link, and live proof placeholders." className="rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-[#D7E6FF] transition hover:bg-white/10" />
              <PrototypeAction label="Save for later" result="Saved" title="Opportunity saved" message="This opportunity was saved to your AIM follow-up queue." className="rounded-full bg-[#1a1f2d] px-5 py-3 text-sm font-semibold text-[#AED7FF] transition hover:bg-[#0ea5ff]/10" />
              <PrototypeAction label="Turn into task" result="Task created" title="Opportunity task created" message="Alex created a prototype task with the deadline, source, and next action." className="rounded-full bg-[#0d1b32] px-5 py-3 text-sm font-semibold text-[#D7E6FF] transition hover:bg-[#0ea5ff]/10" />
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
              <PrototypeAction label="Want me to draft outreach?" result="Draft created" title="Outreach draft ready" message={`Alex drafted a focused note for ${opportunity.source}, tailored to ${opportunity.type} fit and deadline urgency.`} />
              <PrototypeAction label="Turn into task" result="Task created" title="Follow-up task created" message="Alex added a prototype deadline task and recommended next move." className="rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-[#D7E6FF] transition hover:bg-white/10" />
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

function createPrototypeOpportunity(id: string): Opportunity {
  const readableTitle = decodeURIComponent(id)
    .replace(/^feed-\d+$/, 'Fresh industry opportunity')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return {
    id,
    headline: readableTitle,
    source: 'AIM Industry Desk',
    sourceLogo: '/logos/aim.svg',
    date: '2026-05-17',
    location: 'Remote',
    genres: ['Pop', 'Electronic', 'Independent'],
    type: 'press',
    email: 'opportunities@aim.prototype',
    website: 'https://aim.prototype/opportunities',
    deadline: '2026-06-07',
    requiredAssets: ['Short bio', 'Recent song link', 'Press image', 'One-line pitch'],
    summary: 'AIM created a prototype opportunity view for this feed item so the lead can be reviewed, saved and turned into outreach without hitting a dead end.',
    relevance: 'Prototype match based on your current artist profile.',
  };
}
