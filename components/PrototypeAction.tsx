'use client';

import { useState } from 'react';

type PrototypeActionProps = {
  label: string;
  title?: string;
  message?: string;
  result?: string;
  className?: string;
  fullWidth?: boolean;
};

export default function PrototypeAction({
  label,
  title,
  message,
  result = 'Task created',
  className,
  fullWidth = false,
}: PrototypeActionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className || `${fullWidth ? 'w-full ' : ''}rounded-full bg-[#0ea5ff] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#12b0ff]`}
      >
        {label}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[460px] rounded-[2rem] border border-[#0ea5e9]/20 bg-[#030914]/98 p-6 text-left shadow-[0_30px_120px_rgba(10,132,255,0.26)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#8ec6ff]">{result}</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{title || label}</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#D7E6FF] transition hover:bg-white/10"
                aria-label="Close prototype confirmation"
              >
                Close
              </button>
            </div>
            <p className="mt-5 text-sm leading-6 text-[#B7C8DA]">
              {message || 'Alex prepared a prototype next step and added it to your AIM workspace.'}
            </p>
            <div className="mt-6 rounded-[1.5rem] border border-[#0ea5e9]/12 bg-[#061229]/95 p-4 text-sm text-[#D7E6FF]">
              <p className="font-semibold text-white">Alex suggestion</p>
              <p className="mt-2">Review the draft, attach the strongest asset, then move it into outreach or your release workflow.</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
