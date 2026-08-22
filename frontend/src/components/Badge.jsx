const TONES = {
  red: 'bg-red-500/15 text-red-400',
  amber: 'bg-amber-500/15 text-amber-400',
  green: 'bg-emerald-500/15 text-emerald-400',
  accent: 'bg-accent-500/20 text-accent-400',
  muted: 'bg-[var(--surf-2)] text-[var(--text-3)]',
}

export default function Badge({ tone = 'muted', children, dot = false, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap ${TONES[tone]} ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {children}
    </span>
  )
}
