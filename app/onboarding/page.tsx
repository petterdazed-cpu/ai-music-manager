'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';

type OnboardingQuestion = {
  key: string;
  question: string;
  placeholder: string;
};

const questions: OnboardingQuestion[] = [
  { key: 'artistName', question: 'What name do you release music under?', placeholder: 'Aurora Lane' },
  { key: 'musicType', question: 'What kind of music do you make?', placeholder: 'Cinematic synth pop with Nordic electronic influences' },
  { key: 'location', question: 'Where are you based?', placeholder: 'Stockholm, Sweden' },
  { key: 'currentBuild', question: 'What are you trying to build right now?', placeholder: 'My next release campaign and a stronger live circuit' },
  { key: 'upcomingRelease', question: 'Do you have an upcoming release?', placeholder: 'Yes, a single in June' },
  { key: 'hardestThing', question: 'What feels hardest right now?', placeholder: 'Knowing what to prioritize and how to pitch it' },
  { key: 'managerStyle', question: 'How do you want me to manage you — supportive, strategic, or hard-driving?', placeholder: 'Strategic' },
];

const managerStyleToArchetype: Record<string, string> = {
  supportive: 'Supportive',
  strategic: 'Strategic',
  'hard-driving': 'Hard-driving',
  harddriving: 'Hard-driving',
  tactical: 'Hard-driving',
  'label advisor': 'Strategic',
  'label-advisor': 'Strategic',
  labeladvisor: 'Strategic',
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [value, setValue] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const currentQuestion = questions[step];
  const progress = Math.round(((step + 1) / questions.length) * 100);

  const introMessage = useMemo(() => (
    "Hey. I’m Alex. Before we start planning anything, I want to understand where you are as an artist."
  ), []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim()) return;

    const nextAnswers = { ...answers, [currentQuestion.key]: value.trim() };

    if (step < questions.length - 1) {
      setAnswers(nextAnswers);
      setValue('');
      setStep((current) => current + 1);
      return;
    }

    const styleKey = value.trim().toLowerCase();
    const archetype = managerStyleToArchetype[styleKey] || 'Strategic';

    // TODO: Persist artist profile in a real artist profile database.
    // TODO: Add persistent memory and onboarding completion state.
    // TODO: Connect onboarding profile directly into Alex prompt context on the server.
    window.localStorage.setItem('artistProfile', JSON.stringify(nextAnswers));
    window.localStorage.setItem('aimOnboardingComplete', 'true');
    window.localStorage.setItem('aimManagerSettings', JSON.stringify({
      archetype,
      pushIntensity: archetype === 'Hard-driving' ? 85 : archetype === 'Supportive' ? 40 : 62,
      directness: archetype === 'Hard-driving' ? 90 : archetype === 'Supportive' ? 45 : 70,
      emotionalSensitivity: archetype === 'Supportive' ? 90 : archetype === 'Hard-driving' ? 45 : 70,
      initiative: archetype === 'Hard-driving' ? 'high' : 'medium',
      honestyStyle: archetype === 'Hard-driving' ? 'blunt' : 'balanced',
    }));
    router.push('/');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#03030b] px-6 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center_top,rgba(139,92,246,0.18),transparent_32%),radial-gradient(circle_at_bottom,rgba(37,99,235,0.08),transparent_42%)]" />
      <section className="relative grid w-full max-w-[960px] gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-violet-300/15 bg-[#080713]/95 p-7 shadow-[0_30px_120px_rgba(109,40,217,0.24)] backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Alex onboarding</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Build your artist profile.</h1>
          <p className="mt-4 text-sm leading-6 text-[#B7C8DA]">
            Alex will use this prototype profile to make the homepage and chat feel more personal.
          </p>
          <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-br from-violet-400 via-indigo-500 to-cyan-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.24em] text-violet-200">{progress}% complete</p>
        </div>

        <div className="rounded-[2rem] border border-violet-300/15 bg-[#070816]/88 p-6 shadow-[0_24px_90px_rgba(109,40,217,0.2)] backdrop-blur-xl">
          <div className="space-y-4">
            <div className="max-w-[86%] rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm leading-6 text-[#D7E6FF]">
              {introMessage}
            </div>
            <div className="max-w-[86%] rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm leading-6 text-[#D7E6FF]">
              {currentQuestion.question}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <textarea
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={currentQuestion.placeholder}
              className="min-h-[120px] w-full resize-none rounded-[1.35rem] border border-white/10 bg-[#0A0B1B]/96 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-[#7f9fbe] focus:border-violet-300/45 focus:ring-2 focus:ring-violet-500/15"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => {
                  const previousStep = Math.max(0, step - 1);
                  setStep(previousStep);
                  setValue(answers[questions[previousStep].key] || '');
                }}
                className="rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-[#D7E6FF] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!value.trim()}
                className="rounded-full bg-gradient-to-br from-violet-400 via-indigo-500 to-cyan-300 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {step === questions.length - 1 ? 'Finish onboarding' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
