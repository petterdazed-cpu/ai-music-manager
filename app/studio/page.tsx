import Link from 'next/link';
import SectionLayout from '@/components/SectionLayout';
import { pressAssets, studioArtwork, studioSongs } from '@/lib/mockData';

export default function StudioPage() {
  return (
    <SectionLayout
      title="Studio"
      subtitle="Manage your songs, art direction and creative workflow in one place."
    >
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-white/[0.05] p-8 shadow-[0_20px_90px_rgba(10,132,255,0.14)] backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Songs</p>
              <h2 className="mt-3 text-3xl font-semibold">{studioSongs.length}+ tracks</h2>
              <p className="mt-4 text-sm text-[#B7C8DA]">Upload your demos, stems and masters to keep every track in one creative workspace.</p>
            </div>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#0ea5e9]/10 text-2xl text-[#0ea5ff]">♪</div>
          </div>
          <Link href="/studio/songs" className="mt-8 inline-flex rounded-full bg-[#0ea5ff] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#12b0ff]">
            Open songs library
          </Link>
        </div>

        <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-white/[0.05] p-8 shadow-[0_20px_90px_rgba(10,132,255,0.14)] backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Artwork</p>
              <h2 className="mt-3 text-3xl font-semibold">{studioArtwork.length}+ assets</h2>
              <p className="mt-4 text-sm text-[#B7C8DA]">Store cover art, promo visuals and moodboards for every release campaign.</p>
            </div>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#0ea5e9]/10 text-2xl text-[#0ea5ff]">▧</div>
          </div>
          <Link href="/studio/artwork" className="mt-8 inline-flex rounded-full bg-[#0ea5ff] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#12b0ff]">
            Open artwork library
          </Link>
        </div>

        <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-white/[0.05] p-8 shadow-[0_20px_90px_rgba(10,132,255,0.14)] backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Press assets</p>
              <h2 className="mt-3 text-3xl font-semibold">Press kit ready</h2>
              <p className="mt-4 text-sm text-[#B7C8DA]">Build your bio, one sheet and press release with Alex and keep your promotional assets aligned.</p>
            </div>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#0ea5e9]/10 text-2xl text-[#0ea5ff]">📄</div>
          </div>
          <Link href="/studio/press-assets" className="mt-8 inline-flex rounded-full bg-[#0ea5ff] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#12b0ff]">
            Open press assets
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-8 shadow-[0_20px_90px_rgba(10,132,255,0.16)] backdrop-blur-xl">
          <h3 className="text-2xl font-semibold">Studio workflow</h3>
          <p className="mt-4 text-sm text-[#B7C8DA]">This is where you keep creative assets ready for releases, campaigns, sync and press outreach.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              'Upload track stems',
              'Finalize artwork concepts',
              'Build press-ready bio',
              'Start release planning',
            ].map((item) => (
              <div key={item} className="rounded-[1.75rem] bg-[#041227]/95 p-5 text-sm text-[#D7E6FF]">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#0ea5e9]/15 bg-[#041227]/95 p-8 shadow-[0_20px_90px_rgba(10,132,255,0.16)] backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[#8ec6ff]">Studio impact</p>
          <div className="mt-5 space-y-4 text-sm text-[#D7E6FF]">
            <p>Assets created in Studio feed into release readiness, campaign planning and press submissions.</p>
            <p>Every uploaded song becomes a candidate for playlist, booking or sync outreach.</p>
            <p>Visual assets support your press kit and the next distribution story.</p>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
