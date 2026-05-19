import Link from 'next/link';
import PrototypeAction from '@/components/PrototypeAction';
import { careerTimeline, contacts, industryFeed } from '@/lib/mockData';

type Stat = {
  label: string;
  value: string;
  accent?: boolean;
};

export function QuickActions() {
  return (
    <div className="rounded-[2rem] border border-violet-300/15 bg-white/[0.05] p-6 shadow-[0_24px_90px_rgba(109,40,217,0.18)] backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.3em] text-violet-200">Quick actions</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {['Plan Release', 'Write Email', 'Set Goal', 'Ask Alex'].map((label) => (
          <PrototypeAction
            key={label}
            label={label}
            result={label === 'Write Email' ? 'Draft created' : label === 'Set Goal' ? 'Goal created' : 'Task created'}
            title={`${label} prototype ready`}
            message={`Alex prepared a ${label.toLowerCase()} next step and added it to your career workspace.`}
            className="rounded-[1.5rem] border border-violet-300/15 bg-[#0B0B1C]/90 px-4 py-4 text-left text-sm font-semibold text-[#F1ECFF] transition hover:border-violet-300/35 hover:bg-violet-500/10"
          />
        ))}
      </div>
      <p className="mt-5 text-xs text-[#B7C8DA]">Prototype actions create drafts, tasks and Alex suggestions instantly.</p>
    </div>
  );
}

