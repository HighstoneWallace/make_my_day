import { CalendarCheck2, Flame, ShoppingBag, Wallet, StickyNote } from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/', label: 'Tasks & Calendar', icon: CalendarCheck2, end: true },
  { to: '/habits', label: 'Habits', icon: Flame },
  { to: '/shopping', label: 'Shopping', icon: ShoppingBag },
  { to: '/budget', label: 'Budget', icon: Wallet },
  { to: '/notes', label: 'Notes', icon: StickyNote },
]
