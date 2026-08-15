import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { NAV_ITEMS } from '../nav.js'
import AccountMenu from './AccountMenu.jsx'

function todayLabel() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r border-white/[0.06] px-5 py-6">
      <div className="mb-8">
        <AccountMenu showChevron />
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'text-white' : 'text-[var(--text-2)] hover:text-white hover:bg-white/[0.04]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-accent-500/15 border border-accent-500/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon size={17} className="relative shrink-0" strokeWidth={2} />
                <span className="relative">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/[0.06] px-1">
        <div className="text-[10px] uppercase tracking-wider text-[var(--text-3)] font-semibold mb-1">Today</div>
        <div className="text-[13px] text-[var(--text-2)] leading-snug">{todayLabel()}</div>
      </div>
    </aside>
  )
}
