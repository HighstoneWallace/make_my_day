import { CalendarCheck2, Flame, ShoppingBag, Wallet, StickyNote } from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/tasks', label: 'Tasks & Calendar', icon: CalendarCheck2 },
  { to: '/habits', label: 'Habits', icon: Flame },
  { to: '/shopping', label: 'Shopping', icon: ShoppingBag },
  { to: '/budget', label: 'Budget', icon: Wallet },
  { to: '/notes', label: 'Notes', icon: StickyNote },
]
