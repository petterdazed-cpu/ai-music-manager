import SectionLayout from '@/components/SectionLayout';
import PrototypeAction from '@/components/PrototypeAction';
import {
  CheckInsCard,
  ContactCRMCard,
  CreditsCard,
  IndustryFeedCard,
  ManagerAvatarCard,
  ProgressCard,
  QuickActions,
  RecentActivityCard,
  StatsGrid,
  TimelineCard,
} from '@/components/career/CareerWidgets';

export default function CareerPage() {
  return (
    <SectionLayout
      title="Career"
      subtitle="Your artist operating system for momentum, releases, goals and manager-led progress."
    >
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1.1fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-violet-300/15 bg-white/[0.05] p-8 shadow-[0_24px_90px_rgba(109,40,217,0.2)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Good evening, Aurora</p>
            <h2 className="mt-4 text-5xl font-semibold leading-tight text-white">Build your career.</h2>
            <p className="mt-4 max-w-xl text-lg text-[#B7C8DA]">Your music. Your momentum. Your manager.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Plan Release', 'Write Email', 'Set Goal', 'Ask Alex'].map((action) => (
                <PrototypeAction
                  key={action}
                  label={action}
                  result={action === 'Write Email' ? 'Draft created' : action === 'Set Goal' ? 'Goal created' : 'Task created'}
                  title={`${action} prototype ready`}
                  message={`Alex prepared a ${action.toLowerCase()} next step for your career dashboard.`}
                  className="rounded-full border border-violet-300/15 bg-violet-500/12 px-5 py-3 text-sm font-semibold text-violet-100 transition hover:border-violet-300/35 hover:bg-violet-500/18"
                />
              ))}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Active releases', value: '2' },
                { label: 'Open outreach tasks', value: '7' },
                { label: 'Upcoming deadlines', value: '1' },
                { label: 'AI nudges scheduled', value: '3' },
              ].map((metric) => (
                <div key={metric.label} className="rounded-[1.75rem] border border-white/10 bg-[#0A0B1B]/95 p-4 text-sm text-[#D7E6FF]">
                  <p className="uppercase tracking-[0.28em] text-violet-200">{metric.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-[#B7C8DA]">This dashboard will pull together release readiness, manager check-ins and career momentum so you always know the next best move.</p>
          </div>

          <QuickActions />
          <StatsGrid />
          <TimelineCard />
        </div>

        <div className="space-y-6">
          <CreditsCard />
          <ProgressCard />
          <ContactCRMCard />
        </div>

        <div className="space-y-6">
          <ManagerAvatarCard />
          <RecentActivityCard />
          <CheckInsCard />
          <IndustryFeedCard />
        </div>
      </div>
    </SectionLayout>
  );
}
