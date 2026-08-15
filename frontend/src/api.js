async function request(path, options) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`${options?.method || 'GET'} ${path} failed: ${res.status}`)
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  health: () => request('/health'),
  briefing: () => request('/api/briefing'),

  tasks: () => request('/api/tasks'),
  events: () => request('/api/events'),

  habits: {
    list: () => request('/api/habits'),
    create: (habit) => request('/api/habits', { method: 'POST', body: JSON.stringify(habit) }),
    toggle: (id, date) => request(`/api/habits/${id}/toggle`, { method: 'POST', body: JSON.stringify({ date }) }),
    remove: (id) => request(`/api/habits/${id}`, { method: 'DELETE' }),
  },

  shopping: {
    list: () => request('/api/shopping'),
    create: (item) => request('/api/shopping', { method: 'POST', body: JSON.stringify(item) }),
    toggle: (id) => request(`/api/shopping/${id}/toggle`, { method: 'POST' }),
    remove: (id) => request(`/api/shopping/${id}`, { method: 'DELETE' }),
  },
}
