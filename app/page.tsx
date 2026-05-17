'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
import { industryFeed } from '@/lib/mockData';

type FeedItem = (typeof industryFeed)[number];

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
  const [logoSize, setLogoSize] = useState(520);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'alex' | 'error'; text: string }[]>([]);
  const [errorText, setErrorText] = useState<string | null>(null);
  const streamQueueRef = useRef('');
  const streamTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      else setLogoSize(520);
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

  useEffect(() => {
    return () => {
      if (streamTimerRef.current) clearTimeout(streamTimerRef.current);
    };
  }, []);

  const flushAssistantStream = (assistantId: string) => {
    if (streamTimerRef.current) {
      clearTimeout(streamTimerRef.current);
      streamTimerRef.current = null;
    }

    if (!streamQueueRef.current) return;

    const queuedText = streamQueueRef.current;
    streamQueueRef.current = '';
    setMessages((prev) => prev.map((pm) => pm.id === assistantId ? { ...pm, text: pm.text + queuedText } : pm));
  };

  const appendAssistantDelta = (assistantId: string, delta: string) => {
    streamQueueRef.current += delta;

    if (streamTimerRef.current) return;

    streamTimerRef.current = setTimeout(() => {
      streamTimerRef.current = null;
      if (!streamQueueRef.current) return;

      const queuedText = streamQueueRef.current;
      streamQueueRef.current = '';
      setMessages((prev) => prev.map((pm) => pm.id === assistantId ? { ...pm, text: pm.text + queuedText } : pm));
    }, 70);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue('');
    setErrorText(null);

    const userMsg = { id: `u-${Date.now()}`, role: 'user' as const, text: userText };
    const assistantId = `a-${Date.now()}`;
    const assistantMsg = { id: assistantId, role: 'alex' as const, text: '' };

    streamQueueRef.current = '';
    setMessages((m) => [...m, userMsg, assistantMsg]);
    setIsLoading(true);
    setStreamingMessageId(assistantId);

    try {
      console.log('Sending message to /api/chat', userText);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      if (!res.ok || !res.body) {
        const text = await res.text();
        console.error('Chat error', text);
        setErrorText('Failed to get a response from Alex');
        setMessages((m) => m.map(msg => msg.id === assistantId ? { ...msg, text: 'Error: failed to get response.' } : msg));
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
                appendAssistantDelta(assistantId, delta);
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
              appendAssistantDelta(assistantId, delta);
            }
          } catch {}
        }
      }

      flushAssistantStream(assistantId);
      console.log('Chat response stream finished');
    } catch (err) {
      console.error('Failed to send message:', err);
      const msg = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setErrorText(msg);
      setMessages((m) => m.map(pm => pm.role === 'alex' && pm.text === '' ? { ...pm, text: `Error: ${msg}` } : pm));
    } finally {
      flushAssistantStream(assistantId);
      setIsLoading(false);
      setStreamingMessageId(null);
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

      <section className="flex min-h-screen items-center justify-center px-8 py-8 pl-48">
        <div className="w-full max-w-[1080px] text-center">
          <div className="relative mb-4 flex flex-col items-center">
            <div className="mb-2 flex w-full items-center justify-center">
              <img src="/aim-logo-v2.svg" alt="AIM" style={{ width: logoSize, height: 'auto' }} className="object-contain" />
            </div>
            <p className="text-center text-base uppercase tracking-[0.35em] text-[#B7C8DA]">
              YOUR PARTNER IN THE MUSIC INDUSTRY
            </p>

          </div>

          {/* Slim ticker-style Industry Feed */}
          <div className="mx-auto mb-2 mt-0 w-full max-w-[960px]">
            <div className="overflow-hidden rounded-[1.5rem] border border-[#0ea5e9]/12 bg-[#05131f]/88 px-3 py-2 shadow-[0_0_40px_rgba(14,165,233,0.08)]">
              <div className="flex items-center text-sm text-[#D7E6FF]">
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
          <div className="mx-auto mt-2 w-full max-w-[960px]">
            <div className="flex h-[390px] max-h-[45vh] min-h-[360px] flex-col overflow-hidden rounded-[1.5rem] border border-[#0ea5e9]/14 bg-white/[0.03] p-0 shadow-[0_20px_90px_rgba(10,132,255,0.12)] backdrop-blur-xl">
              <div className="border-b border-white/8 bg-[#07131f]/80 px-6 py-3 text-left">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A8D9FF]">Alex</div>
                <div className="mt-1 text-sm font-medium leading-6 text-[#E8F4FF]">
                  Morning. What are we moving forward today — release, promo, or strategy?
                </div>
              </div>

              <div ref={historyRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-6 py-5">
                {messages.map((m) => (
                  <div key={m.id} className="flex justify-start">
                    <div className={
                      m.role === 'user'
                        ? 'max-w-[82%] rounded-[1.15rem] border border-[#0ea5e9]/22 bg-[#0ea5e9]/14 px-4 py-3 text-left text-sm leading-7 text-[#F2FAFF] shadow-[0_8px_24px_rgba(14,165,233,0.08)]'
                        : m.role === 'alex'
                        ? 'max-w-[86%] rounded-[1.15rem] border border-white/8 bg-white/[0.035] px-4 py-3 text-left text-sm leading-7 text-[#D7E6FF] shadow-[0_8px_24px_rgba(10,132,255,0.05)]'
                        : 'max-w-[86%] rounded-[1.15rem] border border-[#ff4d4f]/20 bg-[#ff4d4f]/10 px-4 py-3 text-left text-sm leading-7 text-[#ffb3b3]'
                    }>
                      <div className="whitespace-pre-wrap break-words">
                        {m.text}
                        {isLoading && m.id === streamingMessageId ? (
                          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[#BFE5FF] align-middle opacity-80 animate-pulse" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
                {errorText ? <div className="text-sm text-[#ffb3b3]">{errorText}</div> : null}
              </div>
              <div className="flex-shrink-0 border-t border-white/8 bg-[#050f19]/92 px-5 py-3">
                <div className="mb-2 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
                  {suggestions.map((s) => (
                    <button key={s} className="flex-shrink-0 rounded-full border border-white/8 bg-transparent px-2.5 py-1 text-[11px] font-medium tracking-[0.08em] text-[#D7E6FF] transition hover:border-[#0ea5e9]/18 hover:bg-[#0ea5e9]/10" onClick={() => setInputValue(s)}>{s}</button>
                  ))}
                </div>

                <div className="flex items-center gap-2.5">
                  <textarea
                    className="min-h-[54px] flex-1 resize-none rounded-[0.875rem] border border-white/12 bg-[#03101b]/96 px-4 py-2.5 text-sm leading-6 text-white outline-none placeholder:text-[#C6E1FF] focus:border-[#0ea5e9]/40 focus:ring-2 focus:ring-[#0ea5e9]/12"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                  />
                  <button
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#0ea5e9] text-lg font-bold text-black shadow-[0_0_25px_rgba(14,165,233,0.45)] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                  >
                    {isLoading ? '...' : '↑'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-[#B7C8DA] uppercase tracking-[0.2em] font-medium">
              INSIGHTS. OPPORTUNITIES. CONNECTIONS. POWERED BY AIM.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
