import SectionLayout from '@/components/SectionLayout';
import PrototypeAction from '@/components/PrototypeAction';

type ReleaseLane = 'Upcoming Releases' | 'Active Campaigns' | 'Completed Releases';

type Release = {
  title: string;
  lane: ReleaseLane;
  type: string;
  date: string;
  campaignStatus: string;
  playlistPitching: string;
  promoAssets: string;
  distributionStatus: string;
  progress: number;
  coverInitials: string;
  coverClassName: string;
  managerRead: string;
};

const lanes: ReleaseLane[] = ['Upcoming Releases', 'Active Campaigns', 'Completed Releases'];

const releases: Release[] = [
  {
    title: 'Northern Lights',
    lane: 'Upcoming Releases',
    type: 'Single',
    date: 'Jun 21, 2026',
    campaignStatus: 'Pre-launch build',
    playlistPitching: 'Shortlist ready: 18 targets',
    promoAssets: 'Cover approved, clips pending',
    distributionStatus: 'Draft saved, metadata review open',
    progress: 64,
    coverInitials: 'NL',
    coverClassName: 'from-violet-500 via-indigo-500 to-fuchsia-300',
    managerRead: 'Best next move: lock the hook clip and send playlist pitches 14 days before release.',
  },
  {
    title: 'Midnight Drive',
    lane: 'Active Campaigns',
    type: 'Single',
    date: 'May 29, 2026',
    campaignStatus: 'Campaign live',
    playlistPitching: '7 sent, 3 follow-ups due',
    promoAssets: 'Canvas, teaser and press image ready',
    distributionStatus: 'Delivered to stores',
    progress: 82,
    coverInitials: 'MD',
    coverClassName: 'from-[#111827] via-[#6366f1] to-[#22c55e]',
    managerRead: 'Keep the campaign moving: follow up with curators and post the second performance clip.',
  },
  {
    title: 'Afterglow',
    lane: 'Completed Releases',
    type: 'Single',
    date: 'Feb 03, 2026',
    campaignStatus: 'Wrap report complete',
    playlistPitching: '12 pitches, 4 adds',
    promoAssets: 'Archive complete',
    distributionStatus: 'Live worldwide',
    progress: 100,
    coverInitials: 'AG',
    coverClassName: 'from-[#f97316] via-[#facc15] to-[#14b8a6]',
    managerRead: 'Useful signal: saves outperformed skips. Reuse the late-night angle for the next release.',
  },
  {
    title: 'Velvet Static EP',
    lane: 'Upcoming Releases',
    type: 'EP',
    date: 'Aug 16, 2026',
    campaignStatus: 'Strategy draft',
    playlistPitching: 'Positioning not final',
    promoAssets: 'Artwork direction chosen',
    distributionStatus: 'Not submitted',
    progress: 38,
    coverInitials: 'VS',
    coverClassName: 'from-[#581c87] via-[#db2777] to-[#f8fafc]',
    managerRead: 'Do not open distribution yet. Sequence the singles first, then set the EP date.',
  },
];

const commandMetrics = [
  { label: 'Release pipeline', value: '4', detail: '2 upcoming, 1 live, 1 completed' },
  { label: 'Playlist pitches', value: '37', detail: 'Across active and planned campaigns' },
  { label: 'Assets ready', value: '78%', detail: 'Cover, canvas, clips and press materials' },
  { label: 'Next deadline', value: 'Jun 7', detail: 'Northern Lights pitch window opens' },
];

const actionClassName = 'rounded-full bg-gradient-to-br from-violet-400 via-indigo-500 to-cyan-300 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.24)] transition hover:brightness-110';
const secondaryActionClassName = 'rounded-full border border-violet-300/15 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-violet-100 transition hover:border-violet-300/35 hover:bg-violet-500/12';

