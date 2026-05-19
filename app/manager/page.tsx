'use client';

import { useEffect, useMemo, useState } from 'react';
import SectionLayout from '@/components/SectionLayout';
import PrototypeAction from '@/components/PrototypeAction';

type ManagerType = 'supportive' | 'strategic' | 'hard-driving';

type ManagerPreset = {
  id: ManagerType;
  label: 'Supportive' | 'Strategic' | 'Hard-driving';
  description: string;
  preview: string;
  read: string;
  pushIntensity: number;
  directness: number;
  emotionalSensitivity: number;
  communicationTone: string;
  initiative: string;
  checkInFrequency: string;
  accountabilityLevel: string;
};

const managerPresets: ManagerPreset[] = [
  {
    id: 'supportive',
    label: 'Supportive',
    description: 'A calm, empathetic manager who helps you move without overwhelm.',
    preview: 'I hear you. Let’s make the next move smaller before we push.',
    read: 'Warm, steady and emotionally aware. Best when you want momentum without pressure spirals.',
    pushIntensity: 42,
    directness: 48,
    emotionalSensitivity: 90,
    communicationTone: 'Gentle',
    initiative: 'Suggest next moves',
    checkInFrequency: 'Twice a week',
    accountabilityLevel: 'Light touch',
  },
  {
    id: 'strategic',
    label: 'Strategic',
    description: 'A career-focused manager who thinks in positioning, timing and long-term growth.',
    preview: 'If I were managing this, I’d start with positioning and the release window.',
    read: 'Career-focused and business fluent. Best when you want smarter tradeoffs, rollout logic and long-range direction.',
    pushIntensity: 64,
    directness: 68,
    emotionalSensitivity: 64,
    communicationTone: 'Direct',
    initiative: 'Create drafts',
    checkInFrequency: 'Twice a week',
    accountabilityLevel: 'Firm follow-up',
  },
  {
    id: 'hard-driving',
    label: 'Hard-driving',
    description: 'A direct accountability manager who pushes momentum and execution.',
    preview: 'What is blocking movement right now? Name it, then we move.',
    read: 'Direct, deadline-aware and execution-focused. Best when you want push, accountability and fewer soft excuses.',
    pushIntensity: 88,
    directness: 92,
    emotionalSensitivity: 46,
    communicationTone: 'Executive',
    initiative: 'Act like a co-manager',
    checkInFrequency: 'Every weekday',
    accountabilityLevel: 'No drift',
  },
];

const checkInOptions = ['Quiet weekly', 'Twice a week', 'Every weekday', 'Launch-window daily'];
const communicationTones = ['Gentle', 'Clear', 'Direct', 'Executive'];
const initiativeLevels = ['Wait for me', 'Suggest next moves', 'Create drafts', 'Act like a co-manager'];
const accountabilityLevels = ['Light touch', 'Steady nudges', 'Firm follow-up', 'No drift'];
const managerSettingsStorageKey = 'aimManagerSettings';

const initiativeByLabel: Record<string, 'low' | 'medium' | 'high'> = {
  'Wait for me': 'low',
  'Suggest next moves': 'medium',
  'Create drafts': 'high',
  'Act like a co-manager': 'high',
};

const honestyByAccountability: Record<string, 'gentle' | 'balanced' | 'blunt'> = {
  'Light touch': 'gentle',
  'Steady nudges': 'balanced',
  'Firm follow-up': 'balanced',
  'No drift': 'blunt',
};

const modeIdsByLabel: Record<string, ManagerType> = {
  Supportive: 'supportive',
  Strategic: 'strategic',
  'Hard-driving': 'hard-driving',
  Tactical: 'hard-driving',
  'Label Advisor': 'strategic',
};

