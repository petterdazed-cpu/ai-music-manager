'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
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

  const historyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // scroll to bottom when messages change
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue('');
    setErrorText(null);

    const userMsg = { id: `u-${Date.now()}`, role: 'user' as const, text: userText };
    const assistantId = `a-${Date.now()}`;
    const assistantMsg = { id: assistantId, role: 'alex' as const, text: '' };

    setMessages((m) => [...m, userMsg, assistantMsg]);
    setIsLoading(true);

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
                setMessages((prev) => prev.map(pm => pm.id === assistantId ? { ...pm, text: pm.text + delta } : pm));
              }
            } catch (e) {
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
              setMessages((prev) => prev.map(pm => pm.id === assistantId ? { ...pm, text: pm.text + delta } : pm));
            }
          } catch (e) {}
        }
      }

      console.log('Chat response stream finished');
    } catch (err) {
      console.error('Failed to send message:', err);
      const msg = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setErrorText(msg);
      setMessages((m) => m.map(pm => pm.role === 'alex' && pm.text === '' ? { ...pm, text: `Error: ${msg}` } : pm));
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

          {/* Slim ticker-style Industry Feed */}
          <div className="mx-auto mt-6 mb-4 w-full max-w-[760px]">
            <div className="overflow-hidden rounded-full border border-white/6 bg-black/20 px-3 py-2">
              <div className="flex gap-3 items-center text-sm text-[#D7E6FF]">
                <span className="text-[#0ea5e9] mr-2">LIVE</span>
                <div className="flex gap-4 animate-marquee-left hover:animation-play-state-paused">
                  {feedItems.concat(feedItems).map((item, index) => {
                    const id = typeof item === 'string' ? `feed-${index}` : item.id;
                    const title = typeof item === 'string' ? item : item.title;
                    return (
                      <Link
                        key={`ticker-${index}`}
                        href={`/opportunities/${encodeURIComponent(id)}`}
                        className="flex-shrink-0 rounded-full px-3 py-1 text-xs text-[#D7E6FF] hover:text-white"
                      >
                        {title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
              .animate-marquee-left { animation: marquee-left 30s linear infinite; }
              .animate-marquee-left:hover { animation-play-state: paused; }
            ` }} />
          </div>

          {/* Chat panel */}
          <div className="mx-auto mt-4 w-full max-w-[760px]">
            <div className="flex flex-col h-[560px] rounded-[1.5rem] border border-[#0ea5e9]/12 bg-white/[0.02] p-0 shadow-[0_20px_80px_rgba(10,132,255,0.12)] backdrop-blur-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/6 text-left">
                <div className="text-sm text-[#D7E6FF]">Alex</div>
                <div className="mt-1 text-xs text-[#B7C8DA]">Morning. What are we moving forward today — release, promo, or strategy?</div>
              </div>

              <div ref={historyRef} className="flex-1 overflow-y-auto p-6 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={
                      m.role === 'user'
                        ? 'rounded-2xl px-4 py-2 bg-[#0ea5e9] text-black text-sm max-w-[80%]'
                        : m.role === 'alex'
                        ? 'rounded-2xl px-4 py-2 bg-white/[0.02] border border-white/6 text-[#D7E6FF] text-sm max-w-[80%]'
                        : 'rounded-2xl px-4 py-2 bg-[#ff4d4f]/10 border border-[#ff4d4f]/20 text-[#ffb3b3] text-sm max-w-[80%]'
                    }>
                      <div className="whitespace-pre-wrap">{m.text}{isLoading && m.role === 'alex' ? <span className="inline-block ml-1 w-1 h-4 bg-white animate-pulse" /> : null}</div>
                    </div>
                  </div>
                ))}
                {errorText ? <div className="text-sm text-[#ffb3b3]">{errorText}</div> : null}
              </div>

              <div className="px-4 py-3 border-t border-white/6 bg-black/10">
                <div className="mb-3 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button key={s} className="rounded-full bg-black/20 px-3 py-1 text-xs text-[#D7E6FF] hover:bg-[#0ea5e9]/8" onClick={() => setInputValue(s)}>{s}</button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <textarea
                    className="flex-1 max-h-24 min-h-[48px] resize-none rounded-xl bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-[#B7C8DA]"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                  />
                  <button
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0ea5e9] text-lg font-bold text-white shadow-[0_0_25px_rgba(14,165,233,0.45)] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                  >
                    {isLoading ? '...' : '↑'}
                  </button>
                </div>
              </div>
            </div>
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