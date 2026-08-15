function todayShort() {
  return new Date().toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-30 glass border-b border-white/[0.06] px-4 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-accent-400 shadow-glow-sm" />
        <span className="text-[14px] font-semibold tracking-tight">MakeMyDay</span>
      </div>
      <span className="text-[12px] text-[var(--text-3)]">{todayShort()}</span>
    </header>
  )
}
