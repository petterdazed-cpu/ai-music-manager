'use client';

import { useState } from 'react';
import SectionLayout from '@/components/SectionLayout';
import PrototypeAction from '@/components/PrototypeAction';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    'Email updates': true,
    'Manager follow-ups': true,
    'Release reminders': true,
  });
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('Stockholm (GMT+2)');

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
                <button
                  key={item}
                  type="button"
                  onClick={() => setNotifications((current) => ({ ...current, [item]: !current[item] }))}
                  className="flex w-full items-center justify-between rounded-3xl bg-black/60 p-4 text-left transition hover:bg-[#0ea5ff]/10"
                >
                  <p className="text-sm text-[#E5EAF8]">{item}</p>
                  <span className="rounded-full bg-[#0ea5ff]/10 px-3 py-1 text-xs text-[#AED7FF]">{notifications[item] ? 'On' : 'Off'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-[#0ea5e9]/15 bg-white/5 p-6 shadow-[0_15px_60px_rgba(0,118,255,0.14)]">
            <h3 className="text-xl font-semibold">Language</h3>
            <p className="mt-2 text-sm text-[#B7C8DA]">Select your preferred language for AIM interactions.</p>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="mt-6 w-full rounded-3xl border border-[#0ea5e9]/15 bg-black/60 p-4 text-lg font-semibold text-[#E5EAF8] outline-none"
            >
              {['English', 'Swedish', 'Spanish'].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="rounded-[1.75rem] border border-[#0ea5e9]/15 bg-white/5 p-6 shadow-[0_15px_60px_rgba(0,118,255,0.14)]">
            <h3 className="text-xl font-semibold">Timezone</h3>
            <p className="mt-2 text-sm text-[#B7C8DA]">Keep AIM aligned with your location and deadlines.</p>
            <select
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              className="mt-6 w-full rounded-3xl border border-[#0ea5e9]/15 bg-black/60 p-4 text-lg font-semibold text-[#E5EAF8] outline-none"
            >
              {['Stockholm (GMT+2)', 'London (GMT+1)', 'New York (GMT-4)', 'Los Angeles (GMT-7)'].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-[#0ea5e9]/15 bg-white/5 p-6 shadow-[0_15px_60px_rgba(0,118,255,0.14)]">
            <h3 className="text-xl font-semibold">Connected accounts</h3>
            <p className="mt-2 text-sm text-[#B7C8DA]">Integrate streaming, distribution, and creative tools later.</p>
            <div className="mt-6 space-y-3">
              {['Spotify', 'Apple Music', 'Instagram'].map((account) => (
                <PrototypeAction
                  key={account}
                  label={`Connect ${account}`}
                  result="Connection queued"
                  title={`${account} prototype connection queued`}
                  message={`AIM created a prototype ${account} connection task for the integrations roadmap.`}
                  className="w-full rounded-3xl bg-black/60 p-4 text-left text-sm text-[#E5EAF8] transition hover:bg-[#0ea5ff]/10"
                />
              ))}
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-[#0ea5e9]/15 bg-white/5 p-6 shadow-[0_15px_60px_rgba(0,118,255,0.14)]">
            <h3 className="text-xl font-semibold">Data &amp; privacy</h3>
            <p className="mt-2 text-sm text-[#B7C8DA]">AIM will respect your music, your strategy and your privacy.</p>
            <PrototypeAction
              label="Review privacy settings"
              result="Privacy review opened"
              title="Privacy settings prototype opened"
              message="Alex prepared a prototype privacy review covering stored assets, chat history and integration permissions."
              className="mt-6 w-full rounded-3xl bg-black/60 p-4 text-left text-sm text-[#E5EAF8] transition hover:bg-[#0ea5ff]/10"
            />
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-[#0ea5e9]/15 bg-black/60 p-6 shadow-[0_15px_60px_rgba(0,118,255,0.14)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-[#B7C8DA]">Current prototype settings: {language}, {timezone}, {Object.values(notifications).filter(Boolean).length}/3 notifications on.</p>
            <PrototypeAction
              label="Save settings"
              result="Settings saved"
              title="AIM settings saved"
              message="Your prototype settings were saved for this AIM session."
            />
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
