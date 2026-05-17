import SectionLayout from '@/components/SectionLayout';
import PrototypeAction from '@/components/PrototypeAction';

type GoalLane = 'Weekly Goals' | 'Monthly Goals' | 'Career Goals';

type Goal = {
  title: string;
  lane: GoalLane;
  progress: number;
  deadline: string;
  momentum: string;
  streak: string;
  credits: number;
  target: string;
  nextAction: string;
  accent: string;
};

const lanes: GoalLane[] = ['Weekly Goals', 'Monthly Goals', 'Career Goals'];

const goals: Goal[] = [
  {
    title: 'Pitch 15 curators',
    lane: 'Weekly Goals',
    progress: 73,
    deadline: 'Friday',
    momentum: '+6 pitches this week',
    streak: '4-day outreach streak',
    credits: 120,
    target: '11 / 15 pitches sent',
    nextAction: 'Send the final 4 with a tighter one-line angle for Midnight Drive.',
    accent: '#0ea5ff',
  },
  {
    title: 'Finish EP',
    lane: 'Weekly Goals',
    progress: 58,
    deadline: 'Sunday',
    momentum: '2 songs moved forward',
    streak: '3 focused studio blocks',
    credits: 90,
    target: 'Bridge edit and rough master left',
    nextAction: 'Lock one decision today: bridge cut or final chorus lift.',
    accent: '#22c55e',
  },
  {
    title: 'Book 3 gigs',
    lane: 'Monthly Goals',
    progress: 67,
    deadline: 'May 31',
    momentum: '2 warm replies',
    streak: '2-week booking rhythm',
    credits: 180,
    target: '2 / 3 gigs booked',
    nextAction: 'Follow up with Nordic Stage and send one new local support pitch.',
    accent: '#38bdf8',
  },
  {
    title: 'Release Northern Lights',
    lane: 'Monthly Goals',
    progress: 64,
    deadline: 'Jun 21',
    momentum: 'Artwork approved',
    streak: '5 campaign tasks closed',
    credits: 220,
    target: 'Distribution draft, clips and pitch window remain',
    nextAction: 'Finish metadata review before playlist pitching opens.',
    accent: '#a78bfa',
  },
  {
    title: 'Reach 25k listeners',
    lane: 'Career Goals',
    progress: 48,
    deadline: 'Q3 2026',
    momentum: '+2.8k monthly listeners',
    streak: '7-week audience lift',
    credits: 300,
    target: '12k / 25k listeners',
    nextAction: 'Double down on late-night synth positioning and post two performance clips.',
    accent: '#f59e0b',
  },
  {
    title: 'Build Nordic live circuit',
    lane: 'Career Goals',
    progress: 35,
    deadline: '2026 season',
    momentum: '3 cities mapped',
    streak: 'Monthly booking review',
    credits: 260,
    target: '3 / 8 target venues in motion',
    nextAction: 'Package the live set with Afterglow proof points and a clean tech note.',
    accent: '#14b8a6',
  },
];

const overview = [
  { label: 'Momentum', value: '+18%', detail: 'Rolling 14-day progress' },
  { label: 'Active streak', value: '7 days', detail: 'Tasks completed without drift' },
  { label: 'AIM credits', value: '1,170', detail: 'Earned from goal progress' },
  { label: 'Next deadline', value: 'Friday', detail: 'Curator pitching closes' },
];

const actionClassName = 'rounded-full bg-[#0ea5ff] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#12b0ff]';
const secondaryActionClassName = 'rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-[#D7E6FF] transition hover:bg-white/10';