export default function ReleasePage() {
  return (
    <SectionLayout
      title="Releases"
      subtitle="Plan launches, track campaigns, keep distribution clean and make sure every release has a real next move."
    >
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-violet-300/15 bg-[#080713]/95 p-6 shadow-[0_24px_90px_rgba(109,40,217,0.22)] backdrop-blur-xl">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr] xl:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Release command center</p>
              <h2 className="mt-3 text-4xl font-semibold text-white">Aurora Lane launch pipeline</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#B7C8DA]">
                A working view of what is coming, what is live and what has already shipped, with the campaign details artists actually need.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {commandMetrics.map((metric) => (
                <div key={metric.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.26em] text-violet-200">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{metric.value}</p>
                  <p className="mt-2 text-xs leading-5 text-[#B7C8DA]">{metric.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-8">
          {lanes.map((lane) => {
            const laneReleases = releases.filter((release) => release.lane === lane);

            return (
              <section key={lane} className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-violet-200">{lane}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{laneReleases.length} release{laneReleases.length === 1 ? '' : 's'}</h3>
                  </div>
                  <PrototypeAction
                    label={lane === 'Completed Releases' ? 'Create wrap report' : 'Build lane plan'}
                    result={lane === 'Completed Releases' ? 'Report drafted' : 'Plan created'}
                    title={`${lane} workflow ready`}
                    message={`Alex created a prototype ${lane.toLowerCase()} workflow with dates, owners, assets and follow-up actions.`}
                    className={secondaryActionClassName}
                  />
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  {laneReleases.map((release) => (
                    <article key={release.title} className="rounded-[2rem] border border-violet-300/15 bg-[#070816]/88 p-5 shadow-[0_24px_90px_rgba(109,40,217,0.2)] backdrop-blur-xl">
                      <div className="grid gap-5 md:grid-cols-[168px_1fr]">
                        <div className={`flex aspect-square items-end justify-between rounded-[1.75rem] bg-gradient-to-br ${release.coverClassName} p-4 shadow-[inset_0_0_70px_rgba(0,0,0,0.28)]`}>
                          <span className="text-4xl font-semibold text-white">{release.coverInitials}</span>
                          <span className="rounded-full bg-black/35 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">{release.type}</span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.26em] text-violet-200">{release.date}</p>
                              <h4 className="mt-2 text-2xl font-semibold text-white">{release.title}</h4>
                            </div>
                            <span className="rounded-full bg-violet-500/12 px-3 py-1 text-xs uppercase tracking-[0.22em] text-violet-100">
                              {release.campaignStatus}
                            </span>
                          </div>

                          <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {[
                              ['Playlist pitching', release.playlistPitching],
                              ['Promo assets', release.promoAssets],
                              ['Distribution', release.distributionStatus],
                              ['Campaign status', release.campaignStatus],
                            ].map(([label, value]) => (
                              <div key={label} className="rounded-[1.25rem] border border-white/10 bg-[#0A0B1B]/95 p-4">
                                <p className="text-xs uppercase tracking-[0.22em] text-violet-200">{label}</p>
                                <p className="mt-2 text-sm leading-5 text-[#D7E6FF]">{value}</p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-5">
                            <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-violet-200">
                              <span>Timeline progress</span>
                              <span>{release.progress}%</span>
                            </div>
                            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300"
                                style={{ width: `${release.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-[#D7E6FF]">
                        <span className="font-semibold text-white">Alex:</span> {release.managerRead}
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <PrototypeAction
                          label="Draft pitch"
                          result="Pitch drafted"
                          title={`${release.title} pitch ready`}
                          message={`Alex drafted a concise playlist and press pitch for ${release.title}, including angle, genre fit and follow-up timing.`}
                          className={actionClassName}
                        />
                        <PrototypeAction
                          label="Open campaign"
                          result="Campaign opened"
                          title={`${release.title} campaign view`}
                          message={`Prototype campaign opened with timeline, asset checklist, pitch queue and next manager action for ${release.title}.`}
                          className={secondaryActionClassName}
                        />
                        <PrototypeAction
                          label="Build release plan"
                          result="Plan created"
                          title={`${release.title} release plan`}
                          message={`Alex built a prototype release plan with milestones for distribution, pre-save, content, press and playlist outreach.`}
                          className={secondaryActionClassName}
                        />
                        <PrototypeAction
                          label="Distribution"
                          result="Distribution workflow opened"
                          title={`${release.title} distribution checklist`}
                          message={`AIM prepared a mock distribution workflow: metadata check, territories, store date, ISRC/UPC and final audio confirmation.`}
                          className={secondaryActionClassName}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </SectionLayout>
  );
}
