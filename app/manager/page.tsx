'use client';

import { useState } from 'react';
import SectionLayout from '@/components/SectionLayout';
import PrototypeAction from '@/components/PrototypeAction';
import { managerModes } from '@/lib/mockData';

export default function ManagerPage() {
  const [selectedMode, setSelectedMode] = useState(managerModes[1].id);
  const [pushLevel, setPushLevel] = useState(55);
  const [tone, setTone] = useState(45);
  const [followUpFrequency, setFollowUpFrequency] = useState('Medium');
  const [notificationStyle, setNotificationStyle] = useState('Gentle reminders');
  const [mainFocus, setMainFocus] = useState('Releases');

  const currentMode = managerModes.find((mode) => mode.id === selectedMode);

  return (
    <SectionLayout
      title="Manager"
      subtitle="Shape how Alex supports, challenges and follows up with your career." 
    >
      <div className="space-y-10">
        <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-white/[0.06] p-8 shadow-[0_20px_80px_rgba(10,132,255,0.18)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0ea5ff]/10 text-4xl text-[#0ea5ff]">A</div>
              <div>
                <h2 className="text-3xl font-semibold">Alex is your AI music manager</h2>
                <p className="mt-2 max-w-xl text-sm text-[#B7C8DA]">Fine-tune Alex’s personality, proactivity and cadence without losing the artistic flow.</p>
              </div>
            </div>
            <div className="rounded-[1.75rem] bg-[#041227]/95 p-5 text-sm text-[#D7E6FF]">
              <p className="uppercase tracking-[0.3em] text-[#8ec6ff]">Current mode</p>
              <p className="mt-3 text-lg font-semibold text-white">{currentMode?.label}</p>
              <p className="mt-2 text-sm text-[#B7C8DA]">{currentMode?.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-8 shadow-[0_15px_60px_rgba(0,118,255,0.16)]">
              <div className="space-y-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[#AED7FF]">Manager mode</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {managerModes.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSelectedMode(mode.id)}
                        className={`rounded-[1.5rem] border px-4 py-4 text-left text-sm transition ${selectedMode === mode.id ? 'border-[#0ea5ff]/40 bg-[#0ea5ff]/15 text-white' : 'border-white/10 bg-[#061229]/95 text-[#D7E6FF] hover:border-[#0ea5ff]/25'}`}
                      >
                        <span className="font-semibold">{mode.label}</span>
                        <span className="mt-2 block text-xs leading-5 text-[#B7C8DA]">{mode.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">Push intensity</h3>
                      <p className="mt-2 text-sm text-[#B7C8DA]">How strongly Alex should nudge you toward goals.</p>
                    </div>
                    <span className="rounded-full bg-[#0ea5ff]/10 px-3 py-1 text-xs text-[#AED7FF]">{pushLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={pushLevel}
                    onChange={(event) => setPushLevel(Number(event.target.value))}
                    className="mt-6 w-full accent-[#0ea5ff]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">Tone softness</h3>
                      <p className="mt-2 text-sm text-[#B7C8DA]">Choose whether Alex is direct, calm, or strategic.</p>
                    </div>
                    <span className="rounded-full bg-[#0ea5ff]/10 px-3 py-1 text-xs text-[#AED7FF]">{tone}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tone}
                    onChange={(event) => setTone(Number(event.target.value))}
                    className="mt-6 w-full accent-[#0ea5ff]"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-8 shadow-[0_15px_60px_rgba(0,118,255,0.16)]">
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-[#AED7FF]">Notification frequency</p>
                  <select
                    value={followUpFrequency}
                    onChange={(event) => setFollowUpFrequency(event.target.value)}
                    className="w-full rounded-3xl border border-[#0ea5e9]/15 bg-black/70 px-4 py-3 text-white outline-none"
                  >
                    {['Low', 'Medium', 'High'].map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-[#AED7FF]">Gesture style</p>
                  <select
                    value={notificationStyle}
                    onChange={(event) => setNotificationStyle(event.target.value)}
                    className="w-full rounded-3xl border border-[#0ea5e9]/15 bg-black/70 px-4 py-3 text-white outline-none"
                  >
                    {['Gentle reminders', 'Manager-style follow-ups', 'High-performance mode'].map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-[#AED7FF]">Current focus</p>
                  <select
                    value={mainFocus}
                    onChange={(event) => setMainFocus(event.target.value)}
                    className="w-full rounded-3xl border border-[#0ea5e9]/15 bg-black/70 px-4 py-3 text-white outline-none"
                  >
                    {['Releases', 'Promotion', 'Goals', 'Mentality', 'Career strategy'].map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[#0ea5e9]/15 bg-white/5 p-6 text-sm text-[#B7C8DA] shadow-[0_15px_60px_rgba(0,118,255,0.14)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-white">Manager settings prototype</p>
                <p className="mt-2">Current setup: {currentMode?.label}, {followUpFrequency.toLowerCase()} follow-ups, {notificationStyle.toLowerCase()}, focus on {mainFocus.toLowerCase()}.</p>
              </div>
              <PrototypeAction
                label="Save manager settings"
                result="Settings saved"
                title="Alex settings updated"
                message={`Alex is now in ${currentMode?.label} mode with ${followUpFrequency.toLowerCase()} follow-ups focused on ${mainFocus.toLowerCase()}.`}
              />
            </div>
            <ul className="mt-4 space-y-2 list-disc pl-5">
              <li>AIM will connect these settings to Alex’s follow-ups and outreach cadence.</li>
              <li>Future releases will send real email drafts, reminders and campaign prompts.</li>
              <li>Proactive check-ins, calendar awareness and task assignments will come next.</li>
            </ul>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
