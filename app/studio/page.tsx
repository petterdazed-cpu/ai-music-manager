'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import SectionLayout from '@/components/SectionLayout';
import PrototypeAction from '@/components/PrototypeAction';
import type { Song } from '@/lib/mockData';

type WorkspaceTab = 'Demos' | 'In Progress' | 'Released' | 'Collaborations' | 'Assets';

type WorkspaceSong = {
  id: string;
  title: string;
  status: WorkspaceTab;
  genre: string;
  bpm: number;
  lastUpdated: string;
  notes: string;
  alexRecommendation: string;
  collaborators?: string;
  assets?: string;
};

const tabs: WorkspaceTab[] = ['Demos', 'In Progress', 'Released', 'Collaborations', 'Assets'];
const studioSongsStorageKey = 'aimStudioSongs';

const initialSongs: WorkspaceSong[] = [
  {
    id: 'northern-lights',
    title: 'Northern Lights',
    status: 'Demos',
    genre: 'Nordic Synth Pop',
    bpm: 108,
    lastUpdated: 'Today',
    notes: 'Strong verse atmosphere. Chorus needs a cleaner lift before this becomes a release candidate.',
    alexRecommendation: 'Keep this in demos. Tighten the hook, then test it against two playlist references.',
  },
  {
    id: 'midnight-drive',
    title: 'Midnight Drive',
    status: 'In Progress',
    genre: 'Alternative Pop',
    bpm: 116,
    lastUpdated: 'Yesterday',
    notes: 'Lead vocal is working. Bridge still feels long and the second chorus needs more urgency.',
    alexRecommendation: 'Cut 8 bars from the bridge and prep a rough master for feedback this week.',
    collaborators: 'Lina - topline, Max - mix notes',
  },
  {
    id: 'afterglow',
    title: 'Afterglow',
    status: 'Released',
    genre: 'Cinematic Electro Pop',
    bpm: 122,
    lastUpdated: 'May 10',
    notes: 'Released single with strong save rate and good fit for late-night electronic playlists.',
    alexRecommendation: 'Turn the response into momentum: pitch 12 curators and cut 3 short-form clips.',
    assets: 'Cover art, clean master, canvas, press quote',
  },
];

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('Demos');
  const [songs, setSongs] = useState<WorkspaceSong[]>(initialSongs);
  const [uploadStep, setUploadStep] = useState(1);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftGenre, setDraftGenre] = useState('Synth Pop');
  const [draftBpm, setDraftBpm] = useState(112);
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const visibleSongs = useMemo(() => {
    if (activeTab === 'Collaborations') return songs.filter((song) => song.collaborators);
    if (activeTab === 'Assets') return songs.filter((song) => song.assets || song.status === 'Released');
    return songs.filter((song) => song.status === activeTab);
  }, [activeTab, songs]);

  const handleMockUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
    setSelectedFileName(file.name);
    setDraftTitle(title || 'Untitled demo');
    setUploadStep(2);
    setUploadMessage('Audio received. Add the basics so Alex can place it in the right lane.');
    event.target.value = '';
  };

  const saveUploadedSong = () => {
    const id = `uploaded-${Date.now()}`;
    const nextSong: WorkspaceSong = {
      id,
      title: draftTitle || 'Untitled demo',
      status: 'Demos',
      genre: draftGenre,
      bpm: draftBpm,
      lastUpdated: 'Just now',
      notes: selectedFileName ? `Imported from ${selectedFileName}. Needs first-pass notes, artwork direction and release fit.` : 'Imported demo. Needs first-pass notes, artwork direction and release fit.',
      alexRecommendation: 'Do not rush this into release. First pass: mark the strongest hook, pick two references and decide if this is single material.',
    };
    const librarySong: Song = {
      id,
      title: nextSong.title,
      artist: 'Aurora Lane',
      bpm: nextSong.bpm,
      key: 'F#m',
      genre: nextSong.genre,
      mood: 'Fresh demo',
      uploadDate: 'Just now',
      notes: nextSong.notes,
      collaborators: 'Self',
      status: 'demo',
      fileName: selectedFileName || undefined,
    };
    const storedSongs = window.localStorage.getItem(studioSongsStorageKey);
    const parsedSongs = storedSongs ? (JSON.parse(storedSongs) as Song[]) : [];

    setSongs((current) => [nextSong, ...current]);
    window.localStorage.setItem(studioSongsStorageKey, JSON.stringify([librarySong, ...parsedSongs]));
    setActiveTab('Demos');
    setUploadStep(4);
    setUploadMessage(`${nextSong.title} is now visible in Demos. Alex created a metadata review task.`);
  };

  const resetUploadFlow = () => {
    setUploadStep(1);
    setSelectedFileName('');
    setDraftTitle('');
    setDraftGenre('Synth Pop');
    setDraftBpm(112);
    setUploadMessage('');
  };

  return (
    <SectionLayout
      title="Studio"
      subtitle="This is where your music lives: demos, active records, releases, collaborations and the assets around them."
    >
      <div className="space-y-8">
        <div className="rounded-[2rem] border border-violet-300/15 bg-[#080713]/95 p-6 shadow-[0_24px_90px_rgba(109,40,217,0.22)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Artist workspace</p>
              <h2 className="mt-3 text-4xl font-semibold text-white">Aurora Lane music library</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#B7C8DA]">
                Track what is raw, what is moving, what is out, who is involved and what still needs assets before a campaign can breathe.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Songs', value: songs.length },
                { label: 'Active', value: songs.filter((song) => song.status === 'In Progress').length },
                { label: 'Ready assets', value: songs.filter((song) => song.assets).length },
              ].map((stat) => (
                <div key={stat.label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-[#D7E6FF]">
                  <p className="uppercase tracking-[0.26em] text-violet-200">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <section className="rounded-[2rem] border border-violet-300/15 bg-[#070816]/88 p-5 shadow-[0_24px_90px_rgba(109,40,217,0.2)] backdrop-blur-xl">
            <div className="flex gap-2 overflow-x-auto rounded-[1.5rem] border border-white/10 bg-[#050611]/90 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 rounded-[1.15rem] px-4 py-3 text-sm font-semibold transition ${activeTab === tab ? 'bg-gradient-to-br from-violet-400 via-indigo-500 to-cyan-300 text-white shadow-[0_0_22px_rgba(139,92,246,0.24)]' : 'text-[#D7E6FF] hover:bg-white/10'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4">
              {visibleSongs.map((song) => (
                <Link
                  key={song.id}
                  href={`/studio/songs/${song.id}`}
                  className="group rounded-[1.75rem] border border-violet-300/15 bg-[#0A0B1B]/95 p-5 transition hover:border-violet-300/35 hover:bg-violet-500/10"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-violet-500/12 px-3 py-1 text-xs uppercase tracking-[0.24em] text-violet-100">{song.status}</span>
                        <span className="text-sm text-violet-200">{song.genre}</span>
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold text-white">{song.title}</h3>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#B7C8DA]">{song.notes}</p>
                    </div>
                    <div className="rounded-[1.25rem] border border-white/10 bg-[#050611]/95 px-4 py-3 text-right text-sm text-[#D7E6FF]">
                      <p>{song.bpm} BPM</p>
                      <p className="mt-1 text-violet-200">{song.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-[#D7E6FF]">
                    <span className="font-semibold text-white">Alex:</span> {song.alexRecommendation}
                  </div>
                  {(song.collaborators || song.assets) ? (
                    <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-violet-200">
                      {song.collaborators ? <span>Collabs: {song.collaborators}</span> : null}
                      {song.assets ? <span>Assets: {song.assets}</span> : null}
                    </div>
                  ) : null}
                </Link>
              ))}

              {!visibleSongs.length ? (
                <div className="rounded-[1.75rem] border border-white/10 bg-[#0A0B1B]/95 p-8 text-sm text-[#B7C8DA]">
                  No songs in this lane yet. Upload a demo or move a track here when it is ready.
                </div>
              ) : null}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-violet-300/15 bg-[#090A1A]/95 p-6 shadow-[0_24px_90px_rgba(109,40,217,0.2)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Upload song</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">Add a new demo</h3>
                </div>
                <span className="rounded-full bg-violet-500/12 px-3 py-1 text-xs text-violet-100">Step {uploadStep}/4</span>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-2">
                {['Upload', 'Metadata', 'Save', 'Library'].map((step, index) => (
                  <div key={step} className={`h-2 rounded-full ${uploadStep >= index + 1 ? 'bg-gradient-to-r from-violet-400 to-cyan-300' : 'bg-white/10'}`} />
                ))}
              </div>

              <div className="mt-6 space-y-4">
                {uploadStep === 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full rounded-[1.5rem] border border-violet-300/20 bg-violet-500/12 px-5 py-5 text-left transition hover:bg-violet-500/18"
                    >
                      <span className="block text-lg font-semibold text-white">Choose audio file</span>
                      <span className="mt-2 block text-sm text-[#B7C8DA]">WAV, MP3 or demo bounce. This prototype stores it as a library entry.</span>
                    </button>
                    <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={handleMockUpload} />
                  </>
                ) : null}

                {uploadStep === 2 ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs uppercase tracking-[0.28em] text-violet-200">Title</label>
                      <input
                        value={draftTitle}
                        onChange={(event) => setDraftTitle(event.target.value)}
                        className="mt-2 w-full rounded-[1.25rem] border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-violet-300/45"
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs uppercase tracking-[0.28em] text-violet-200">Genre</label>
                        <input
                          value={draftGenre}
                          onChange={(event) => setDraftGenre(event.target.value)}
                          className="mt-2 w-full rounded-[1.25rem] border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-violet-300/45"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.28em] text-violet-200">BPM</label>
                        <input
                          type="number"
                          value={draftBpm}
                          onChange={(event) => setDraftBpm(Number(event.target.value))}
                          className="mt-2 w-full rounded-[1.25rem] border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-violet-300/45"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadStep(3);
                        setUploadMessage('Metadata locked. Review the demo card before it lands in the library.');
                      }}
                      className="w-full rounded-full bg-gradient-to-br from-violet-400 via-indigo-500 to-cyan-300 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.24)] transition hover:brightness-110"
                    >
                      Review upload
                    </button>
                  </div>
                ) : null}

                {uploadStep === 3 ? (
                  <div className="space-y-4">
                    <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-violet-200">Ready to save</p>
                      <h4 className="mt-3 text-xl font-semibold text-white">{draftTitle || 'Untitled demo'}</h4>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-violet-100">
                        <span>{draftGenre}</span>
                        <span>{draftBpm} BPM</span>
                        {selectedFileName ? <span>{selectedFileName}</span> : null}
                      </div>
                      <p className="mt-4 text-sm leading-6 text-[#B7C8DA]">
                        Alex will place this in Demos with first-pass notes, a hook check and a release-fit recommendation.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setUploadStep(2)}
                        className="rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-[#D7E6FF] transition hover:bg-white/10"
                      >
                        Edit metadata
                      </button>
                      <button
                        type="button"
                        onClick={saveUploadedSong}
                        className="rounded-full bg-gradient-to-br from-violet-400 via-indigo-500 to-cyan-300 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.24)] transition hover:brightness-110"
                      >
                        Save to Demos
                      </button>
                    </div>
                  </div>
                ) : null}

                {uploadStep === 4 ? (
                  <div className="space-y-4">
                    <div className="rounded-[1.5rem] border border-violet-300/15 bg-[#0A0B1B]/95 p-4 text-sm leading-6 text-[#D7E6FF]">
                      {uploadMessage}
                    </div>
                    <button
                      type="button"
                      onClick={resetUploadFlow}
                      className="w-full rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-[#D7E6FF] transition hover:bg-white/10"
                    >
                      Upload another song
                    </button>
                  </div>
                ) : uploadMessage ? (
                  <div className="rounded-[1.5rem] border border-violet-300/15 bg-[#0A0B1B]/95 p-4 text-sm leading-6 text-[#D7E6FF]">
                    {uploadMessage}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2rem] border border-violet-300/15 bg-[#070816]/88 p-6 shadow-[0_24px_90px_rgba(109,40,217,0.2)] backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Alex studio read</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Midnight Drive is the closest to campaign-ready.</h3>
              <p className="mt-3 text-sm leading-6 text-[#B7C8DA]">
                Finish the bridge edit, export a rough master, then decide if Northern Lights stays a B-side or becomes the next teaser.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <PrototypeAction label="Create release task" result="Task created" title="Release task created" message="Alex created a prototype task for the bridge edit, rough master and artwork check." />
                <Link href="/studio/artwork" className="rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-[#D7E6FF] transition hover:bg-white/10">
                  Open assets
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </SectionLayout>
  );
}
