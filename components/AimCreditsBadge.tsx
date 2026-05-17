export default function AimCreditsBadge() {
  return (
    <div className="fixed right-6 top-6 z-40 hidden lg:block">
      <div className="rounded-[1.5rem] border border-[#1E90FF]/15 bg-black/80 px-4 py-3 shadow-[0_30px_90px_rgba(30,144,255,0.18)] backdrop-blur-2xl">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#8ec6ff]">AIM Credits</p>
        <div className="mt-3 flex items-end gap-2">
          <p className="text-2xl font-semibold text-white">2,450</p>
          <span className="text-sm font-medium text-[#1E90FF]">CR</span>
        </div>
        <p className="mt-2 text-[11px] text-[#B7C8DA]">Next milestone: 3,000 CR</p>
      </div>
    </div>
  );
}
