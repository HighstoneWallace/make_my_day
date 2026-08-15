export default function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center text-[var(--text-3)]">
      {Icon && <Icon size={26} strokeWidth={1.6} className="opacity-60 mb-1" />}
      <div className="text-[13px]">{title}</div>
      {subtitle && <div className="text-[12px] text-[var(--text-3)]">{subtitle}</div>}
    </div>
  )
}
