import AccountMenu from './AccountMenu.jsx'

function todayShort() {
  return new Date().toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-30 glass border-b border-white/[0.06] px-3 py-2 flex items-center justify-between">
      <AccountMenu />
      <span className="text-[12px] text-[var(--text-3)] shrink-0 pr-1">{todayShort()}</span>
    </header>
  )
}
