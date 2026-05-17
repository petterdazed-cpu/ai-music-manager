import SectionLayout from '@/components/SectionLayout';

export default function SettingsPage() {
  return (
    <SectionLayout
      title="Settings"
      subtitle="General preferences for your AIM account, notifications and app behavior."
    >
      <div className="space-y-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-[#0ea5e9]/15 bg-white/5 p-6 shadow-[0_15px_60px_rgba(0,118,255,0.14)]">
            <h3 className="text-xl font-semibold">Profile</h3>
            <p className="mt-2 text-sm text-[#B7C8DA]">Your artist profile settings and manager preferences.</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-black/60 p-4">
                <p className="text-sm text-[#B7C8DA]">Artist name</p>
                <p className="mt-2 text-lg font-semibold">AIM Artist</p>
              </div>
              <div className="rounded-3xl bg-black/60 p-4">
                <p className="text-sm text-[#B7C8DA]">Email</p>
                <p className="mt-2 text-lg font-semibold">artist@aim.com</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[#0ea5e9]/15 bg-white/5 p-6 shadow-[0_15px_60px_rgba(0,118,255,0.14)]">
            <h3 className="text-xl font-semibold">Notification settings</h3>
            <p className="mt-2 text-sm text-[#B7C8DA]">Control how Alex reaches out about your music career.</p>
            <div className="mt-6 space-y-4">
              {['Email updates', 'Manager follow-ups', 'Release reminders'].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-3xl bg-black/60 p-4">
                  <p className="text-sm text-[#E5EAF8]">{item}</p>
                  <span className="rounded-full bg-[#0ea5ff]/10 px-3 py-1 text-xs text-[#AED7FF]">On</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-[#0ea5e9]/15 bg-white/5 p-6 shadow-[0_15px_60px_rgba(0,118,255,0.14)]">
            <h3 className="text-xl font-semibold">Language</h3>
            <p className="mt-2 text-sm text-[#B7C8DA]">Select your preferred language for AIM interactions.</p>
            <div className="mt-6 rounded-3xl bg-black/60 p-4 text-lg font-semibold text-[#E5EAF8]">English</div>
          </div>
          <div className="rounded-[1.75rem] border border-[#0ea5e9]/15 bg-white/5 p-6 shadow-[0_15px_60px_rgba(0,118,255,0.14)]">
            <h3 className="text-xl font-semibold">Timezone</h3>
            <p className="mt-2 text-sm text-[#B7C8DA]">Keep AIM aligned with your location and deadlines.</p>
            <div className="mt-6 rounded-3xl bg-black/60 p-4 text-lg font-semibold text-[#E5EAF8]">Stockholm (GMT+2)</div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-[#0ea5e9]/15 bg-white/5 p-6 shadow-[0_15px_60px_rgba(0,118,255,0.14)]">
            <h3 className="text-xl font-semibold">Connected accounts</h3>
            <p className="mt-2 text-sm text-[#B7C8DA]">Integrate streaming, distribution, and creative tools later.</p>
            <div className="mt-6 space-y-3">
              {['Spotify', 'Apple Music', 'Instagram'].map((account) => (
                <div key={account} className="rounded-3xl bg-black/60 p-4 text-sm text-[#E5EAF8]">{account} placeholder</div>
              ))}
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-[#0ea5e9]/15 bg-white/5 p-6 shadow-[0_15px_60px_rgba(0,118,255,0.14)]">
            <h3 className="text-xl font-semibold">Data &amp; privacy</h3>
            <p className="mt-2 text-sm text-[#B7C8DA]">AIM will respect your music, your strategy and your privacy.</p>
            <div className="mt-6 rounded-3xl bg-black/60 p-4 text-sm text-[#E5EAF8]">Privacy settings placeholder</div>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
