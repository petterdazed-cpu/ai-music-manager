export default function AimCreditsBadge() {
  return (
    <div className="fixed right-6 top-6 z-40 hidden lg:block">
      <div className="rounded-[1.5rem] border border-violet-300/15 bg-[#070817]/75 px-4 py-3 shadow-[0_30px_90px_rgba(124,58,237,0.24)] backdrop-blur-2xl">
        <p className="text-[11px] uppercase tracking-[0.35em] text-violet-200">AIM Credits</p>
        <div className="mt-3 flex items-end gap-2">
          <p className="text-2xl font-semibold text-white">2,450</p>
          <span className="text-sm font-medium text-[#8B5CF6]">CR</span>
        </div>
        <p className="mt-2 text-[11px] text-[#B7C8DA]">Next milestone: 3,000 CR</p>
      </div>
    </div>
  );
}
