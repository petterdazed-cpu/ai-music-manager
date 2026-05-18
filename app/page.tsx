'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { industryFeed, type Song } from '@/lib/mockData';

type FeedItem = (typeof industryFeed)[number];
type AssistantActivity = { id: string; phase: 'thinking' | 'typing' } | null;
type RevealChunk = { text: string; delayAfter: number };
type MockAttachment = {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  category: 'audio' | 'image' | 'document';
};
type ManagerAction = {
  title: string;
  destination: string;
  assetsIncluded: string[];
  suggestedNextStep: string;
  missingInfo?: string[];
};
type ChatMessage = {
  id: string;
  role: 'user' | 'alex' | 'error' | 'action';
  text: string;
  attachments?: MockAttachment[];
  action?: ManagerAction;
};

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
const studioSongsStorageKey = 'aimStudioSongs';

const formatFileSize = (size: number) => {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  if (size >= 1024) return `${Math.round(size / 1024)} KB`;
  return `${size} B`;
};

const getAttachmentCategory = (file: File): MockAttachment['category'] | null => {
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf') return 'document';
  return null;
};

const titleFromFileName = (fileName: string) => (
  fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
);

const hasAnyIntent = (text: string, phrases: string[]) => phrases.some((phrase) => text.includes(phrase));

