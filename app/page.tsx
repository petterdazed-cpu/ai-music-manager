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
type ArtistProfile = {
  artistName?: string;
  musicType?: string;
  location?: string;
  currentBuild?: string;
  upcomingRelease?: string;
  hardestThing?: string;
  managerStyle?: string;
};
type StoredManagerSettings = {
  archetype?: string;
  pushIntensity?: number;
  directness?: number;
  emotionalSensitivity?: number;
  initiative?: 'low' | 'medium' | 'high';
  honestyStyle?: 'gentle' | 'balanced' | 'blunt';
};

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
const studioSongsStorageKey = 'aimStudioSongs';
const managerSettingsStorageKey = 'aimManagerSettings';
const artistProfileStorageKey = 'artistProfile';

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

const loadStoredManagerSettings = (): StoredManagerSettings | undefined => {
  const stored = window.localStorage.getItem(managerSettingsStorageKey);
  if (!stored) return undefined;
  try {
    return JSON.parse(stored) as StoredManagerSettings;
  } catch {
    return undefined;
  }
};

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
  const [logoSize, setLogoSize] = useState(270);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assistantActivity, setAssistantActivity] = useState<AssistantActivity>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [attachments, setAttachments] = useState<MockAttachment[]>([]);
  const [artistProfile, setArtistProfile] = useState<ArtistProfile | null>(null);
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
      if (storedLogoSize) setLogoSize(Math.min(parseInt(storedLogoSize), 300));
      else setLogoSize(270);

      const storedArtistProfile = localStorage.getItem(artistProfileStorageKey);
      if (storedArtistProfile) {
        try {
          setArtistProfile(JSON.parse(storedArtistProfile) as ArtistProfile);
        } catch {}
      }
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
      const managerSettings = loadStoredManagerSettings();
      const profileContext = artistProfile
        ? `\n\nArtist profile: releases as ${artistProfile.artistName || 'unknown'}, makes ${artistProfile.musicType || 'music'}, based in ${artistProfile.location || 'unknown'}, building ${artistProfile.currentBuild || 'their next move'}, current blocker: ${artistProfile.hardestThing || 'unknown'}.`
        : '';

      console.log('Sending message to /api/chat', apiMessage);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `${apiMessage}${profileContext}`,
          managerSettings,
        }),
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

  const alexGreeting = artistProfile?.currentBuild
    ? `Morning. We’re building toward ${artistProfile.currentBuild.toLowerCase()}. Want to work on rollout, demos, or outreach today?`
    : 'Morning. What are we moving forward today — release, promo, or strategy?';

  const matchedForYou = [
    { title: 'Bassist in Stockholm seeking band', type: 'COLLAB', time: 'New match', tone: 'from-violet-500/20 text-violet-100' },
    { title: 'Sync brief match for “Midnight Drive”', type: 'SYNC', time: '1h ago', tone: 'from-blue-500/20 text-cyan-100' },
    { title: 'Nordic pop playlist fit', type: 'PLAYLIST', time: '2h ago', tone: 'from-fuchsia-500/20 text-fuchsia-100' },
    { title: 'Festival application deadline', type: 'LIVE', time: 'Due Friday', tone: 'from-amber-500/20 text-amber-100' },
    { title: 'Label scouting opportunity', type: 'A&R', time: 'High fit', tone: 'from-emerald-500/20 text-emerald-100' },
  ];

  const alexActions = [
    { title: 'Approve EPK draft', detail: 'Bio and press angle are ready for review.' },
    { title: 'Confirm artwork', detail: 'Final square crop is waiting on approval.' },
    { title: 'Review release plan', detail: 'Northern Lights timeline has 3 open decisions.' },
    { title: 'Send outreach draft', detail: 'Curator email is staged, not sent.' },
    { title: 'Schedule promo content', detail: 'Two short-form clips need dates.' },
  ];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#000006] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(139,92,246,0.34),transparent_25%),radial-gradient(circle_at_78%_14%,rgba(37,99,235,0.2),transparent_28%),radial-gradient(circle_at_55%_90%,rgba(109,40,217,0.14),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(0,0,6,0.98)_0%,rgba(1,1,10,0.76)_44%,rgba(0,0,6,0.97)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.68)_100%)]" />
      <div className="pointer-events-none absolute left-[44%] top-10 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-violet-500/18 blur-3xl" />
      <div className="pointer-events-none absolute right-16 top-20 h-[480px] w-[520px] rounded-full bg-blue-500/8 blur-3xl" />
      <div className="pointer-events-none absolute left-44 right-0 top-[126px] h-[180px] opacity-80">
        <img src="/hero-wavefield.svg" alt="" className="absolute inset-x-[-7%] top-[-92px] h-[360px] w-[114%] object-cover opacity-100 mix-blend-screen drop-shadow-[0_0_44px_rgba(217,70,239,0.72)] contrast-125 saturate-150" />
        <div className="absolute inset-x-0 top-16 h-px bg-gradient-to-r from-transparent via-fuchsia-200/80 to-transparent shadow-[0_0_50px_rgba(217,70,239,1)]" />
        <div className="absolute inset-x-0 top-24 h-24 bg-[radial-gradient(ellipse_at_20%_40%,rgba(217,70,239,0.42),transparent_20%),radial-gradient(ellipse_at_78%_35%,rgba(168,85,247,0.4),transparent_22%),radial-gradient(ellipse_at_50%_70%,rgba(37,99,235,0.14),transparent_30%)] blur-xl" />
      </div>

      <aside className="fixed left-0 top-0 z-30 flex h-screen w-[164px] flex-col border-r border-violet-200/10 bg-[linear-gradient(180deg,rgba(7,7,18,0.9),rgba(2,2,8,0.78))] px-4 py-8 shadow-[24px_0_90px_rgba(0,0,0,0.42),inset_-1px_0_0_rgba(255,255,255,0.035)] backdrop-blur-2xl">
        <div className="mb-8 flex w-full justify-start">
          <img src="/alex-logo.svg" alt="Alex by AIM" className="h-auto w-[120px]" />
        </div>
        <div className="flex w-full flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-violet-100/72 transition hover:bg-white/[0.06] hover:text-white hover:shadow-[0_0_24px_rgba(139,92,246,0.16),inset_0_1px_0_rgba(255,255,255,0.08)] ${item.href === '/' ? 'border border-violet-300/25 bg-[linear-gradient(135deg,rgba(124,58,237,0.28),rgba(31,20,58,0.62))] text-white shadow-[0_0_34px_rgba(139,92,246,0.25),inset_0_1px_0_rgba(255,255,255,0.12)]' : ''}`}
            >
              <span className="flex h-6 w-6 items-center justify-center text-xl text-violet-100 transition group-hover:text-white">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="mt-auto overflow-hidden rounded-[1.25rem] border border-violet-200/12 bg-[linear-gradient(150deg,rgba(255,255,255,0.075),rgba(124,58,237,0.05)_42%,rgba(0,0,0,0.16))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42),0_0_34px_rgba(124,58,237,0.14),inset_0_1px_0_rgba(255,255,255,0.09)] backdrop-blur-2xl">
          <p className="text-sm font-medium leading-6 text-white">Focus on your music.</p>
          <p className="mt-1 text-sm leading-6 text-violet-100/85">Alex handles the rest.</p>
          <div className="mt-5 h-20 rounded-xl bg-[url('/topography-field.svg'),radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.48),transparent_36%),linear-gradient(135deg,rgba(18,12,42,0.9),rgba(4,5,18,0.95))] bg-cover bg-center shadow-[inset_0_0_42px_rgba(0,0,0,0.45)]" />
        </div>
      </aside>

      <section className="relative z-10 flex min-h-screen justify-center px-7 py-6 pl-[188px]">
        <div className="w-full max-w-[1320px]">
          <div className="mb-4 flex flex-col items-center text-center">
            <img src="/alex-logo.svg" alt="Alex by AIM" style={{ width: Math.min(logoSize, 190), height: 'auto' }} className="object-contain drop-shadow-[0_0_28px_rgba(139,92,246,0.3)]" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.62em] text-slate-100/90 drop-shadow-[0_0_14px_rgba(255,255,255,0.12)]">
              Your <span className="text-fuchsia-300 drop-shadow-[0_0_16px_rgba(217,70,239,0.7)]">partner</span> in the music <span className="text-fuchsia-300 drop-shadow-[0_0_16px_rgba(217,70,239,0.7)]">industry</span>
            </p>
          </div>

          <div className="mb-4 w-full">
            <div className="overflow-hidden rounded-[1.45rem] border border-violet-200/14 bg-[linear-gradient(180deg,rgba(17,18,37,0.78),rgba(5,6,16,0.76))] px-4 py-3 shadow-[0_0_60px_rgba(124,58,237,0.2),0_18px_70px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl">
              <div className="flex items-center gap-3 text-sm text-[#D7E6FF]">
                <div className="flex-shrink-0 rounded-full border border-violet-300/20 bg-violet-500/12 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-100 shadow-[0_0_22px_rgba(139,92,246,0.22)]">
                  LIVE
                </div>
                <div className="hidden flex-shrink-0 text-xs font-semibold uppercase tracking-[0.32em] text-violet-200/80 sm:block">Industry intelligence</div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="flex gap-3 animate-marquee-left hover:animation-play-state-paused whitespace-nowrap text-sm text-[#E7F1FF]">
                    {feedItems.concat(feedItems).map((item, index) => {
                      const id = typeof item === 'string' ? `feed-${index}` : item.id;
                      const title = typeof item === 'string' ? item : item.title;
                      return (
                        <Link
                          key={`ticker-${index}`}
                          href={`/opportunities/${encodeURIComponent(id)}`}
                          className="flex-shrink-0 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-medium text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] transition hover:border-violet-300/35 hover:bg-violet-500/10 hover:text-white hover:shadow-[0_0_24px_rgba(139,92,246,0.18)]"
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

          <div className="grid w-full gap-5 xl:grid-cols-[1fr_320px]">
            <div className="relative flex h-[clamp(500px,62vh,700px)] flex-col overflow-hidden rounded-[2rem] border border-violet-100/16 bg-[linear-gradient(145deg,rgba(8,9,24,0.9),rgba(1,2,10,0.92)_44%,rgba(7,5,18,0.94))] p-0 shadow-[0_48px_160px_rgba(0,0,0,0.86),0_0_128px_rgba(124,58,237,0.28),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_0_86px_rgba(124,58,237,0.1)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_72%_18%,rgba(168,85,247,0.28),transparent_28%),radial-gradient(circle_at_16%_92%,rgba(37,99,235,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_22%)]" />
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/6" />
              <div className="pointer-events-none absolute right-[-6rem] top-[-8rem] h-72 w-72 rounded-full bg-violet-500/32 blur-3xl" />
              <div className="pointer-events-none absolute right-[-2%] top-6 h-[430px] w-[78%] opacity-100 mix-blend-screen">
                <img src="/chat-contour-field.svg" alt="" className="h-full w-full object-cover opacity-100 drop-shadow-[0_0_30px_rgba(217,70,239,0.52)] contrast-125 saturate-150" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_63%_44%,rgba(217,70,239,0.18),transparent_22%),linear-gradient(90deg,transparent,rgba(2,2,12,0.2)_78%)]" />
              </div>
              <div className="relative border-b border-white/8 bg-[linear-gradient(180deg,rgba(13,14,31,0.84),rgba(8,8,22,0.72))] px-7 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.26em] text-violet-200">Alex</div>
                    <div className="mt-1 text-base font-medium leading-6 text-white">
                  {alexGreeting}
                    </div>
                  </div>
                  <div className="hidden rounded-full border border-violet-200/10 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-100 sm:block">
                    Manager online
                  </div>
                </div>
              </div>

              <div ref={historyRef} className="relative min-h-0 flex-1 space-y-4 overflow-y-auto px-7 py-6">
                {messages.map((m) => (
                  <div key={m.id} className="relative flex justify-start">
                    <div className={
                      m.role === 'user'
                        ? 'max-w-[82%] rounded-[1.25rem] border border-violet-200/18 bg-[linear-gradient(145deg,rgba(124,58,237,0.34),rgba(63,40,138,0.52))] px-4 py-3 text-left text-sm leading-7 text-white shadow-[0_18px_48px_rgba(80,43,180,0.26),inset_0_1px_0_rgba(255,255,255,0.13)] backdrop-blur-xl'
                        : m.role === 'alex'
                        ? 'max-w-[86%] rounded-[1.25rem] border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.035)_58%,rgba(124,58,237,0.055))] px-4 py-3 text-left text-sm leading-7 text-slate-200 shadow-[0_18px_50px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.09)] backdrop-blur-xl'
                        : m.role === 'action'
                        ? 'max-w-[88%] rounded-[1.25rem] border border-violet-200/22 bg-[linear-gradient(145deg,rgba(28,23,58,0.94),rgba(8,8,22,0.94))] px-4 py-3 text-left text-sm leading-7 text-slate-200 shadow-[0_20px_58px_rgba(124,58,237,0.22),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl'
                        : 'max-w-[86%] rounded-[1.15rem] border border-[#ff4d4f]/20 bg-[#ff4d4f]/10 px-4 py-3 text-left text-sm leading-7 text-[#ffb3b3]'
                    }>
                      {m.role === 'action' && m.action ? (
                        <div>
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.24em] text-violet-200">Action detected</p>
                              <h3 className="mt-2 text-lg font-semibold text-white">{m.action.title}</h3>
                            </div>
                            <span className="rounded-full bg-violet-500/12 px-3 py-1 text-xs uppercase tracking-[0.18em] text-violet-100">
                              {m.action.destination}
                            </span>
                          </div>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-[1rem] border border-white/10 bg-black/25 p-3">
                              <p className="text-xs uppercase tracking-[0.2em] text-violet-200">Assets included</p>
                              <div className="mt-2 space-y-1.5 text-sm text-[#D7E6FF]">
                                {m.action.assetsIncluded.map((asset) => (
                                  <p key={asset}>{asset}</p>
                                ))}
                              </div>
                            </div>
                            <div className="rounded-[1rem] border border-white/10 bg-black/25 p-3">
                              <p className="text-xs uppercase tracking-[0.2em] text-violet-200">Suggested next step</p>
                              <p className="mt-2 text-sm leading-6 text-[#D7E6FF]">{m.action.suggestedNextStep}</p>
                            </div>
                          </div>
                          {m.action.missingInfo?.length ? (
                            <div className="mt-3 rounded-[1rem] border border-white/10 bg-white/[0.035] p-3">
                              <p className="text-xs uppercase tracking-[0.2em] text-violet-200">Missing details</p>
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
              <div className="relative flex-shrink-0 border-t border-white/8 bg-[linear-gradient(180deg,rgba(8,9,22,0.88),rgba(4,5,14,0.96))] px-5 py-3 shadow-[0_-24px_70px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.055)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/35 to-transparent" />
                <div className="mb-1.5 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      className="flex-shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium tracking-[0.08em] text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-violet-300/25 hover:bg-violet-500/10 hover:shadow-[0_0_18px_rgba(139,92,246,0.14)]"
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
                        className="rounded-full border border-violet-300/16 bg-violet-500/10 px-3 py-1 text-xs text-slate-200 transition hover:bg-violet-500/15"
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
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-violet-200/18 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),rgba(124,58,237,0.08))] text-xl font-semibold text-violet-100 shadow-[0_12px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.09)] transition hover:border-violet-300/45 hover:bg-violet-500/12 hover:shadow-[0_0_24px_rgba(139,92,246,0.22)] disabled:opacity-50"
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
                    className="min-h-[54px] flex-1 resize-none rounded-[1rem] border border-white/12 bg-[linear-gradient(180deg,rgba(13,14,29,0.96),rgba(5,6,17,0.96))] px-4 py-2.5 text-sm leading-6 text-white shadow-[0_16px_42px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_0_24px_rgba(124,58,237,0.055)] outline-none placeholder:text-slate-300/75 focus:border-violet-300/45 focus:ring-2 focus:ring-violet-500/15"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                  />
                  <button
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 via-indigo-500 to-cyan-300 text-lg font-bold text-white shadow-[0_0_34px_rgba(139,92,246,0.52),0_14px_34px_rgba(79,70,229,0.28),inset_0_1px_0_rgba(255,255,255,0.24)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={handleSendMessage}
                    disabled={isLoading || (!inputValue.trim() && !attachments.length)}
                  >
                    {isLoading ? '...' : '↑'}
                  </button>
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <section className="relative overflow-hidden rounded-[1.5rem] border border-violet-100/14 bg-[linear-gradient(145deg,rgba(14,15,34,0.86),rgba(4,5,15,0.9))] p-5 shadow-[0_28px_100px_rgba(0,0,0,0.48),0_0_62px_rgba(124,58,237,0.16),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute right-[-80px] top-[-70px] h-44 w-44 rounded-full bg-violet-500/22 blur-3xl" />
                <div className="pointer-events-none absolute inset-0 bg-[url('/topography-field.svg')] bg-[length:640px_278px] bg-[center_top_-72px] opacity-[0.16] mix-blend-screen" />
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white">Matched for you</p>
                  <Link href="/opportunities" className="text-xs font-medium text-violet-200 transition hover:text-white">View all</Link>
                </div>
                <div className="space-y-3">
                  {matchedForYou.map((item) => (
                    <Link
                      key={item.title}
                      href="/opportunities"
                      className="group relative flex items-start gap-3 rounded-[1.1rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-3 shadow-[0_12px_36px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.065)] transition hover:border-violet-300/30 hover:bg-violet-500/10 hover:shadow-[0_16px_42px_rgba(124,58,237,0.16)]"
                    >
                      <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.tone} shadow-[0_0_24px_rgba(139,92,246,0.18)]`}>
                        ✦
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm leading-5 text-slate-100 group-hover:text-white">{item.title}</span>
                        <span className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-violet-200/75">
                          <span className="rounded-md bg-violet-500/12 px-2 py-0.5">{item.type}</span>
                          <span>{item.time}</span>
                        </span>
                      </span>
                      <span className="mt-1 h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_12px_rgba(74,222,128,0.65)]" />
                    </Link>
                  ))}
                </div>
                <Link href="/opportunities" className="relative mt-4 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-indigo-600 to-violet-700 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_34px_rgba(139,92,246,0.3),inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:brightness-110">
                  See more opportunities
                </Link>
              </section>

              <section className="relative overflow-hidden rounded-[1.5rem] border border-violet-100/14 bg-[linear-gradient(145deg,rgba(14,15,34,0.84),rgba(4,5,15,0.9))] p-5 shadow-[0_28px_95px_rgba(0,0,0,0.46),0_0_50px_rgba(124,58,237,0.12),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl">
                <div className="pointer-events-none absolute left-[-90px] bottom-[-90px] h-44 w-44 rounded-full bg-blue-500/14 blur-3xl" />
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white">Alex actions</p>
                  <span className="text-xs font-medium text-violet-200">Live</span>
                </div>
                <div className="space-y-2.5">
                  {alexActions.map((action) => (
                    <button
                      key={action.title}
                      type="button"
                      onClick={() => {
                        setInputValue(action.title);
                        inputRef.current?.focus();
                      }}
                      className="flex w-full items-center gap-3 rounded-[1rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(255,255,255,0.022))] p-3 text-left shadow-[0_10px_30px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.055)] transition hover:border-violet-300/30 hover:bg-violet-500/10 hover:shadow-[0_14px_38px_rgba(124,58,237,0.14)]"
                    >
                      <span className="h-4 w-4 flex-shrink-0 rounded-full border border-violet-200/35 bg-black/20 shadow-[0_0_18px_rgba(139,92,246,0.18),inset_0_0_8px_rgba(139,92,246,0.18)]" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-slate-100">{action.title}</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-400">{action.detail}</span>
                      </span>
                      <span className="text-violet-200">›</span>
                    </button>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>
      <div className="pointer-events-none fixed bottom-0 left-[164px] right-0 z-20 h-[76px] opacity-90 [mask-image:linear-gradient(to_top,black_16%,transparent)]">
        <img src="/audio-spectrum.svg" alt="" className="h-full w-full object-cover object-bottom mix-blend-screen drop-shadow-[0_0_24px_rgba(217,70,239,0.8)] contrast-125 saturate-150" />
      </div>
    </main>
  );
}
