'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SectionLayout from '@/components/SectionLayout';
import { studioSongs as defaultSongs, type Song } from '@/lib/mockData';

const storageKey = 'aimStudioSongs';

export default function StudioSongsPage() {
  const [uploadedSongs, setUploadedSongs] = useState<Song[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      setUploadedSongs(JSON.parse(stored) as Song[]);
    }
  }, []);

  const songs = [...defaultSongs, ...uploadedSongs];

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newSongs: Song[] = Array.from(files).map((file, index) => {
      const title = file.name.replace(/\.[^/.]+$/, '');
      return {
        id: `uploaded-${Date.now()}-${index}`,
        title,
        artist: 'Aurora Lane',
        bpm: 110,
        key: 'F#m',
        genre: 'Synth Pop',
        mood: 'Nocturnal',
        uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        notes: 'Imported audio file. Add metadata and artwork.',
        collaborators: 'Self',
        status: 'demo',
        fileName: file.name,
        previewUrl: URL.createObjectURL(file),
      };
    });

    const nextUploads = [...uploadedSongs, ...newSongs];
    setUploadedSongs(nextUploads);
    window.localStorage.setItem(storageKey, JSON.stringify(nextUploads));
    event.target.value = '';
  };

  return (
    <SectionLayout
      title="Songs Library"
      subtitle="Upload, organize and review your tracks in one actionable creative workspace."
    >
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-white/[0.04] p-8 shadow-[0_20px_90px_rgba(10,132,255,0.14)] backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold">Song library</h2>
                <p className="mt-3 text-sm text-[#B7C8DA]">Upload audio files to track your creative progress and connect songs to release planning.</p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full bg-[#0ea5ff] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#12b0ff]"
              >
                Upload song
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </div>

          <div className="grid gap-4">
            {songs.map((song) => (
              <Link
                key={song.id}
                href={`/studio/songs/${song.id}`}
                className="group rounded-[1.75rem] border border-[#0ea5e9]/15 bg-[#041227]/95 p-6 transition hover:border-[#0ea5ff]/30 hover:bg-[#0ea5ff]/5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">{song.status}</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">{song.title}</h3>
                    <p className="mt-2 text-sm text-[#B7C8DA]">{song.genre} · {song.mood} · {song.bpm} BPM · {song.key}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-[#0a1526]/95 px-4 py-3 text-sm text-[#D7E6FF]">
                    {song.uploadDate}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#AED7FF]">
                  <span>{song.artist}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0ea5ff]" />
                  <span>{song.collaborators}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-6 shadow-[0_20px_90px_rgba(10,132,255,0.16)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Your pipeline</p>
            <div className="mt-6 space-y-4 text-sm text-[#D7E6FF]">
              <p>Track progress across demo, mixing and master stages.</p>
              <p>Use uploaded songs to start campaign planning, press pitches and playlist outreach.</p>
            </div>
            <div className="mt-6 grid gap-3">
              {['Build release plan', 'Draft outreach', 'Move to release', 'Review artwork needs'].map((label) => (
                <button key={label} className="rounded-full bg-[#0ea5ff]/10 px-4 py-3 text-sm font-semibold text-[#D7E6FF] transition hover:bg-[#0ea5ff]/15">
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-[#041227]/95 p-6 shadow-[0_20px_90px_rgba(10,132,255,0.14)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">AI manager assist</p>
            <h3 className="mt-4 text-2xl font-semibold text-white">Track release readiness</h3>
            <p className="mt-3 text-sm text-[#B7C8DA]">Alex will remind you when metadata, artwork or campaign planning still need attention.</p>
            <div className="mt-6 space-y-3 rounded-[1.75rem] bg-[#061229]/95 p-4 text-sm text-[#D7E6FF]">
              <p>“This track may fit Nordic synth playlists.”</p>
              <p>“You still need artwork and metadata.”</p>
              <p>“This could be ready for release in 2 weeks.”</p>
            </div>
          </div>
        </aside>
      </div>
    </SectionLayout>
  );
}
