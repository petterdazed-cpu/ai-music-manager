import SectionLayout from '@/components/SectionLayout';
import PrototypeAction from '@/components/PrototypeAction';

const goals = [
  { title: 'Weekly rehearsals', progress: 66, detail: '2 / 3 rehearsals this week' },
  { title: 'Studio sessions', progress: 50, detail: '1 / 2 studio sessions' },
  { title: 'Release deadline', progress: 65, detail: '65% release plan ready' },
  { title: 'Monthly listener target', progress: 24, detail: '12,000 / 50,000 stream goal' },
  { title: 'Gig target this year', progress: 33, detail: '4 / 12 gigs booked' },
];

export default function GoalsPage() {
  return (
    <SectionLayout
      title="Goals"
      subtitle="Set your targets and let Alex keep you accountable."
    >
      {/* TODO: add achievement rewards, reminders and calendar-based follow-up notifications here. */}
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-6 shadow-[0_15px_60px_rgba(0,118,255,0.16)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Your active goals</h2>
              <p className="mt-2 text-sm text-[#B7C8DA]">Track progress, routines and momentum as you move toward your next release.</p>
            </div>
            <PrototypeAction
              label="Create new goal"
              result="Goal created"
              title="New goal draft created"
              message="Alex created a prototype goal with weekly check-ins, a progress target and a suggested next action."
            />
          </div>
        </div>

        <div className="grid gap-6">
          {goals.map((goal) => (
            <div key={goal.title} className="rounded-[1.75rem] border border-[#0ea5e9]/15 bg-white/5 p-6 shadow-[0_15px_60px_rgba(0,118,255,0.14)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{goal.title}</h3>
                  <p className="mt-1 text-sm text-[#B7C8DA]">{goal.detail}</p>
                </div>
                <span className="rounded-full bg-[#0ea5e9]/10 px-3 py-1 text-sm text-[#AED7FF]">Progress</span>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-[#0ea5ff] via-[#6fb8ff] to-[#7ad6ff]" style={{ width: `${goal.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionLayout>
  );
}