export default function Home() {
  const defaultNavItems = [
    { label: 'Home', icon: '⌂', href: '/' },
    { label: 'Studio', icon: '≋', href: '/studio' },
    { label: 'Career', icon: '★', href: '/career' },
    { label: 'Releases', icon: '↗', href: '/release' },
    { label: 'Goals', icon: '◎', href: '/goals' },
    { label: 'Manager', icon: '⚙', href: '/manager' },
    { label: 'Settings', icon: '⚙', href: '/settings' },
  ];

  const defaultSuggestions = [
    "Help with promotion",
    "Build release plan",
    "Artist strategy",
    "Industry outreach",
    "Find sync opportunities",
  ];

  const [navItems] = useState(defaultNavItems);
  const [placeholder, setPlaceholder] = useState("Ask Alex anything about your music career...");
  const [suggestions, setSuggestions] = useState(defaultSuggestions);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(industryFeed);
  const [logoSize, setLogoSize] = useState(500);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assistantActivity, setAssistantActivity] = useState<AssistantActivity>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [attachments, setAttachments] = useState<MockAttachment[]>([]);
  const [errorText, setErrorText] = useState<string | null>(null);
  const streamQueueRef = useRef('');
  const revealQueueRef = useRef<RevealChunk[]>([]);
  const streamDoneRef = useRef(false);
  const streamSessionRef = useRef(0);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const hydrateStoredContent = () => {
      const storedPlaceholder = localStorage.getItem('placeholder');
      if (storedPlaceholder) setPlaceholder(storedPlaceholder);

      const storedSuggestions = localStorage.getItem('suggestions');
      if (storedSuggestions) {
        setSuggestions(storedSuggestions.split('\n').filter(s => s.trim()));
      }

      const storedFeedItems = localStorage.getItem('feedItems');
      if (storedFeedItems) {
        try {
          const parsed = JSON.parse(storedFeedItems) as unknown;
          if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === 'object') {
            setFeedItems(parsed.filter((item): item is FeedItem => (
              typeof item === 'object' &&
              item !== null &&
              'id' in item &&
              'title' in item &&
              typeof item.id === 'string' &&
              typeof item.title === 'string'
            )));
          } else if (Array.isArray(parsed)) {
            // array of strings -> convert to objects
            setFeedItems(parsed.map((t, i) => ({ id: `stored-${i}`, title: String(t) })));
          } else {
            // fallback to newline-split
            setFeedItems(storedFeedItems.split('\n').filter((s) => s.trim()).map((t) => ({ id: t.slice(0, 40).replace(/[^a-z0-9]+/gi, '-').toLowerCase(), title: t })));
          }
        } catch {
          // not JSON, treat as newline-separated titles
          setFeedItems(storedFeedItems.split('\n').filter((s) => s.trim()).map((t, i) => ({ id: `stored-${i}`, title: t })));
        }
      }

      const storedLogoSize = localStorage.getItem('logoSize');
      if (storedLogoSize) setLogoSize(parseInt(storedLogoSize));
      else setLogoSize(500);
    };

    const hydrationTimer = window.setTimeout(hydrateStoredContent, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  const historyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // scroll to bottom when messages change
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const promoteBufferedText = (force = false) => {
    if (!streamQueueRef.current) return;

    const queuedText = streamQueueRef.current;
    const lastBoundary = force
      ? queuedText.length - 1
      : Math.max(
        queuedText.lastIndexOf(' '),
        queuedText.lastIndexOf('\n'),
        queuedText.lastIndexOf('\t')
      );
    if (lastBoundary < 0) return;

    const readyText = queuedText.slice(0, lastBoundary + 1);
    streamQueueRef.current = queuedText.slice(lastBoundary + 1);

    if (!readyText) return;

    let cursor = 0;

    while (cursor < readyText.length) {
      let chunkSize = 3 + ((cursor + readyText.charCodeAt(cursor)) % 3);
      const nextParagraphBreak = readyText.indexOf('\n\n', cursor);
      const nextLineBreak = readyText.indexOf('\n', cursor);

      if (nextParagraphBreak === cursor) {
        chunkSize = 2;
      } else if (nextLineBreak === cursor) {
        chunkSize = 1;
      } else {
        for (let index = cursor; index < Math.min(cursor + chunkSize, readyText.length); index += 1) {
          if (/[.!?…,:;]/.test(readyText[index])) {
            chunkSize = index - cursor + 1;
            break;
          }
        }
      }

      const chunk = readyText.slice(cursor, Math.min(cursor + chunkSize, readyText.length));
      revealQueueRef.current.push({
        text: chunk,
        delayAfter: getChunkDelay(chunk),
      });
      cursor += chunk.length;
    }
  };

  const getChunkDelay = (chunk: string) => {
    if (chunk.includes('\n\n')) return 380;
    if (/[.!?…]\s*$/.test(chunk)) return 150;
    if (/[,;:]\s*$/.test(chunk)) return 90;
    return 22 + (chunk.length % 3) * 3;
  };

  const appendAssistantDelta = (delta: string) => {
    streamQueueRef.current += delta;
  };

  const saveDemoToStudio = (audioFile: MockAttachment) => {
    const song: Song = {
      id: `chat-demo-${Date.now()}`,
      title: titleFromFileName(audioFile.name),
      artist: 'Aurora Lane',
      bpm: 112,
      key: 'F#m',
      genre: 'Synth Pop',
      mood: 'Imported from Alex chat',
      uploadDate: 'Just now',
      notes: `${audioFile.name} was routed from the homepage chat into Studio / Demos. Alex should review hook strength, references and release fit next.`,
      collaborators: 'Self',
      status: 'demo',
      fileName: audioFile.name,
    };
    const storedSongs = window.localStorage.getItem(studioSongsStorageKey);
    let parsedSongs: Song[] = [];
    try {
      parsedSongs = storedSongs ? (JSON.parse(storedSongs) as Song[]) : [];
    } catch {
      parsedSongs = [];
    }
    window.localStorage.setItem(studioSongsStorageKey, JSON.stringify([song, ...parsedSongs]));
  };

  const detectManagerAction = (text: string, includedAttachments: MockAttachment[]): ManagerAction | null => {
    const normalized = text.toLowerCase();
    const audioFiles = includedAttachments.filter((file) => file.category === 'audio');
    const imageFiles = includedAttachments.filter((file) => file.category === 'image');
    const documentFiles = includedAttachments.filter((file) => file.category === 'document');
    const assetNames = includedAttachments.map((file) => `${file.name} (${formatFileSize(file.size)})`);

    const hasDemoIntent = hasAnyIntent(normalized, [
      'add this to demos',
      'lägg den här i demos',
      'lägg den i demos',
      'save this demo',
      'add this to my music',
      'add this to music',
    ]);
    const hasReleaseIntent = hasAnyIntent(normalized, [
      'create a release',
      'add this to my next release',
      'next release',
      'release draft',
      'lägg den i releaseflödet',
      'releaseflödet',
    ]);
    const hasEpkIntent = hasAnyIntent(normalized, [
      'make an epk',
      'create an epk',
      'create press kit',
      'press kit',
    ]);
    const hasArtworkIntent = hasAnyIntent(normalized, [
      'add artwork',
      'save this cover',
      'cover art',
      'add this artwork',
    ]);
    const hasEmailIntent = hasAnyIntent(normalized, [
      'draft an email',
      'write an email',
      'email draft',
      'draft outreach',
    ]);

    // TODO: Replace mock routing with Supabase/S3 storage, database persistence,
    // OpenAI tool/function calling, metadata extraction, audio analysis,
    // EPK PDF export, Gmail integration and distribution integrations.
    if (hasEpkIntent && (audioFiles.length || imageFiles.length || documentFiles.length)) {
      window.localStorage.setItem('aimPressKitDraft', JSON.stringify({
        artistBio: 'Artist bio placeholder - Alex will shape this once the artist confirms the story.',
        releaseInfo: 'Release info placeholder from chat attachments.',
        attachedArtwork: imageFiles.map((file) => file.name),
        attachedMusic: audioFiles.map((file) => file.name),
        suggestedPressAngle: 'Independent Nordic pop release with a cinematic late-night campaign angle.',
        missingDetails: ['artist bio approval', 'release date', 'press contact', 'high-res photo', 'EPK PDF export'],
        createdAt: new Date().toISOString(),
      }));
      return {
        title: 'Press Kit Draft created',
        destination: 'Studio / Press Kit Draft',
        assetsIncluded: assetNames,
        suggestedNextStep: 'Alex will shape the press angle, attach the strongest music and artwork, then ask for final bio details before export.',
        missingInfo: ['artist bio approval', 'release date', 'press contact', 'high-res photo', 'EPK PDF export'],
      };
    }

    if (hasEmailIntent) {
      window.localStorage.setItem('aimEmailDraft', JSON.stringify({
        status: 'Draft',
        assets: includedAttachments.map((file) => file.name),
        instruction: text,
        requiresConfirmation: true,
        createdAt: new Date().toISOString(),
      }));
      return {
        title: 'Email draft prepared',
        destination: 'Alex / Outreach Drafts',
        assetsIncluded: assetNames.length ? assetNames : ['chat instructions'],
        suggestedNextStep: 'Review the recipient, subject line and ask before anything is sent.',
        missingInfo: ['recipient email', 'subject line', 'explicit send approval'],
      };
    }

    if (hasReleaseIntent && (audioFiles.length || imageFiles.length)) {
      const releaseTitle = titleFromFileName(audioFiles[0]?.name || imageFiles[0]?.name || 'Draft release');
      window.localStorage.setItem('aimReleaseDraft', JSON.stringify({
        title: releaseTitle,
        status: 'Draft',
        assets: includedAttachments.map((file) => file.name),
        createdAt: new Date().toISOString(),
        missingInfo: ['release date', 'writers', 'producer', 'artwork', 'metadata'],
      }));
      return {
        title: 'Release Draft created',
        destination: 'Releases / Draft Release',
        assetsIncluded: assetNames,
        suggestedNextStep: `${releaseTitle} is staged as a draft. Alex needs the release date, writers, producer and final metadata before distribution.`,
        missingInfo: ['release date', 'writers', 'producer', 'artwork', 'metadata'],
      };
    }

    if (hasDemoIntent && audioFiles.length) {
      saveDemoToStudio(audioFiles[0]);
      return {
        title: 'Saved to Studio / Demos',
        destination: 'Studio / Demos',
        assetsIncluded: assetNames,
        suggestedNextStep: `${audioFiles[0].name} added to Demos. If this becomes a release, Alex will need release date, writers and final artwork.`,
        missingInfo: ['hook notes', 'reference tracks', 'release fit', 'artwork direction'],
      };
    }

    if (hasArtworkIntent && imageFiles.length) {
      window.localStorage.setItem('aimArtworkDraft', JSON.stringify({
        title: titleFromFileName(imageFiles[0].name),
        status: 'Campaign asset draft',
        assets: imageFiles.map((file) => file.name),
        createdAt: new Date().toISOString(),
      }));
      return {
        title: 'Artwork added to campaign assets',
        destination: 'Studio / Artwork',
        assetsIncluded: assetNames,
        suggestedNextStep: 'Alex will connect this artwork to the next release draft once the release title and date are confirmed.',
        missingInfo: ['release title', 'release date', 'platform crops', 'final approval'],
      };
    }

    return null;
  };

  const runAssistantReveal = async (assistantId: string, sessionId: number) => {
    setAssistantActivity({ id: assistantId, phase: 'thinking' });
    await sleep(600);

    if (streamSessionRef.current !== sessionId) return;
    setAssistantActivity({ id: assistantId, phase: 'typing' });

    while (streamSessionRef.current === sessionId) {
      promoteBufferedText(streamDoneRef.current);

      const nextChunk = revealQueueRef.current.shift();
      if (nextChunk) {
        setMessages((prev) => prev.map((pm) => pm.id === assistantId ? { ...pm, text: pm.text + nextChunk.text } : pm));
        await sleep(nextChunk.delayAfter);
        continue;
      }

      if (streamDoneRef.current) break;
      await sleep(25);
    }
  };

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const nextAttachments = Array.from(files).reduce<MockAttachment[]>((acc, file) => {
      const category = getAttachmentCategory(file);
      if (!category) return acc;

      acc.push({
        id: `att-${Date.now()}-${file.name}`,
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        category,
      });
      return acc;
    }, []);

    setAttachments((current) => [...current, ...nextAttachments].slice(0, 6));
    event.target.value = '';
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments((current) => current.filter((attachment) => attachment.id !== attachmentId));
  };

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !attachments.length) || isLoading) return;

    const userText = inputValue.trim();
    const sentAttachments = attachments;
    const detectedAction = detectManagerAction(userText, sentAttachments);
    setInputValue('');
    setAttachments([]);
    setErrorText(null);

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: userText || 'Attached files for Alex to organize.', attachments: sentAttachments };
    const assistantId = `a-${Date.now()}`;
    const assistantMsg: ChatMessage = { id: assistantId, role: 'alex', text: '' };

    if (detectedAction) {
      const actionMsg: ChatMessage = { id: `action-${Date.now()}`, role: 'action', text: '', action: detectedAction };
      const actionResponse = detectedAction.title === 'Saved to Studio / Demos'
        ? `Got it. I’ve put this in Demos for now.\n\nNext, I’d listen for hook strength, compare it against two references, and decide whether it’s a demo or release candidate.\n\nIf we’re turning it into a release, what date are we aiming for?`
        : detectedAction.title === 'Release Draft created'
        ? `Got it. I created a release draft and attached the assets.\n\nBefore this can move toward distribution, I’ll need the release date, writers, producer, artwork approval and final metadata.\n\nIs this meant to be a single, EP, or part of a larger rollout?`
        : detectedAction.title === 'Press Kit Draft created'
        ? `Got it. I started a Press Kit Draft with the attached music and artwork.\n\nI’ll frame the angle, organize the assets, and leave gaps for the bio, release info and press contact.\n\nWhat’s the story we want press to repeat in one sentence?`
        : detectedAction.title === 'Artwork added to campaign assets'
        ? `Got it. I added the artwork to campaign assets.\n\nNext I’d match it to the right release, check platform crops, and confirm whether this is final or still a direction.\n\nWhich release should this artwork belong to?`
        : `Got it. I prepared the email draft as a prototype.\n\nBefore anything gets sent, I’ll need the recipient, subject line and explicit approval.\n\nWho is this going to?`;

      streamQueueRef.current = '';
      revealQueueRef.current = [];
      streamDoneRef.current = false;
      const sessionId = streamSessionRef.current + 1;
      streamSessionRef.current = sessionId;
      setMessages((m) => [...m, userMsg, actionMsg, assistantMsg]);
      setIsLoading(true);
      const revealPromise = runAssistantReveal(assistantId, sessionId);
      appendAssistantDelta(actionResponse);
      streamDoneRef.current = true;
      await revealPromise;
      setIsLoading(false);
      setAssistantActivity(null);
      return;
    }

    streamQueueRef.current = '';
    revealQueueRef.current = [];
    streamDoneRef.current = false;
    const sessionId = streamSessionRef.current + 1;
    streamSessionRef.current = sessionId;
    setMessages((m) => [...m, userMsg, assistantMsg]);
    setIsLoading(true);
    const revealPromise = runAssistantReveal(assistantId, sessionId);

    try {
      const attachmentContext = sentAttachments.length
        ? `\n\nAttached files: ${sentAttachments.map((file) => `${file.name} (${file.category}, ${formatFileSize(file.size)})`).join(', ')}`
        : '';
      const apiMessage = `${userText || 'I attached files for you to review.'}${attachmentContext}`;

      console.log('Sending message to /api/chat', apiMessage);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: apiMessage }),
      });

      if (!res.ok || !res.body) {
        const text = await res.text();
        console.error('Chat error', text);
        setErrorText('Failed to get a response from Alex');
        setMessages((m) => m.map(msg => msg.id === assistantId ? { ...msg, text: 'Error: failed to get response.' } : msg));
        streamDoneRef.current = true;
        await revealPromise;
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // split on SSE events (double newline)
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          const line = part.trim();
          if (!line) continue;
          // OpenAI streams with lines like: data: {json}\n\n
          const matches = line.split('\n').map(l => l.replace(/^data:\s*/, ''));
          for (const m of matches) {
            if (m === '[DONE]') {
              // stream finished
              break;
            }
            try {
              const parsed = JSON.parse(m);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                appendAssistantDelta(delta);
              }
            } catch {
              // ignore non-json lines
            }
          }
        }
      }

      // final flush of any remaining buffer
      if (buffer) {
        const lines = buffer.split('\n').map(l => l.replace(/^data:\s*/, '')).filter(Boolean);
        for (const l of lines) {
          if (l === '[DONE]') break;
          try {
            const parsed = JSON.parse(l);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              appendAssistantDelta(delta);
            }
          } catch {}
        }
      }

      streamDoneRef.current = true;
      await revealPromise;
      console.log('Chat response stream finished');
    } catch (err) {
      console.error('Failed to send message:', err);
      const msg = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setErrorText(msg);
      setMessages((m) => m.map(pm => pm.role === 'alex' && pm.text === '' ? { ...pm, text: `Error: ${msg}` } : pm));
      streamDoneRef.current = true;
      await revealPromise;
    } finally {
      setIsLoading(false);
      setAssistantActivity(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center_top,rgba(14,132,255,0.14),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,118,255,0.06),transparent_40%)]" />
      <aside className="fixed left-0 top-0 flex h-screen w-44 flex-col items-center justify-start border-r border-white/10 bg-black/80 pt-14 px-4 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-6 w-full">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-2 text-sm text-[#AED7FF] transition hover:text-white"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-3xl border border-[#0ea5e9]/15 bg-black/40 text-[#0ea5e9] text-3xl shadow-[0_0_20px_rgba(14,165,233,0.15)]">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>

      <section className="flex min-h-screen items-start justify-center px-8 py-4 pt-3 pl-48">
        <div className="w-full max-w-[1080px] text-center">
          <div className="relative mb-3 flex flex-col items-center">
            <div className="mb-1.5 flex w-full items-center justify-center">
              <img src="/aim-logo-v2.svg" alt="AIM" style={{ width: logoSize, height: 'auto' }} className="object-contain" />
            </div>
            <p className="text-center text-base uppercase tracking-[0.35em] text-[#B7C8DA]">
              YOUR PARTNER IN THE MUSIC INDUSTRY
            </p>

          </div>

          {/* Slim ticker-style Industry Feed */}
          <div className="mx-auto mb-2 mt-0 w-full max-w-[960px]">
            <div className="overflow-hidden rounded-[1.5rem] border border-[#0ea5e9]/12 bg-[#05131f]/88 px-3 py-2 shadow-[0_0_40px_rgba(14,165,233,0.08)]">
              <div className="flex items-center gap-3 text-sm text-[#D7E6FF]">
                <div className="flex-shrink-0 rounded-full border border-[#0ea5e9]/18 bg-[#0ea5e9]/8 px-2 py-0.5 text-[11px] uppercase tracking-[0.28em] text-[#B7D9FF]">
                  LIVE
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="flex gap-4 animate-marquee-left hover:animation-play-state-paused whitespace-nowrap text-sm text-[#E7F1FF]">
                    {feedItems.concat(feedItems).map((item, index) => {
                      const id = typeof item === 'string' ? `feed-${index}` : item.id;
                      const title = typeof item === 'string' ? item : item.title;
                      return (
                        <Link
                          key={`ticker-${index}`}
                          href={`/opportunities/${encodeURIComponent(id)}`}
                          className="flex-shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-[#D7E6FF] transition hover:border-[#0ea5ff]/30 hover:text-white"
                        >
                          {title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                .animate-marquee-left { animation: marquee-left 20s linear infinite; }
              .animate-marquee-left:hover { animation-play-state: paused; }
            ` }} />
          </div>

          {/* Chat panel */}
          <div className="mx-auto mt-3 w-full max-w-[960px]">
            <div className="flex h-[clamp(430px,56vh,520px)] flex-col overflow-hidden rounded-[1.5rem] border border-[#0ea5e9]/14 bg-white/[0.03] p-0 shadow-[0_20px_90px_rgba(10,132,255,0.12)] backdrop-blur-xl">
              <div className="border-b border-white/8 bg-[#07131f]/80 px-6 py-2.5 text-left">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8D9FF]">Alex</div>
                <div className="mt-1 text-sm font-medium leading-6 text-[#E8F4FF]">
                  Morning. What are we moving forward today — release, promo, or strategy?
                </div>
              </div>

              <div ref={historyRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-6 py-4">
                {messages.map((m) => (
                  <div key={m.id} className="flex justify-start">
                    <div className={
                      m.role === 'user'
                        ? 'max-w-[82%] rounded-[1.15rem] border border-[#0ea5e9]/22 bg-[#0ea5e9]/14 px-4 py-3 text-left text-sm leading-7 text-[#F2FAFF] shadow-[0_8px_24px_rgba(14,165,233,0.08)]'
                        : m.role === 'alex'
                        ? 'max-w-[86%] rounded-[1.15rem] border border-white/8 bg-white/[0.035] px-4 py-3 text-left text-sm leading-7 text-[#D7E6FF] shadow-[0_8px_24px_rgba(10,132,255,0.05)]'
                        : m.role === 'action'
                        ? 'max-w-[88%] rounded-[1.15rem] border border-[#0ea5ff]/24 bg-[#061229]/95 px-4 py-3 text-left text-sm leading-7 text-[#D7E6FF] shadow-[0_14px_40px_rgba(14,165,255,0.1)]'
                        : 'max-w-[86%] rounded-[1.15rem] border border-[#ff4d4f]/20 bg-[#ff4d4f]/10 px-4 py-3 text-left text-sm leading-7 text-[#ffb3b3]'
                    }>
                      {m.role === 'action' && m.action ? (
                        <div>
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.24em] text-[#8ec6ff]">Action detected</p>
                              <h3 className="mt-2 text-lg font-semibold text-white">{m.action.title}</h3>
                            </div>
                            <span className="rounded-full bg-[#0ea5ff]/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#AED7FF]">
                              {m.action.destination}
                            </span>
                          </div>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-[1rem] border border-white/10 bg-black/25 p-3">
                              <p className="text-xs uppercase tracking-[0.2em] text-[#8ec6ff]">Assets included</p>
                              <div className="mt-2 space-y-1.5 text-sm text-[#D7E6FF]">
                                {m.action.assetsIncluded.map((asset) => (
                                  <p key={asset}>{asset}</p>
                                ))}
                              </div>
                            </div>
                            <div className="rounded-[1rem] border border-white/10 bg-black/25 p-3">
                              <p className="text-xs uppercase tracking-[0.2em] text-[#8ec6ff]">Suggested next step</p>
                              <p className="mt-2 text-sm leading-6 text-[#D7E6FF]">{m.action.suggestedNextStep}</p>
                            </div>
                          </div>
                          {m.action.missingInfo?.length ? (
                            <div className="mt-3 rounded-[1rem] border border-white/10 bg-white/[0.035] p-3">
                              <p className="text-xs uppercase tracking-[0.2em] text-[#8ec6ff]">Missing details</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {m.action.missingInfo.map((item) => (
                                  <span key={item} className="rounded-full bg-white/5 px-3 py-1 text-xs text-[#D7E6FF]">{item}</span>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                      <div className="whitespace-pre-wrap break-words">
                        {assistantActivity?.id === m.id && assistantActivity.phase === 'thinking' && !m.text ? (
                          <span className="inline-flex items-center gap-2 text-[#B7D9FF]">
                            <span>Alex is thinking</span>
                            <span className="inline-flex items-center gap-1">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#BFE5FF]" />
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#BFE5FF] [animation-delay:140ms]" />
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#BFE5FF] [animation-delay:280ms]" />
                            </span>
                          </span>
                        ) : (
                          <>
                            {m.text}
                            {assistantActivity?.id === m.id && assistantActivity.phase === 'typing' && m.text ? (
                              <span className="ml-1.5 inline-block h-4 w-0.5 animate-pulse rounded-full bg-[#BFE5FF] align-[-2px] opacity-80" />
                            ) : null}
                          </>
                        )}
                        {assistantActivity?.id === m.id && assistantActivity.phase === 'typing' && !m.text ? (
                          <span className="inline-flex items-center gap-1.5 text-[#B7D9FF]">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#BFE5FF]" />
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#BFE5FF] [animation-delay:140ms]" />
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#BFE5FF] [animation-delay:280ms]" />
                          </span>
                        ) : null}
                        {m.attachments?.length ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {m.attachments.map((attachment) => (
                              <span key={attachment.id} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-[#D7E6FF]">
                                {attachment.category} · {attachment.name} · {formatFileSize(attachment.size)}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      )}
                    </div>
                  </div>
                ))}
                {errorText ? <div className="text-sm text-[#ffb3b3]">{errorText}</div> : null}
              </div>
              <div className="flex-shrink-0 border-t border-white/8 bg-[#050f19]/92 px-5 py-2.5">
                <div className="mb-1.5 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      className="flex-shrink-0 rounded-full border border-white/8 bg-transparent px-2.5 py-1 text-[11px] font-medium tracking-[0.08em] text-[#D7E6FF] transition hover:border-[#0ea5e9]/18 hover:bg-[#0ea5e9]/10"
                      onClick={() => {
                        setInputValue(s);
                        inputRef.current?.focus();
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {attachments.length ? (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {attachments.map((attachment) => (
                      <button
                        key={attachment.id}
                        type="button"
                        onClick={() => removeAttachment(attachment.id)}
                        className="rounded-full border border-[#0ea5e9]/16 bg-[#0ea5ff]/10 px-3 py-1 text-xs text-[#D7E6FF] transition hover:bg-[#0ea5ff]/15"
                        title="Remove attachment"
                      >
                        {attachment.category} · {attachment.name} · {formatFileSize(attachment.size)} ×
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => attachmentInputRef.current?.click()}
                    disabled={isLoading}
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[#0ea5e9]/18 bg-[#03101b]/96 text-xl font-semibold text-[#B7D9FF] transition hover:border-[#0ea5e9]/40 hover:bg-[#0ea5e9]/10 disabled:opacity-50"
                    aria-label="Attach audio, image or PDF"
                  >
                    +
                  </button>
                  <input
                    ref={attachmentInputRef}
                    type="file"
                    accept=".mp3,.wav,.png,.jpg,.jpeg,.pdf,audio/mpeg,audio/wav,audio/x-wav,image/png,image/jpeg,application/pdf"
                    multiple
                    className="hidden"
                    onChange={handleAttachmentChange}
                  />
                  <textarea
                    ref={inputRef}
                    className="min-h-[50px] flex-1 resize-none rounded-[0.875rem] border border-white/12 bg-[#03101b]/96 px-4 py-2 text-sm leading-6 text-white outline-none placeholder:text-[#C6E1FF] focus:border-[#0ea5e9]/40 focus:ring-2 focus:ring-[#0ea5e9]/12"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                  />
                  <button
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#0ea5e9] text-lg font-bold text-black shadow-[0_0_25px_rgba(14,165,233,0.45)] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSendMessage}
                    disabled={isLoading || (!inputValue.trim() && !attachments.length)}
                  >
                    {isLoading ? '...' : '↑'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-[#B7C8DA] uppercase tracking-[0.2em] font-medium">
              INSIGHTS. OPPORTUNITIES. CONNECTIONS. POWERED BY AIM.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
