import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../nav.js'

export default function MobileTabBar() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-white/[0.08] px-1 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch justify-between">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-accent-400' : 'text-[var(--text-3)]'
              }`
            }
          >
            <Icon size={19} strokeWidth={2.1} />
            <span className="truncate max-w-[64px]">{label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
