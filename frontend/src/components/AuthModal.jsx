import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, User, X } from 'lucide-react'
import { useAuth } from '../auth/AuthContext.jsx'

export default function AuthModal({ open, initialMode = 'login', onClose }) {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  // The modal instance stays mounted while `open` toggles, so the mode has
  // to be re-synced from the prop each time it's reopened — otherwise it's
  // stuck on whatever mode it was first opened with (e.g. "Get started
  // free" would keep showing the login form after "Log in" was clicked once).
  useEffect(() => {
    if (open) setMode(initialMode)
  }, [open, initialMode])

  const reset = () => {
    setEmail('')
    setPassword('')
    setName('')
    setError('')
    setSubmitting(false)
  }

  const close = () => {
    reset()
    onClose()
  }

  const switchMode = (next) => {
    setMode(next)
    setError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (mode === 'signup') {
        await signup(email, password, name)
      } else {
        await login(email, password)
      }
      reset()
      onClose()
      navigate('/tasks')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-full max-w-sm glass-strong rounded-2xl p-7"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--surf-2)] transition-colors"
            >
              <X size={15} />
            </button>

            <h2 className="text-[19px] font-bold tracking-tight text-[var(--text-1)] mb-1">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-[13px] text-[var(--text-2)] mb-6">
              {mode === 'login' ? 'Log in to your MakeMyDays account.' : 'Your data stays private to your account.'}
            </p>

            <form onSubmit={submit} className="flex flex-col gap-3">
              {mode === 'signup' && (
                <label className="flex items-center gap-2.5 bg-[var(--surf-2)] border border-[var(--border)] rounded-lg px-3 py-2.5 focus-within:border-accent-400 transition-colors">
                  <User size={15} className="text-[var(--text-3)] shrink-0" />
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[var(--text-3)]"
                  />
                </label>
              )}

              <label className="flex items-center gap-2.5 bg-[var(--surf-2)] border border-[var(--border)] rounded-lg px-3 py-2.5 focus-within:border-accent-400 transition-colors">
                <Mail size={15} className="text-[var(--text-3)] shrink-0" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[var(--text-3)]"
                />
              </label>

              <label className="flex items-center gap-2.5 bg-[var(--surf-2)] border border-[var(--border)] rounded-lg px-3 py-2.5 focus-within:border-accent-400 transition-colors">
                <Lock size={15} className="text-[var(--text-3)] shrink-0" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Password (min. 8 characters)' : 'Password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  minLength={mode === 'signup' ? 8 : undefined}
                  className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[var(--text-3)]"
                />
              </label>

              {error && <div className="text-[12.5px] text-red-400 -mt-1">{error}</div>}

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 w-full py-2.5 rounded-lg text-[14px] font-medium bg-accent-500 text-white hover:bg-accent-400 transition-all disabled:opacity-40"
              >
                {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
              </button>
            </form>

            <div className="text-[13px] text-[var(--text-3)] text-center mt-5">
              {mode === 'login' ? (
                <>Don't have an account?{' '}
                  <button onClick={() => switchMode('signup')} className="text-accent-400 hover:underline font-medium">
                    Sign up
                  </button>
                </>
              ) : (
                <>Already have an account?{' '}
                  <button onClick={() => switchMode('login')} className="text-accent-400 hover:underline font-medium">
                    Log in
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
