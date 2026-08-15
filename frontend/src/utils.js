export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function last7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - 6 + i)
    return d
  })
}

export function dateStr(d) {
  return d.toISOString().slice(0, 10)
}

export function fmtTime(iso) {
  if (!iso || iso.length === 10) return null
  return new Date(iso).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function eventDuration(start, end) {
  if (!start || !end || start.length === 10) return null
  const m = Math.round((new Date(end) - new Date(start)) / 60000)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  const rem = m % 60
  return rem ? `${h}h ${rem}m` : `${h}h`
}

export function eventStatus(start, end) {
  if (!start || start.length === 10) return 'allday'
  const now = Date.now()
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  if (now >= s && now < e) return 'ongoing'
  if (now >= e) return 'past'
  return 'future'
}

export function dueInfo(dueStr) {
  if (!dueStr) return null
  const due = new Date(dueStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  const diff = Math.round((due - now) / 86400000)
  if (diff < 0) return { label: 'Overdue', tone: 'red' }
  if (diff === 0) return { label: 'Today', tone: 'amber' }
  if (diff === 1) return { label: 'Tomorrow', tone: 'muted' }
  return { label: due.toLocaleDateString('en', { month: 'short', day: 'numeric' }), tone: 'muted' }
}

export function greeting() {
  const h = new Date().getHours()
  if (h < 5) return 'Good night'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
