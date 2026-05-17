'use client';

import { useState } from 'react';
import SectionLayout from '@/components/SectionLayout';
import PrototypeAction from '@/components/PrototypeAction';

type ManagerMode = {
  id: string;
  label: string;
  description: string;
  preview: string;
  read: string;
};

const managerModes: ManagerMode[] = [
  {
    id: 'supportive',
    label: 'Supportive',
    description: 'Warm, steady, emotionally grounded. Alex helps you move without pressure spirals.',
    preview: "Let's break this down.",
    read: 'Best when you need clarity, confidence and a calmer path through the work.',
  },
  {
    id: 'tactical',
    label: 'Tactical',
    description: 'Practical and execution-led. Alex turns vague goals into next actions and deadlines.',
    preview: 'Here are the three moves I would make today.',
    read: 'Best when you know the direction but need momentum, sequencing and clean decisions.',
  },
  {
    id: 'hard-driving',
    label: 'Hard-driving',
    description: 'Direct, accountable and deadline-aware. Alex keeps promises visible.',
    preview: 'We said Friday.',
    read: 'Best when you want pressure, follow-through and fewer soft excuses around the plan.',
  },
  {
    id: 'strategic',
    label: 'Strategic',
    description: 'Zoomed-out, positioning-focused and calm. Alex protects the bigger career arc.',
    preview: "Let's zoom out.",
    read: 'Best when you need release timing, audience fit and brand direction before execution.',
  },
  {
    id: 'label-advisor',
    label: 'Label Advisor',
    description: 'Commercial, analytical and industry fluent. Alex thinks like an A&R and campaign lead.',
    preview: 'The signal is good, but the positioning needs to be sharper.',
    read: 'Best when you want market reads, rollout logic, pitch angles and hard commercial calls.',
  },
];

const checkInOptions = ['Quiet weekly', 'Twice a week', 'Every weekday', 'Launch-window daily'];
const communicationTones = ['Gentle', 'Clear', 'Direct', 'Executive'];
const initiativeLevels = ['Wait for me', 'Suggest next moves', 'Create drafts', 'Act like a co-manager'];
const accountabilityLevels = ['Light touch', 'Steady nudges', 'Firm follow-up', 'No drift'];