export default function GoalsPage() {
  return (
    <SectionLayout
      title="Goals"
      subtitle="A sticky accountability system for release work, audience growth and long-range career momentum."
    >
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-[#0ea5e9]/15 bg-[#030914]/95 p-6 shadow-[0_24px_90px_rgba(10,132,255,0.18)] backdrop-blur-xl">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr] xl:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Accountability</p>
              <h2 className="mt-3 text-4xl font-semibold text-white">Momentum without noise</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#B7C8DA]">
                Weekly execution, monthly campaign targets and career milestones in one calm system that keeps the next move visible.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {overview.map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.26em] text-[#8ec6ff]">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-xs leading-5 text-[#B7C8DA]">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {['Discipline', 'Growth', 'Career'].map((label, index) => {
            const values = [
              { value: 82, detail: 'Consistency score' },
              { value: 64, detail: 'Audience target progress' },
              { value: 51, detail: 'Long-range milestone progress' },
            ][index];

            return (
              <div key={label} className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-6 shadow-[0_20px_80px_rgba(10,132,255,0.14)] backdrop-blur-xl">
                <div
                  className="mx-auto flex h-36 w-36 items-center justify-center rounded-full"
                  style={{ background: `conic-gradient(#0ea5ff ${values.value}%, rgba(255,255,255,0.08) 0)` }}
                >
                  <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[#030914]">
                    <p className="text-3xl font-semibold text-white">{values.value}%</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#8ec6ff]">{label}</p>
                  </div>
                </div>
                <p className="mt-5 text-center text-sm leading-6 text-[#B7C8DA]">{values.detail}</p>
              </div>
            );
          })}
        </section>

        <div className="space-y-8">
          {lanes.map((lane) => {
            const laneGoals = goals.filter((goal) => goal.lane === lane);

            return (
              <section key={lane} className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">{lane}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{laneGoals.length} active goals</h3>
                  </div>
                  <PrototypeAction
                    label={lane === 'Weekly Goals' ? 'Plan this week' : lane === 'Monthly Goals' ? 'Review month' : 'Recalibrate career target'}
                    result="Accountability plan created"
                    title={`${lane} plan ready`}
                    message={`Alex created a prototype ${lane.toLowerCase()} accountability plan with deadlines, check-ins, credits and next actions.`}
                    className={secondaryActionClassName}
                  />
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  {laneGoals.map((goal) => (
                    <article key={goal.title} className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-5 shadow-[0_20px_80px_rgba(10,132,255,0.16)] backdrop-blur-xl">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-[#8ec6ff]">{goal.deadline}</p>
                          <h4 className="mt-3 text-2xl font-semibold text-white">{goal.title}</h4>
                          <p className="mt-3 text-sm leading-6 text-[#B7C8DA]">{goal.target}</p>
                        </div>
                        <div className="rounded-[1.25rem] border border-white/10 bg-[#061229]/95 px-4 py-3 text-right">
                          <p className="text-2xl font-semibold text-white">{goal.progress}%</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#8ec6ff]">Progress</p>
                        </div>
                      </div>

                      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${goal.progress}%`,
                            background: `linear-gradient(90deg, ${goal.accent}, #7dd3fc)`,
                          }}
                        />
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-4">
                          <p className="text-xs uppercase tracking-[0.22em] text-[#8ec6ff]">Momentum</p>
                          <p className="mt-2 text-sm leading-5 text-[#D7E6FF]">{goal.momentum}</p>
                        </div>
                        <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-4">
                          <p className="text-xs uppercase tracking-[0.22em] text-[#8ec6ff]">Streak</p>
                          <p className="mt-2 text-sm leading-5 text-[#D7E6FF]">{goal.streak}</p>
                        </div>
                        <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-4">
                          <p className="text-xs uppercase tracking-[0.22em] text-[#8ec6ff]">AIM credits</p>
                          <p className="mt-2 text-sm leading-5 text-[#D7E6FF]">+{goal.credits} on completion</p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-[#061229]/95 p-4 text-sm leading-6 text-[#D7E6FF]">
                        <span className="font-semibold text-white">Alex:</span> {goal.nextAction}
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <PrototypeAction
                          label="Log progress"
                          result="Progress logged"
                          title={`${goal.title} updated`}
                          message={`Alex logged progress on ${goal.title}, kept the streak active and previewed +${goal.credits} AIM credits for completion.`}
                          className={actionClassName}
                        />
                        <PrototypeAction
                          label="Create next action"
                          result="Task created"
                          title={`${goal.title} next action created`}
                          message={`Alex created a prototype task: ${goal.nextAction}`}
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
