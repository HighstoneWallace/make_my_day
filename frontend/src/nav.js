import { CalendarCheck2, Flame, ShoppingBag, Wallet, StickyNote, Users } from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/tasks', label: 'Tasks & Calendar', icon: CalendarCheck2 },
  { to: '/habits', label: 'Habits', icon: Flame },
  { to: '/shopping', label: 'Shopping', icon: ShoppingBag },
  { to: '/budget', label: 'Budget', icon: Wallet },
  { to: '/shared-costs', label: 'Shared Costs', icon: Users },
  { to: '/notes', label: 'Notes', icon: StickyNote },
]
