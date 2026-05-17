'use client';

import Link from 'next/link';
import { useState, useEffect, type KeyboardEvent } from 'react';
import { industryFeed } from '@/lib/mockData';

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
  const [headline, setHeadline] = useState("What's the move?");
  const [subheadline, setSubheadline] = useState("Talk to Alex — your AI music manager.");
  const [placeholder, setPlaceholder] = useState("Ask Alex anything about your music career...");
  const [suggestions, setSuggestions] = useState(defaultSuggestions);
  const [feedItems, setFeedItems] = useState(industryFeed);
  const [logoSize, setLogoSize] = useState(520);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'alex' | 'error'; text: string }[]>([]);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    const storedHeadline = localStorage.getItem('headline');
    if (storedHeadline) setHeadline(storedHeadline);

    const storedSubheadline = localStorage.getItem('subheadline');
    if (storedSubheadline) setSubheadline(storedSubheadline);

    const storedPlaceholder = localStorage.getItem('placeholder');
    if (storedPlaceholder) setPlaceholder(storedPlaceholder);

    const storedSuggestions = localStorage.getItem('suggestions');
    if (storedSuggestions) {
      setSuggestions(storedSuggestions.split('\n').filter(s => s.trim()));
    }

    const storedFeedItems = localStorage.getItem('feedItems');
    if (storedFeedItems) {
      try {
        const parsed = JSON.parse(storedFeedItems);
        if (Array.isArray(parsed) && parsed.length && typeof parsed[0] === 'object') {
          setFeedItems(parsed as any);
        } else if (Array.isArray(parsed)) {
          // array of strings -> convert to objects
          setFeedItems(parsed.map((t: string, i: number) => ({ id: `stored-${i}`, title: String(t) })));
        } else {
          // fallback to newline-split
          setFeedItems(storedFeedItems.split('\n').filter((s) => s.trim()).map((t) => ({ id: t.slice(0, 40).replace(/[^a-z0-9]+/gi, '-').toLowerCase(), title: t })));
        }
      } catch (e) {
        // not JSON, treat as newline-separated titles
        setFeedItems(storedFeedItems.split('\n').filter((s) => s.trim()).map((t, i) => ({ id: `stored-${i}`, title: t })));
      }
    }

    const storedLogoSize = localStorage.getItem('logoSize');
    if (storedLogoSize) setLogoSize(parseInt(storedLogoSize));
    else setLogoSize(520);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageToSend = inputValue.trim();
    // show user message immediately
    const userMsg = { id: `u-${Date.now()}`, role: 'user' as const, text: messageToSend };
    setMessages((m) => [...m, userMsg]);
    setErrorText(null);

    setIsLoading(true);

    try {
      console.log('Sending message to /api/chat', inputValue);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue }),
      });

      const data = await response.json();
      console.log('Chat response', data);

      if (!response.ok) {
        const err = data?.error || 'Failed to get a response from Alex';
        console.error('Chat error:', err);
        setErrorText(err);
        setMessages((m) => [...m, { id: `e-${Date.now()}`, role: 'error', text: err }] );
        return;
      }

      if (data?.reply) {
        setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'alex', text: String(data.reply) }]);
      } else {
        setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'alex', text: 'No reply from Alex.' }]);
      }

      // clear input after sending
      setInputValue('');
    } catch (err) {
      console.error('Failed to send message:', err);
      const msg = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setErrorText(msg);
      setMessages((m) => [...m, { id: `e-${Date.now()}`, role: 'error', text: msg }] );
    } finally {
      setIsLoading(false);
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

      <section className="flex min-h-screen items-center justify-center px-8 pl-48">
        <div className="w-full max-w-[1080px] text-center">
          <div className="mb-14 relative">
            <div className="mb-4 flex items-center justify-center">
              <img src="/aim-logo-v2.svg" alt="AIM" style={{ width: logoSize, height: 'auto' }} className="object-contain" />
            </div>
            <p className="text-base uppercase tracking-[0.35em] text-[#B7C8DA]">
              YOUR PARTNER IN THE MUSIC INDUSTRY
            </p>

          </div>

          <div className="mx-auto mt-12 mb-3 flex w-full max-w-[760px] items-start gap-4 rounded-[2rem] border border-[#0ea5e9]/15 bg-white/[0.04] px-5 py-6 shadow-[0_0_70px_rgba(10,132,255,0.12)] backdrop-blur-xl">
            <button disabled className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#0ea5e9]/10 text-xl text-[#0ea5e9] shadow-[0_0_25px_rgba(14,165,233,0.2)] border border-[#0ea5e9]/20 opacity-50 cursor-not-allowed">
              ↑
            </button>

            <textarea
              className="flex-1 min-h-[88px] max-w-full resize-none rounded-3xl bg-transparent px-3 py-4 text-lg text-white outline-none placeholder:text-[#B7C8DA] focus:ring-0"
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />

            <button 
              className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0ea5e9] text-xl font-bold text-white shadow-[0_0_35px_rgba(14,165,233,0.55)] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? '...' : '↑'}
            </button>
          </div>

          {/* TODO: connect upload button to Music file storage / intent routing later. */}

          {/* Messages (user + Alex replies + errors) */}
          <div className="mx-auto mt-6 w-full max-w-[760px]">
            {messages.map((m) => (
              <div key={m.id} className={`mb-3 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={
                  m.role === 'user'
                    ? 'rounded-2xl px-4 py-2 bg-[#0ea5e9] text-black text-sm max-w-[82%]'
                    : m.role === 'alex'
                    ? 'rounded-2xl px-4 py-2 bg-white/[0.02] border border-white/6 text-[#D7E6FF] text-sm max-w-[82%]'
                    : 'rounded-2xl px-4 py-2 bg-[#ff4d4f]/10 border border-[#ff4d4f]/20 text-[#ffb3b3] text-sm max-w-[82%]'
                }>
                  {m.text}
                </div>
              </div>
            ))}
            {errorText ? (
              <div className="mt-2 text-center text-sm text-[#ffb3b3]">{errorText}</div>
            ) : null}
          </div>

          <div className="mx-auto mt-10 flex flex-wrap justify-center gap-3 max-w-[860px]">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="rounded-full border border-[#0ea5e9]/20 bg-black/30 px-5 py-3 text-sm text-[#D7E6FF] transition hover:border-[#0ea5e9] hover:bg-[#0ea5e9]/10"
                onClick={() => setInputValue(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="mx-auto mt-16 w-full max-w-[980px] rounded-[2rem] border border-[#0ea5e9]/15 bg-black/60 p-6 shadow-[0_20px_80px_rgba(10,132,255,0.18)] backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold">Industry Feed</h3>
                <span className="h-2 w-2 rounded-full bg-[#0ea5e9]" />
                <span className="text-sm text-[#AED7FF]">LIVE</span>
              </div>
              <span className="text-[#0ea5ff] text-xl">&gt;</span>
            </div>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[1.75rem] border border-white/5 bg-black/20 px-3 py-2">
                <div className="flex gap-4 animate-marquee-left hover:animation-play-state-paused">
                  {feedItems.concat(feedItems).map((item, index) => {
                    const id = typeof item === 'string' ? `feed-${index}` : item.id;
                    const title = typeof item === 'string' ? item : item.title;
                    return (
                      <Link
                        key={`row1-${index}`}
                        href={`/opportunities/${encodeURIComponent(id)}`}
                        className="flex-shrink-0 rounded-full border border-white/10 bg-[#07101a]/90 px-4 py-2 shadow-[0_2px_12px_rgba(10,132,255,0.12)] text-sm text-[#D7E6FF] whitespace-nowrap transition hover:border-[#0ea5ff]/30 hover:text-white"
                      >
                        {title}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="overflow-hidden rounded-[1.75rem] border border-white/5 bg-black/20 px-3 py-2">
                <div className="flex gap-4 animate-marquee-right hover:animation-play-state-paused">
                  {feedItems.concat(feedItems).map((item, index) => {
                    const id = typeof item === 'string' ? `feed-${index}` : item.id;
                    const title = typeof item === 'string' ? item : item.title;
                    return (
                      <Link
                        key={`row2-${index}`}
                        href={`/opportunities/${encodeURIComponent(id)}`}
                        className="flex-shrink-0 rounded-full border border-white/10 bg-[#07101a]/90 px-4 py-2 shadow-[0_2px_12px_rgba(10,132,255,0.12)] text-sm text-[#D7E6FF] whitespace-nowrap transition hover:border-[#0ea5ff]/30 hover:text-white"
                      >
                        {title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes marquee-left {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                @keyframes marquee-right {
                  0% { transform: translateX(-50%); }
                  100% { transform: translateX(0); }
                }
                .animate-marquee-left {
                  animation: marquee-left 35s linear infinite;
                }
                .animate-marquee-right {
                  animation: marquee-right 35s linear infinite;
                }
                .animate-marquee-left:hover, .animate-marquee-right:hover {
                  animation-play-state: paused;
                }
              `
            }} />
          </div>


          <div className="mt-20 text-center">
            <p className="text-xs text-[#B7C8DA] uppercase tracking-[0.2em] font-medium">
              INSIGHTS. OPPORTUNITIES. CONNECTIONS. POWERED BY AIM.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}