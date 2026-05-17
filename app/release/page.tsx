import SectionLayout from '@/components/SectionLayout';
import PrototypeAction from '@/components/PrototypeAction';

const releases = [
  { title: 'Upcoming Single', status: 'Planning', date: 'Jun 21', progress: 55 },
  { title: 'EP Concept', status: 'Concept', date: 'Aug 12', progress: 25 },
  { title: 'Previous Release', status: 'Live', date: 'Feb 03', progress: 100 },
];

const checklist = [
  'Final audio export',
  'Cover artwork',
  'Metadata review',
  'Store territories',
  'ISRC / UPC',
  'Pre-save landing page',
  'Press pitch',
  'Playlist outreach',
];

export default function ReleasePage() {
  return (
    <SectionLayout
      title="Releases"
      subtitle="Build your release roadmap, keep every asset ready, and close the launch loop."
    >
      <div className="space-y-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {releases.map((release) => (
            <div key={release.title} className="rounded-[1.75rem] border border-[#0ea5e9]/15 bg-white/5 p-6 shadow-[0_15px_60px_rgba(0,118,255,0.14)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{release.title}</h3>
                  <p className="mt-2 text-sm text-[#B7C8DA]">Status: {release.status}</p>
                </div>
                <span className="rounded-full bg-[#0ea5e9]/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#AED7FF]">{release.status}</span>
              </div>
              <div className="mt-5 h-36 rounded-[1.5rem] bg-white/5 border border-white/10" />
              <p className="mt-4 text-sm text-[#B7C8DA]">
                Release date: <span className="font-semibold text-white">{release.date}</span>
              </p>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0ea5ff] via-[#6fb8ff] to-[#7ad6ff]"
                  style={{ width: `${release.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-8 shadow-[0_20px_80px_rgba(10,132,255,0.18)] backdrop-blur-xl">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#0ea5e9]/10 text-2xl text-[#0ea5ff]">↗</span>
                <div>
                  <h3 className="text-3xl font-semibold">Release command center</h3>
                  <p className="mt-2 text-sm text-[#B7C8DA]">Set the launch date, route assets, and lock in your promotional plan from one place.</p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  { label: 'Active campaign', value: '2 releases' },
                  { label: 'Press assets ready', value: '87%' },
                  { label: 'Playlist targets', value: '12' },
                  { label: 'Release tasks complete', value: '6/8' },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-[1.75rem] bg-[#061229]/95 p-5 text-sm text-[#D7E6FF]">
                    <p className="uppercase tracking-[0.28em] text-[#8ec6ff]">{metric.label}</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Launch priority</p>
                <p className="mt-4 text-lg font-semibold text-white">Finalize artwork, metadata and pre-save flow before outreach.</p>
                <p className="mt-3 text-sm leading-6 text-[#B7C8DA]">This page will connect to your studio uploads, press assets, and campaign planning so every release becomes a coordinated launch.</p>
                <PrototypeAction
                  label="Open launch workflow"
                  result="Launch workflow opened"
                  title="Release workflow draft created"
                  message="Alex created a prototype launch workflow with artwork, metadata, pre-save, press and playlist tasks."
                  className="mt-6 rounded-full bg-[#0ea5ff] px-6 py-4 text-sm font-semibold text-black transition hover:bg-[#12b0ff]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <h4 className="text-lg font-semibold">Release checklist</h4>
            <div className="mt-5 space-y-3">
              {checklist.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-[#B7C8DA]">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#0ea5ff]/20 text-[#0ea5ff]">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
