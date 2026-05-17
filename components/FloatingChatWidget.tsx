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
        body: JSON.stringify({ message: trimmed, stream: false }),
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
        <div className="w-[360px] max-w-[92vw] rounded-[2rem] border border-[#1E90FF]/20 bg-black/95 p-4 shadow-[0_35px_90px_rgba(30,144,255,0.24)] backdrop-blur-3xl">
          <div className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-[#0b172b]/95 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1E90FF]/15 text-2xl text-[#1E90FF] shadow-[0_0_20px_rgba(30,144,255,0.2)]">
                A
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[#8ec6ff]">Alex</p>
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
            className="mt-4 max-h-[320px] space-y-3 overflow-y-auto rounded-[1.5rem] border border-white/10 bg-[#08111f]/90 p-4 text-sm text-[#E5EAF8]"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-3xl p-3 ${message.role === 'assistant' ? 'bg-[#11203a]/90 text-[#D7E6FF]' : 'bg-[#0a1528]/90 text-[#B3D2FF]'} ${message.role === 'user' ? 'ml-auto max-w-[85%]' : 'max-w-[90%]'}`}
              >
                {message.text}
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-2 rounded-3xl bg-[#11203a]/90 px-3 py-2 text-sm text-[#B7D6FF]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#1E90FF] animate-pulse" />
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
                  className="rounded-full border border-[#1E90FF]/20 bg-[#1E90FF]/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#D7E6FF] transition hover:bg-[#1E90FF]/15"
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
                className="min-h-[52px] flex-1 resize-none rounded-[1.5rem] border border-white/10 bg-[#04101f]/90 px-4 py-3 text-sm text-white outline-none focus:border-[#1E90FF]/60 focus:ring-2 focus:ring-[#1E90FF]/20"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputValue.trim() || isSending}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#1E90FF] px-5 text-sm font-semibold text-black transition hover:bg-[#4fb3ff] disabled:cursor-not-allowed disabled:opacity-60"
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
          className="widget-glow group relative flex h-16 w-16 items-center justify-center rounded-full border border-[#1E90FF]/30 bg-[#07142c]/95 text-[#D7E6FF] shadow-[0_20px_60px_rgba(30,144,255,0.24)] transition duration-300 hover:-translate-y-1 hover:bg-[#1E90FF]/20"
          aria-label="Open Alex chat"
        >
          <span className="absolute inset-0 rounded-full bg-[#1E90FF]/20 blur-xl opacity-60" />
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