export default function ManagerPage() {
  const [selectedMode, setSelectedMode] = useState('strategic');
  const [pushIntensity, setPushIntensity] = useState(62);
  const [communicationTone, setCommunicationTone] = useState('Direct');
  const [initiative, setInitiative] = useState('Create drafts');
  const [checkInFrequency, setCheckInFrequency] = useState('Twice a week');
  const [accountabilityLevel, setAccountabilityLevel] = useState('Steady nudges');

  const currentMode = managerModes.find((mode) => mode.id === selectedMode) || managerModes[0];

  return (
    <SectionLayout
      title="Manager"
      subtitle="Configure the relationship, not the software. Decide how Alex should support, challenge and follow through with you."
    >
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-[#0ea5e9]/15 bg-[#030914]/95 p-6 shadow-[0_24px_90px_rgba(10,132,255,0.18)] backdrop-blur-xl">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Manager relationship</p>
              <h2 className="mt-3 text-4xl font-semibold text-white">How should Alex manage you?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#B7C8DA]">
                Tune the emotional pressure, tone, initiative and accountability you want from a premium artist manager.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8ec6ff]">Current relationship</p>
              <p className="mt-3 text-2xl font-semibold text-white">{currentMode.label}</p>
              <p className="mt-3 text-sm leading-6 text-[#B7C8DA]">{currentMode.read}</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-6 shadow-[0_20px_80px_rgba(10,132,255,0.16)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Modes</p>
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {managerModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedMode(mode.id)}
                  className={`rounded-[1.5rem] border p-5 text-left transition ${
                    selectedMode === mode.id
                      ? 'border-[#0ea5ff]/45 bg-[#0ea5ff]/15 shadow-[0_16px_55px_rgba(14,165,255,0.15)]'
                      : 'border-white/10 bg-[#061229]/95 hover:border-[#0ea5ff]/30 hover:bg-[#0ea5ff]/5'
                  }`}
                >
                  <span className="text-lg font-semibold text-white">{mode.label}</span>
                  <span className="mt-2 block text-sm leading-6 text-[#B7C8DA]">{mode.description}</span>
                  <span className="mt-4 block rounded-[1.1rem] border border-white/10 bg-black/30 px-4 py-3 text-sm text-[#D7E6FF]">
                    {`"${mode.preview}"`}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-[#0ea5e9]/15 bg-[#041227]/95 p-6 shadow-[0_20px_80px_rgba(10,132,255,0.16)] backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Live preview</p>
              <div className="mt-5 rounded-[1.75rem] border border-white/10 bg-black/45 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-[#8ec6ff]">Alex would say</p>
                <p className="mt-4 text-3xl font-semibold leading-tight text-white">{`"${currentMode.preview}"`}</p>
                <p className="mt-4 text-sm leading-6 text-[#B7C8DA]">
                  Tone: {communicationTone}. Initiative: {initiative.toLowerCase()}. Accountability: {accountabilityLevel.toLowerCase()}.
                </p>
              </div>
              <div className="mt-5 rounded-[1.5rem] border border-[#0ea5e9]/15 bg-[#061229]/95 p-4 text-sm leading-6 text-[#D7E6FF]">
                If you miss a release task, Alex will respond with {pushIntensity}% push intensity and check in {checkInFrequency.toLowerCase()}.
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-6 shadow-[0_20px_80px_rgba(10,132,255,0.16)] backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Save relationship</p>
              <p className="mt-4 text-sm leading-6 text-[#B7C8DA]">
                This prototype saves the feel of the manager relationship and shows how Alex would adapt across releases, goals and career decisions.
              </p>
              <PrototypeAction
                label="Save manager relationship"
                result="Relationship saved"
                title={`${currentMode.label} manager relationship saved`}
                message={`Alex is now configured for ${pushIntensity}% push intensity, ${communicationTone.toLowerCase()} tone, ${initiative.toLowerCase()}, ${checkInFrequency.toLowerCase()} check-ins and ${accountabilityLevel.toLowerCase()} accountability.`}
                className="mt-5 w-full rounded-full bg-[#0ea5ff] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#12b0ff]"
              />
            </section>
          </aside>
        </div>

        <section className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-6 shadow-[0_20px_80px_rgba(10,132,255,0.16)] backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Relationship controls</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Set the pressure and cadence</h3>
            </div>
            <span className="rounded-full bg-[#0ea5ff]/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#AED7FF]">
              {currentMode.label}
            </span>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-5">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#061229]/95 p-5 xl:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">Push intensity</p>
                  <p className="mt-2 text-sm leading-6 text-[#B7C8DA]">How much Alex should challenge drift, missed deadlines and vague plans.</p>
                </div>
                <span className="rounded-full bg-[#0ea5ff]/10 px-3 py-1 text-xs text-[#AED7FF]">{pushIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={pushIntensity}
                onChange={(event) => setPushIntensity(Number(event.target.value))}
                className="mt-6 w-full accent-[#0ea5ff]"
              />
            </div>

            <ControlSelect
              label="Communication tone"
              value={communicationTone}
              options={communicationTones}
              onChange={setCommunicationTone}
            />
            <ControlSelect
              label="Initiative"
              value={initiative}
              options={initiativeLevels}
              onChange={setInitiative}
            />
            <ControlSelect
              label="Check-in frequency"
              value={checkInFrequency}
              options={checkInOptions}
              onChange={setCheckInFrequency}
            />
            <ControlSelect
              label="Accountability level"
              value={accountabilityLevel}
              options={accountabilityLevels}
              onChange={setAccountabilityLevel}
            />
          </div>
        </section>
      </div>
    </SectionLayout>
  );
}

type ControlSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function ControlSelect({ label, value, options, onChange }: ControlSelectProps) {
  return (
    <label className="rounded-[1.5rem] border border-white/10 bg-[#061229]/95 p-5">
      <span className="block text-xs uppercase tracking-[0.26em] text-[#8ec6ff]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-4 w-full rounded-[1.1rem] border border-white/10 bg-black/45 px-4 py-3 text-sm text-white outline-none transition focus:border-[#0ea5ff]/45"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
