'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    text: 'Hi, I’m Alex — your AI music manager. Ask me about promotion, release planning or career strategy.',
  },
];

const suggestionChips = [
  'Help with promotion',
  'Build release plan',
  'Artist strategy',
  'Industry outreach',
  'Find sync opportunities',
];
const managerSettingsStorageKey = 'aimManagerSettings';

const loadStoredManagerSettings = () => {
  const stored = window.localStorage.getItem(managerSettingsStorageKey);
  if (!stored) return undefined;
  try {
    return JSON.parse(stored);
  } catch {
    return undefined;
  }
};

export default function FloatingChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const element = listRef.current;
    element.scrollTop = element.scrollHeight;
  }, [messages, open]);

  const handleToggle = () => setOpen((value) => !value);

  const appendMessage = (role: ChatMessage['role'], text: string) => {
    setMessages((current) => [
      ...current,
      { id: `${role}-${Date.now()}`, role, text },
    ]);
  };

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isSending) return;

    appendMessage('user', trimmed);
    setInputValue('');
    setIsSending(true);
    setTyping(true);
    setOpen(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          stream: false,
          managerSettings: loadStoredManagerSettings(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.reply) {
        appendMessage('assistant', 'Alex is having trouble responding right now. Please try again.');
        return;
      }

      appendMessage('assistant', data.reply);
    } catch (error) {
      console.error(error);
      appendMessage('assistant', 'Alex could not connect to the chat service. Try again in a moment.');
    } finally {
      setIsSending(false);
      setTyping(false);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const applySuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setOpen(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-[360px] max-w-[92vw] rounded-[2rem] border border-violet-300/20 bg-[#050510]/95 p-4 shadow-[0_35px_100px_rgba(124,58,237,0.28)] backdrop-blur-3xl">
          <div className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-[#0A0B1B]/95 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 via-indigo-500 to-cyan-300 text-2xl font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.35)]">
                A
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-violet-200">Alex</p>
                <p className="text-base font-semibold">AI Music Manager</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={handleToggle}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#D7E6FF] transition hover:bg-white/10"
            >
              Close
            </button>
          </div>

          <div
            ref={listRef}
            className="mt-4 max-h-[320px] space-y-3 overflow-y-auto rounded-[1.5rem] border border-white/10 bg-[#080817]/90 p-4 text-sm text-[#E5EAF8]"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-3xl p-3 ${message.role === 'assistant' ? 'bg-white/[0.055] text-slate-200' : 'bg-violet-500/14 text-white'} ${message.role === 'user' ? 'ml-auto max-w-[85%]' : 'max-w-[90%]'}`}
              >
                {message.text}
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-2 rounded-3xl bg-white/[0.055] px-3 py-2 text-sm text-violet-100">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-violet-400" />
                <span>Alex is typing...</span>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {suggestionChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => applySuggestion(chip)}
                  className="rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 transition hover:bg-violet-500/15"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="flex items-end gap-3">
              <textarea
                rows={1}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Send Alex a message..."
                className="min-h-[52px] flex-1 resize-none rounded-[1.5rem] border border-white/10 bg-[#090A18]/90 px-4 py-3 text-sm text-white outline-none focus:border-violet-300/60 focus:ring-2 focus:ring-violet-500/20"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputValue.trim() || isSending}
                className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 via-indigo-500 to-cyan-300 px-5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleToggle}
          className="widget-glow group relative flex h-16 w-16 items-center justify-center rounded-full border border-violet-300/30 bg-[#080817]/95 text-white shadow-[0_20px_70px_rgba(124,58,237,0.32)] transition duration-300 hover:-translate-y-1 hover:bg-violet-500/20"
          aria-label="Open Alex chat"
        >
          <span className="absolute inset-0 rounded-full bg-violet-500/25 opacity-70 blur-xl" />
          <span className="relative z-10 text-2xl">A</span>
        </button>
      )}

      <div dangerouslySetInnerHTML={{
        __html: `
          <style>
            @keyframes widget-glow {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-2px); }
            }
            .widget-glow {
              animation: widget-glow 4.5s ease-in-out infinite;
            }
          </style>
        `
      }} />
    </div>
  );
}
