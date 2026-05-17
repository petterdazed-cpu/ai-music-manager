'use client';

import { useEffect, useRef, useState } from 'react';
import SectionLayout from '@/components/SectionLayout';
import { studioArtwork as defaultArtwork, type ArtworkAsset } from '@/lib/mockData';

const storageKey = 'aimStudioArtwork';

export default function StudioArtworkPage() {
  const [uploadedArtwork, setUploadedArtwork] = useState<ArtworkAsset[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      setUploadedArtwork(JSON.parse(stored) as ArtworkAsset[]);
    }
  }, []);

  const assets = [...defaultArtwork, ...uploadedArtwork];

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const nextUploads: ArtworkAsset[] = Array.from(files).map((file, index) => ({
      id: `art-${Date.now()}-${index}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      type: 'promo art',
      uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: 'draft',
      previewUrl: URL.createObjectURL(file),
    }));

    const updated = [...uploadedArtwork, ...nextUploads];
    setUploadedArtwork(updated);
    window.localStorage.setItem(storageKey, JSON.stringify(updated.map(({ previewUrl, ...rest }) => rest)));
    event.target.value = '';
  };

  return (
    <SectionLayout
      title="Artwork Library"
      subtitle="Upload cover art, promo visuals and press assets for your next release."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-white/[0.04] p-8 shadow-[0_20px_90px_rgba(10,132,255,0.14)] backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold">Visual assets</h2>
                <p className="mt-3 text-sm text-[#B7C8DA]">Keep artwork and moodboards aligned with your campaign and press strategy.</p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full bg-[#0ea5ff] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#12b0ff]"
              >
                Upload artwork
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {assets.map((asset) => (
              <div key={asset.id} className="rounded-[1.75rem] border border-[#0ea5e9]/15 bg-[#041227]/95 p-4 shadow-[0_15px_60px_rgba(0,118,255,0.14)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{asset.title}</h3>
                    <p className="mt-1 text-sm text-[#B7C8DA]">{asset.type}</p>
                  </div>
                  <span className="rounded-full bg-[#0ea5ff]/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-[#AED7FF]">{asset.status}</span>
                </div>
                <div className="mt-4 h-40 rounded-[1.5rem] bg-white/5" />
                <div className="mt-4 flex items-center justify-between text-sm text-[#D7E6FF]">
                  <span>{asset.uploadedDate}</span>
                  <span>Preview ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-6 shadow-[0_20px_90px_rgba(10,132,255,0.16)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">AI toolkit</p>
            <div className="mt-6 grid gap-3 text-sm text-[#D7E6FF]">
              {[
                'Suggest artwork improvements',
                'Resize for Spotify',
                'Resize for Instagram',
                'Resize for TikTok',
                'Generate campaign variations',
              ].map((feature) => (
                <div key={feature} className="rounded-[1.75rem] bg-[#061229]/95 px-4 py-4">
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-[#041227]/95 p-6 shadow-[0_20px_90px_rgba(10,132,255,0.14)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Workflow reminder</p>
            <p className="mt-4 text-sm text-[#B7C8DA]">Good visual assets make releases feel premium and help press, playlists and booking templates land faster.</p>
          </div>
        </aside>
      </div>
    </SectionLayout>
  );
}
