async function request(path, options) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    let detail = `${options?.method || 'GET'} ${path} failed: ${res.status}`
    try {
      const body = await res.json()
      if (body?.detail) detail = typeof body.detail === 'string' ? body.detail : detail
    } catch {
      // response had no JSON body — keep the generic message
    }
    throw new Error(detail)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  health: () => request('/health'),
  briefing: () => request('/api/briefing'),

  tasks: () => request('/api/tasks'),
  events: () => request('/api/events'),

  auth: {
    me: () => request('/api/auth/me'),
    signup: (email, password, name) =>
      request('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
    login: (email, password) =>
      request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    logout: () => request('/api/auth/logout', { method: 'POST' }),
    updateProfile: (patch) => request('/api/auth/me', { method: 'PATCH', body: JSON.stringify(patch) }),
  },

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
