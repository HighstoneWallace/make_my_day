import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { api } from '../api.js'

const AuthContext = createContext(null)

// Mirrors the backend's SESSION_IDLE_TIMEOUT_SECONDS (app/auth/security.py) —
// keep both in sync if either changes.
const IDLE_TIMEOUT_MS = 30 * 60 * 1000
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll', 'wheel']

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const idleTimer = useRef(null)

  useEffect(() => {
    api.auth
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const u = await api.auth.login(email, password)
    setUser(u)
    return u
  }, [])

  const signup = useCallback(async (email, password, name) => {
    const u = await api.auth.signup(email, password, name)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.auth.logout()
    } finally {
      setUser(null)
    }
  }, [])

  const updateProfile = useCallback(async (patch) => {
    const u = await api.auth.updateProfile(patch)
    setUser(u)
    return u
  }, [])

  // Auto-logout after a stretch of inactivity, independent of any API calls —
  // otherwise a user idling on a page that never fetches would stay "logged
  // in" in the UI even after the backend session has expired.
  useEffect(() => {
    if (!user) return

    const resetIdleTimer = () => {
      clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(logout, IDLE_TIMEOUT_MS)
    }

    resetIdleTimer()
    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, resetIdleTimer))

    return () => {
      clearTimeout(idleTimer.current)
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, resetIdleTimer))
    }
  }, [user, logout])

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
