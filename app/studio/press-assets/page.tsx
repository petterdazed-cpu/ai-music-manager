'use client';

import { useEffect, useState } from 'react';
import SectionLayout from '@/components/SectionLayout';
import PrototypeAction from '@/components/PrototypeAction';
import { pressAssets as defaultPressAssets, type PressAssets } from '@/lib/mockData';

const storageKey = 'aimPressAssets';

export default function StudioPressAssetsPage() {
  const [pressAssets, setPressAssets] = useState<PressAssets>(defaultPressAssets);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        setPressAssets(JSON.parse(stored) as PressAssets);
      }
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  const handleChange = (field: keyof PressAssets, value: string) => {
    const next = { ...pressAssets, [field]: value };
    setPressAssets(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  };

  return (
    <SectionLayout
      title="Press Assets"
      subtitle="Create and manage your artist bio, press kit and release materials in one place."
    >
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-white/[0.04] p-8 shadow-[0_20px_90px_rgba(10,132,255,0.14)] backdrop-blur-xl">
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-semibold">Press kit builder</h2>
                <p className="mt-3 text-sm text-[#B7C8DA]">Answer a few questions and let Alex shape your short bio, long bio, one sheet and press release.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-white">Artist name</label>
                  <input
                    value={pressAssets.artistBio.includes('Aurora Lane') ? 'Aurora Lane' : 'Aurora Lane'}
                    disabled
                    className="mt-3 w-full rounded-3xl border border-[#0ea5e9]/15 bg-[#041227]/95 px-4 py-3 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-white">Genre</label>
                  <input
                    value="Synth Pop"
                    disabled
                    className="mt-3 w-full rounded-3xl border border-[#0ea5e9]/15 bg-[#041227]/95 px-4 py-3 text-sm text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-[#041227]/95 p-6 shadow-[0_20px_90px_rgba(10,132,255,0.14)] backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-white">Artist bio</h3>
              <textarea
                value={pressAssets.artistBio}
                onChange={(event) => handleChange('artistBio', event.target.value)}
                className="mt-4 min-h-[140px] w-full rounded-[1.5rem] border border-[#0ea5e9]/15 bg-[#0c1729]/95 p-4 text-sm text-white outline-none"
              />
            </div>

            <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-[#041227]/95 p-6 shadow-[0_20px_90px_rgba(10,132,255,0.14)] backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-white">Short bio</h3>
              <textarea
                value={pressAssets.shortBio}
                onChange={(event) => handleChange('shortBio', event.target.value)}
                className="mt-4 min-h-[120px] w-full rounded-[1.5rem] border border-[#0ea5e9]/15 bg-[#0c1729]/95 p-4 text-sm text-white outline-none"
              />
            </div>

            <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-[#041227]/95 p-6 shadow-[0_20px_90px_rgba(10,132,255,0.14)] backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-white">Long bio</h3>
              <textarea
                value={pressAssets.longBio}
                onChange={(event) => handleChange('longBio', event.target.value)}
                className="mt-4 min-h-[160px] w-full rounded-[1.5rem] border border-[#0ea5e9]/15 bg-[#0c1729]/95 p-4 text-sm text-white outline-none"
              />
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-6 shadow-[0_20px_90px_rgba(10,132,255,0.16)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">One sheet</p>
            <textarea
              value={pressAssets.oneSheet}
              onChange={(event) => handleChange('oneSheet', event.target.value)}
              className="mt-4 min-h-[160px] w-full rounded-[1.5rem] border border-[#0ea5e9]/15 bg-[#0c1729]/95 p-4 text-sm text-white outline-none"
            />
          </div>

          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-[#041227]/95 p-6 shadow-[0_20px_90px_rgba(10,132,255,0.14)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Press release</p>
            <textarea
              value={pressAssets.pressRelease}
              onChange={(event) => handleChange('pressRelease', event.target.value)}
              className="mt-4 min-h-[140px] w-full rounded-[1.5rem] border border-[#0ea5e9]/15 bg-[#0c1729]/95 p-4 text-sm text-white outline-none"
            />
          </div>

          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-6 shadow-[0_20px_90px_rgba(10,132,255,0.16)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Contact details</p>
            <div className="mt-4 space-y-4 text-sm text-[#D7E6FF]">
              <label className="block text-xs uppercase tracking-[0.28em] text-[#8ec6ff]">Email</label>
              <input
                type="text"
                value={pressAssets.contactEmail}
                onChange={(event) => handleChange('contactEmail', event.target.value)}
                className="w-full rounded-3xl border border-[#0ea5e9]/15 bg-[#0c1729]/95 px-4 py-3 text-sm text-white outline-none"
              />
              <label className="block text-xs uppercase tracking-[0.28em] text-[#8ec6ff]">Phone</label>
              <input
                type="text"
                value={pressAssets.phone}
                onChange={(event) => handleChange('phone', event.target.value)}
                className="w-full rounded-3xl border border-[#0ea5e9]/15 bg-[#0c1729]/95 px-4 py-3 text-sm text-white outline-none"
              />
              <label className="block text-xs uppercase tracking-[0.28em] text-[#8ec6ff]">Social links</label>
              <input
                type="text"
                value={pressAssets.socials}
                onChange={(event) => handleChange('socials', event.target.value)}
                className="w-full rounded-3xl border border-[#0ea5e9]/15 bg-[#0c1729]/95 px-4 py-3 text-sm text-white outline-none"
              />
            </div>
            <PrototypeAction
              label="Export preview"
              result="Preview exported"
              title="Press preview created"
              message="Alex created a prototype press kit preview with your current bio, one sheet and contact details."
              fullWidth
              className="mt-6 w-full rounded-full bg-[#0ea5ff] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#12b0ff]"
            />
          </div>
        </aside>
      </div>
    </SectionLayout>
  );
}
