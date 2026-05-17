'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SectionLayout from '@/components/SectionLayout';
import { studioSongs as defaultSongs, type Song } from '@/lib/mockData';

type SongDetailProps = {
  params: {
    id: string;
  };
};

export default function SongDetailPage({ params }: SongDetailProps) {
  const [song, setSong] = useState<Song | undefined>(undefined);
  const [localAssets, setLocalAssets] = useState<Song[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem('aimStudioSongs');
    if (stored) {
      setLocalAssets(JSON.parse(stored) as Song[]);
    }
  }, []);

  useEffect(() => {
    const uploaded = localAssets.find((item) => item.id === params.id);
    const mock = defaultSongs.find((item) => item.id === params.id);
    setSong(uploaded || mock);
  }, [localAssets, params.id]);

  if (!song) {
    return (
      <SectionLayout title="Song not found" subtitle="We could not find this track in your library.">
        <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-8 text-center text-[#B7C8DA]">
          <p>Return to Studio Songs and choose another track.</p>
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout title={song.title} subtitle={`Deep track view for ${song.title}.`}>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-white/[0.04] p-8 shadow-[0_20px_90px_rgba(10,132,255,0.14)] backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">{song.status}</p>
                <h2 className="mt-3 text-4xl font-semibold text-white">{song.title}</h2>
                <p className="mt-3 text-sm text-[#B7C8DA]">AIM suggests focusing on artwork, metadata and outreach for this track.</p>
              </div>
              <div className="rounded-[2rem] bg-[#0ea5ff]/10 px-4 py-3 text-sm font-semibold text-[#D7E6FF]">
                {song.genre}
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] bg-[#041227]/95 p-5 text-sm text-[#D7E6FF]">
                <p className="text-xs uppercase tracking-[0.3em] text-[#8ec6ff]">Artist</p>
                <p className="mt-3 text-lg font-semibold text-white">{song.artist}</p>
              </div>
              <div className="rounded-[1.75rem] bg-[#041227]/95 p-5 text-sm text-[#D7E6FF]">
                <p className="text-xs uppercase tracking-[0.3em] text-[#8ec6ff]">Upload date</p>
                <p className="mt-3 text-lg font-semibold text-white">{song.uploadDate}</p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                `BPM ${song.bpm}`,
                `Key ${song.key}`,
                `Mood ${song.mood}`,
              ].map((item) => (
                <div key={item} className="rounded-[1.75rem] bg-[#061229]/95 p-4 text-sm text-[#D7E6FF]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-8 shadow-[0_20px_90px_rgba(10,132,255,0.16)] backdrop-blur-xl">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <h3 className="text-2xl font-semibold text-white">Track notes</h3>
                <p className="mt-4 text-sm text-[#B7C8DA]">{song.notes}</p>
              </div>
              <div className="rounded-[1.75rem] bg-[#041227]/95 p-6 text-sm text-[#D7E6FF]">
                <p className="text-xs uppercase tracking-[0.3em] text-[#8ec6ff]">Collaborators</p>
                <p className="mt-3 text-lg font-semibold text-white">{song.collaborators}</p>
              </div>
            </div>
            <div className="mt-8 space-y-5">
              <div className="rounded-[1.75rem] bg-[#061229]/95 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Release readiness</p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#0ea5ff] via-[#4fb3ff] to-[#7ad6ff]" style={{ width: `${song.status === 'released' ? 100 : song.status === 'mastering' ? 75 : song.status === 'mixing' ? 55 : song.status === 'in progress' ? 35 : 20}%` }} />
                </div>
              </div>
              <div className="rounded-[1.75rem] bg-[#061229]/95 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">AI manager suggestions</p>
                <ul className="mt-4 space-y-3 text-sm text-[#D7E6FF]">
                  <li>• This track may fit Nordic synth playlists.</li>
                  <li>• You still need artwork and metadata.</li>
                  <li>• This could be ready for release in 2 weeks.</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Build release plan', 'Start campaign', 'Draft outreach', 'Move to release'].map((label) => (
                <button key={label} className="rounded-full bg-[#0ea5ff] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#12b0ff]">
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-[#041227]/95 p-6 shadow-[0_20px_90px_rgba(10,132,255,0.14)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Artwork</p>
            <div className="mt-4 h-48 rounded-[1.75rem] bg-white/5" />
            <p className="mt-4 text-sm text-[#B7C8DA]">Add final artwork here to keep the release timeline moving. AIM will ask when assets are missing.</p>
          </div>

          <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-6 shadow-[0_20px_90px_rgba(10,132,255,0.16)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Campaign quick view</p>
            <div className="mt-5 space-y-3 text-sm text-[#D7E6FF]">
              <p>Artwork ready: {song.status === 'released' ? '100%' : '55%'}</p>
              <p>Metadata complete: {song.status === 'released' ? '100%' : '65%'}</p>
              <p>Press ready: {song.status === 'released' ? '100%' : '25%'}</p>
              <p>Playlist fit: synth / pop / chillwave</p>
            </div>
          </div>
        </aside>
      </div>
    </SectionLayout>
  );
}