export default function ManagerPage() {
  const [selectedMode, setSelectedMode] = useState<ManagerType>('strategic');
  const [pushIntensity, setPushIntensity] = useState(64);
  const [directness, setDirectness] = useState(68);
  const [emotionalSensitivity, setEmotionalSensitivity] = useState(64);
  const [communicationTone, setCommunicationTone] = useState('Direct');
  const [initiative, setInitiative] = useState('Create drafts');
  const [checkInFrequency, setCheckInFrequency] = useState('Twice a week');
  const [accountabilityLevel, setAccountabilityLevel] = useState('Firm follow-up');
  const [settingsReady, setSettingsReady] = useState(false);

  const currentPreset = managerPresets.find((preset) => preset.id === selectedMode) || managerPresets[1];
  const persistedManagerSettings = useMemo(() => ({
    archetype: currentPreset.label,
    pushIntensity,
    directness,
    emotionalSensitivity,
    initiative: initiativeByLabel[initiative] || 'medium',
    honestyStyle: honestyByAccountability[accountabilityLevel] || 'balanced',
    checkInFrequency,
    communicationTone,
    accountabilityLevel,
  }), [accountabilityLevel, checkInFrequency, communicationTone, currentPreset.label, directness, emotionalSensitivity, initiative, pushIntensity]);

  const applyPreset = (preset: ManagerPreset) => {
    setSelectedMode(preset.id);
    setPushIntensity(preset.pushIntensity);
    setDirectness(preset.directness);
    setEmotionalSensitivity(preset.emotionalSensitivity);
    setCommunicationTone(preset.communicationTone);
    setInitiative(preset.initiative);
    setCheckInFrequency(preset.checkInFrequency);
    setAccountabilityLevel(preset.accountabilityLevel);
  };

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      const stored = window.localStorage.getItem(managerSettingsStorageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Partial<typeof persistedManagerSettings>;
          const modeId = modeIdsByLabel[String(parsed.archetype || '')];
          const preset = managerPresets.find((item) => item.id === modeId);
          if (preset) setSelectedMode(preset.id);
          if (typeof parsed.pushIntensity === 'number') setPushIntensity(parsed.pushIntensity);
          if (typeof parsed.directness === 'number') setDirectness(parsed.directness);
          if (typeof parsed.emotionalSensitivity === 'number') setEmotionalSensitivity(parsed.emotionalSensitivity);
          const initiativeLabel = Object.entries(initiativeByLabel).find(([, value]) => value === parsed.initiative)?.[0];
          if (initiativeLabel && initiativeLevels.includes(initiativeLabel)) setInitiative(initiativeLabel);
          if (typeof parsed.checkInFrequency === 'string' && checkInOptions.includes(parsed.checkInFrequency)) setCheckInFrequency(parsed.checkInFrequency);
          if (typeof parsed.communicationTone === 'string' && communicationTones.includes(parsed.communicationTone)) setCommunicationTone(parsed.communicationTone);
          if (typeof parsed.accountabilityLevel === 'string' && accountabilityLevels.includes(parsed.accountabilityLevel)) setAccountabilityLevel(parsed.accountabilityLevel);
        } catch {}
      }
      setSettingsReady(true);
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!settingsReady) return;
    // TODO: Replace localStorage with manager settings persistence in the artist profile database.
    window.localStorage.setItem(managerSettingsStorageKey, JSON.stringify(persistedManagerSettings));
  }, [persistedManagerSettings, settingsReady]);

  return (
    <SectionLayout
      title="Manager"
      subtitle="Choose the type of manager relationship you want, then fine-tune the pressure, tone and follow-through."
    >
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-violet-300/15 bg-[#080713]/95 p-6 shadow-[0_24px_90px_rgba(109,40,217,0.22)] backdrop-blur-xl">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Manager type</p>
              <h2 className="mt-3 text-4xl font-semibold text-white">How should Alex manage you?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#B7C8DA]">
                Pick a clear manager type. Alex will use it in chat, then you can adjust the relationship controls manually.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-violet-200">Current relationship</p>
              <p className="mt-3 text-2xl font-semibold text-white">{currentPreset.label}</p>
              <p className="mt-3 text-sm leading-6 text-[#B7C8DA]">{currentPreset.read}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-violet-300/15 bg-[#070816]/88 p-6 shadow-[0_24px_90px_rgba(109,40,217,0.2)] backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Choose Alex</p>
          <div className="mt-5 grid gap-4 xl:grid-cols-3">
            {managerPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`min-h-[260px] rounded-[1.75rem] border p-6 text-left transition ${
                  selectedMode === preset.id
                    ? 'border-violet-300/55 bg-violet-500/15 shadow-[0_22px_70px_rgba(139,92,246,0.22)]'
                    : 'border-white/10 bg-[#0A0B1B]/95 hover:border-violet-300/30 hover:bg-violet-500/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-2xl font-semibold text-white">{preset.label}</span>
                  {selectedMode === preset.id ? (
                    <span className="rounded-full bg-gradient-to-br from-violet-400 via-indigo-500 to-cyan-300 px-3 py-1 text-xs font-semibold text-white">Selected</span>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-[#B7C8DA]">{preset.description}</p>
                <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-black/30 px-4 py-4 text-sm leading-6 text-[#D7E6FF]">
                  “{preset.preview}”
                </div>
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.65fr]">
          <section className="rounded-[2rem] border border-violet-300/15 bg-[#070816]/88 p-6 shadow-[0_24px_90px_rgba(109,40,217,0.2)] backdrop-blur-xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Relationship controls</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Fine-tune the preset</h3>
              </div>
              <span className="rounded-full bg-violet-500/12 px-3 py-1 text-xs uppercase tracking-[0.22em] text-violet-100">
                {currentPreset.label}
              </span>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-6">
              <SliderControl label="Push intensity" value={pushIntensity} onChange={setPushIntensity} detail="How much Alex should challenge drift, missed deadlines and vague plans." />
              <SliderControl label="Directness" value={directness} onChange={setDirectness} detail="How plainly Alex should call the next move, blocker or weak spot." />
              <SliderControl label="Emotional sensitivity" value={emotionalSensitivity} onChange={setEmotionalSensitivity} detail="How carefully Alex should read pressure before giving advice." />

              <ControlSelect label="Communication tone" value={communicationTone} options={communicationTones} onChange={setCommunicationTone} />
              <ControlSelect label="Initiative" value={initiative} options={initiativeLevels} onChange={setInitiative} />
              <ControlSelect label="Check-in frequency" value={checkInFrequency} options={checkInOptions} onChange={setCheckInFrequency} />
              <ControlSelect label="Accountability level" value={accountabilityLevel} options={accountabilityLevels} onChange={setAccountabilityLevel} />
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-violet-300/15 bg-[#090A1A]/95 p-6 shadow-[0_24px_90px_rgba(109,40,217,0.2)] backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Live preview</p>
              <div className="mt-5 rounded-[1.75rem] border border-white/10 bg-black/45 p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-violet-200">Alex would say</p>
                <p className="mt-4 text-2xl font-semibold leading-tight text-white">“{currentPreset.preview}”</p>
                <p className="mt-4 text-sm leading-6 text-[#B7C8DA]">
                  {pushIntensity}% push, {directness}% directness, {emotionalSensitivity}% emotional sensitivity.
                </p>
              </div>
              <div className="mt-5 rounded-[1.5rem] border border-violet-300/15 bg-[#0A0B1B]/95 p-4 text-sm leading-6 text-[#D7E6FF]">
                If you miss a release task, Alex will respond as {currentPreset.label.toLowerCase()} with {checkInFrequency.toLowerCase()} check-ins and {accountabilityLevel.toLowerCase()} accountability.
              </div>
            </section>

            <section className="rounded-[2rem] border border-violet-300/15 bg-[#070816]/88 p-6 shadow-[0_24px_90px_rgba(109,40,217,0.2)] backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Saved to chat</p>
              <p className="mt-4 text-sm leading-6 text-[#B7C8DA]">
                This prototype stores the manager type and control values locally. Homepage chat sends them with every Alex request.
              </p>
              <PrototypeAction
                label="Confirm manager settings"
                result="Relationship saved"
                title={`${currentPreset.label} manager relationship saved`}
                message={`Alex is configured for ${pushIntensity}% push intensity, ${directness}% directness, ${emotionalSensitivity}% emotional sensitivity, ${initiative.toLowerCase()}, ${checkInFrequency.toLowerCase()} check-ins and ${accountabilityLevel.toLowerCase()} accountability.`}
                className="mt-5 w-full rounded-full bg-gradient-to-br from-violet-400 via-indigo-500 to-cyan-300 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.24)] transition hover:brightness-110"
              />
            </section>
          </aside>
        </div>
      </div>
    </SectionLayout>
  );
}

type SliderControlProps = {
  label: string;
  value: number;
  detail: string;
  onChange: (value: number) => void;
};

function SliderControl({ label, value, detail, onChange }: SliderControlProps) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#0A0B1B]/95 p-5 xl:col-span-2">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-white">{label}</p>
          <p className="mt-2 text-sm leading-6 text-[#B7C8DA]">{detail}</p>
        </div>
        <span className="rounded-full bg-violet-500/12 px-3 py-1 text-xs text-violet-100">{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-6 w-full accent-violet-400"
      />
    </div>
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
    <label className="rounded-[1.5rem] border border-white/10 bg-[#0A0B1B]/95 p-5">
      <span className="block text-xs uppercase tracking-[0.26em] text-violet-200">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-4 w-full rounded-[1.1rem] border border-white/10 bg-black/45 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-300/45"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