export function CreditsCard() {
  return (
    <div className="rounded-[2rem] border border-violet-300/15 bg-[#060711]/95 p-6 shadow-[0_24px_90px_rgba(109,40,217,0.2)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-200">AIM Credits</p>
          <p className="mt-4 text-4xl font-semibold text-white">2,450 <span className="text-lg font-medium text-violet-200">CR</span></p>
        </div>
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/15 text-2xl text-violet-200 shadow-[0_0_34px_rgba(139,92,246,0.3)]">
          ★
        </div>
      </div>
      <div className="mt-6 rounded-[1.75rem] bg-white/5 p-4 text-sm text-[#B7C8DA]">
        <p className="font-semibold text-white">Next level: Momentum at 3,000 CR</p>
      </div>
      <div className="mt-6 space-y-3">
        {[
          { label: 'Release a track', value: '+750 CR' },
          { label: 'Reach release milestone', value: '+500 CR' },
          { label: 'Complete a goal', value: '+250 CR' },
          { label: 'Upload assets', value: '+150 CR' },
          { label: 'Send outreach', value: '+200 CR' },
          { label: 'Complete campaign', value: '+500 CR' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-3xl bg-[#0e1b36]/90 px-4 py-3 text-sm text-[#D7E6FF]">
            <span>{item.label}</span>
            <span className="font-semibold text-violet-200">{item.value}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-[#B7C8DA]">Credits currently preview how streaks, release milestones and completed tasks will reward momentum.</p>
    </div>
  );
}

export function ManagerAvatarCard() {
  return (
    <div className="rounded-[2rem] border border-violet-300/15 bg-white/[0.05] p-6 shadow-[0_24px_90px_rgba(109,40,217,0.18)] backdrop-blur-xl">
      <Link href="/manager" className="flex items-center gap-4 rounded-[1.75rem] border border-violet-300/12 bg-[#090A1A]/95 p-4 transition hover:border-violet-300/25 hover:bg-violet-500/10">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/12 text-2xl text-violet-200 shadow-[0_0_30px_rgba(139,92,246,0.25)]">
          A
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-violet-200">Alex</p>
          <p className="text-base font-semibold text-white">AI manager settings</p>
        </div>
      </Link>
      <p className="mt-4 text-sm text-[#B7C8DA]">Use manager settings to shape Alex’s voice, push level and follow-up cadence.</p>
    </div>
  );
}

export function ProgressCard() {
  const items = [
    { label: 'Release 2 singles', value: 72 },
    { label: 'Book 5 gigs', value: 46 },
    { label: 'Grow monthly listeners', value: 58 },
    { label: 'Build email list', value: 83 },
  ];

  return (
    <div className="rounded-[2rem] border border-violet-300/15 bg-white/[0.05] p-6 shadow-[0_24px_90px_rgba(109,40,217,0.18)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Goals progress</p>
          <p className="mt-4 text-3xl font-semibold text-white">Overall progress</p>
        </div>
        <div className="rounded-full bg-violet-500/12 px-4 py-2 text-sm font-semibold text-violet-100">68%</div>
      </div>
      <div className="mt-6 space-y-5">
        {items.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm text-[#B7C8DA]">
              <span>{item.label}</span>
              <span>{item.value}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300" style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-[#B7C8DA]">Alex is previewing how these goals will sync into reminders, achievements and release milestones.</p>
    </div>
  );
}

export function RecentActivityCard() {
  const activity = [
    { label: 'New track uploaded', time: '2h ago' },
    { label: 'Artwork added', time: '5h ago' },
    { label: 'Release plan updated', time: 'Yesterday' },
    { label: 'Goal updated', time: '2 days ago' },
    { label: 'Industry opportunity saved', time: '3 days ago' },
  ];

  return (
    <div className="rounded-[2rem] border border-violet-300/15 bg-[#070816]/95 p-6 shadow-[0_24px_90px_rgba(109,40,217,0.2)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Recent activity</p>
        <span className="rounded-full bg-violet-500/12 px-3 py-1 text-xs uppercase tracking-[0.24em] text-violet-100">Live</span>
      </div>
      <div className="mt-6 space-y-4">
        {activity.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-[#0b152a]/90 px-4 py-4 text-sm text-[#D7E6FF]">
            <span>{item.label}</span>
            <span className="text-violet-200">{item.time}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-[#B7C8DA]">Recent activity previews the release, calendar and outreach events Alex will keep organized for you.</p>
    </div>
  );
}

export function IndustryFeedCard() {
  return (
    <div className="rounded-[2rem] border border-violet-300/15 bg-[#050611]/95 p-6 shadow-[0_24px_90px_rgba(109,40,217,0.2)] backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Industry feed</p>
        <span className="rounded-full bg-violet-500/12 px-3 py-1 text-xs uppercase tracking-[0.24em] text-violet-100">Insights</span>
      </div>
      <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2 text-sm text-[#D7E6FF]">
        {industryFeed.slice(0, 5).map((item) => (
          <Link
            key={item.id}
            href={`/opportunities/${item.id}`}
            className="block rounded-[1.75rem] border border-white/10 bg-[#0A0B1B]/90 px-4 py-4 shadow-[0_12px_34px_rgba(109,40,217,0.12)] transition hover:border-violet-300/35 hover:bg-violet-500/10"
          >
            {item.title}
          </Link>
        ))}
      </div>
      <p className="mt-5 text-xs text-[#B7C8DA]">Open any lead to review source, deadline, contact info and Alex outreach suggestions.</p>
    </div>
  );
}

export function ContactCRMCard() {
  return (
    <div className="rounded-[2rem] border border-violet-300/15 bg-white/[0.05] p-6 shadow-[0_24px_90px_rgba(109,40,217,0.18)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Contact CRM</p>
          <p className="mt-3 text-xl font-semibold text-white">Track outreach status</p>
        </div>
        <PrototypeAction
          label="View all"
          result="CRM opened"
          title="Contact CRM prototype opened"
          message="Alex prepared a full outreach board with venue, playlist, press and collaborator follow-up lanes."
          className="rounded-full bg-violet-500/12 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-violet-100 transition hover:bg-violet-500/18"
        />
      </div>
      <div className="mt-6 space-y-4">
        {contacts.slice(0, 3).map((contact) => (
          <div key={contact.id} className="rounded-[1.5rem] border border-white/10 bg-[#0A0B1B]/95 px-4 py-4 text-sm text-[#D7E6FF]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{contact.name}</p>
                <p className="mt-1 text-xs text-violet-200">{contact.role} · {contact.category}</p>
              </div>
              <span className="rounded-full bg-violet-500/12 px-3 py-1 text-xs uppercase tracking-[0.24em] text-violet-100">{contact.status}</span>
            </div>
            <p className="mt-3 text-xs text-[#B7C8DA]">Last touched: {contact.lastTouch}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TimelineCard() {
  return (
    <div className="rounded-[2rem] border border-violet-300/15 bg-[#050611]/95 p-6 shadow-[0_24px_90px_rgba(109,40,217,0.2)] backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Career timeline</p>
      <div className="mt-6 space-y-4">
        {careerTimeline.map((event) => (
          <div key={event.date} className="rounded-[1.75rem] bg-[#0A0B1B]/95 px-4 py-4 text-sm text-[#D7E6FF]">
            <p className="text-xs uppercase tracking-[0.28em] text-violet-200">{event.date}</p>
            <p className="mt-2 font-semibold text-white">{event.title}</p>
            <p className="mt-2 text-[#B7C8DA]">{event.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CheckInsCard() {
  const checkIns = [
    'How did rehearsal go yesterday?',
    'You planned to pitch 3 venues this week.',
    'Release artwork still missing.',
    'Want me to draft your submission email?',
  ];

  return (
    <div className="rounded-[2rem] border border-violet-300/15 bg-white/[0.05] p-6 shadow-[0_24px_90px_rgba(109,40,217,0.18)] backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Manager check-ins</p>
      <div className="mt-6 space-y-4">
        {checkIns.map((item) => (
          <div key={item} className="rounded-[1.5rem] bg-[#0A0B1B]/95 px-4 py-4 text-sm text-[#D7E6FF]">
            {item}
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <PrototypeAction label="Reply" result="Reply drafted" title="Check-in reply drafted" message="Alex drafted a concise response you can refine before sending." className="rounded-full bg-gradient-to-br from-violet-400 via-indigo-500 to-cyan-300 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.24)] transition hover:brightness-110" />
        <PrototypeAction label="Snooze" result="Snoozed" title="Check-in snoozed" message="Alex will bring this back into focus tomorrow morning." className="rounded-full bg-white/5 px-4 py-3 text-sm font-semibold text-[#D7E6FF] transition hover:bg-white/10" />
        <PrototypeAction label="Turn into task" result="Task created" title="Manager task created" message="Alex turned this check-in into a prototype task with a next action." className="rounded-full bg-violet-500/12 px-4 py-3 text-sm font-semibold text-violet-100 transition hover:bg-violet-500/18" />
      </div>
    </div>
  );
}

export function StatsGrid() {
  const stats: Stat[] = [
    { label: 'Monthly Streams', value: '43,221' },
    { label: 'Revenue Estimate', value: '$127' },
    { label: 'Playlist Adds', value: '14' },
    { label: 'Top Market', value: 'Berlin', accent: true },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-[1.75rem] border border-violet-300/15 bg-[#0A0B1B]/95 p-5 text-sm text-[#D7E6FF] shadow-[0_18px_55px_rgba(109,40,217,0.15)]">
          <p className="uppercase tracking-[0.28em] text-violet-200">{stat.label}</p>
          <p className={`mt-4 text-2xl font-semibold ${stat.accent ? 'text-violet-200' : 'text-white'}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
