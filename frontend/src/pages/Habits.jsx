import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Plus, Sprout, Trash2, X } from 'lucide-react'
import GlassCard from '../components/GlassCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import PageTransition from '../components/PageTransition.jsx'
import { api } from '../api.js'
import { dateStr, last7Days, todayStr } from '../utils.js'

const RING_R = 48
const RING_C = 2 * Math.PI * RING_R

function isDone(habit, date) {
  return habit.completions.includes(date)
}

function CompletionRing({ done, total }) {
  const pct = total ? done / total : 0
  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
        <circle cx="56" cy="56" r={RING_R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
        <motion.circle
          cx="56" cy="56" r={RING_R} fill="none"
          stroke={pct >= 1 ? '#34d399' : '#5b8def'}
          strokeWidth="7" strokeLinecap="round"
          strokeDasharray={RING_C}
          initial={{ strokeDashoffset: RING_C }}
          animate={{ strokeDashoffset: RING_C * (1 - pct) }}
          transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tracking-tight">{done}</span>
        <span className="text-[11px] text-[var(--text-3)]">/ {total}</span>
      </div>
    </div>
  )
}

function HabitRow({ habit, days, today, onToggle, onDelete }) {
  const done = isDone(habit, today)
  const streak = habit.current_streak
  const goal = habit.goal_streak

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="group grid grid-cols-[1fr_auto] items-center gap-4 py-3 border-b border-white/[0.06] last:border-b-0"
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => onToggle(habit)}
          className={`w-9 h-9 rounded-xl border-[1.5px] flex items-center justify-center text-base shrink-0 transition-all ${
            done
              ? 'bg-emerald-500 border-transparent shadow-[0_0_14px_rgba(16,185,129,0.4)]'
              : 'border-white/20 hover:border-accent-400 hover:bg-accent-500/10 hover:scale-105'
          }`}
        >
          {done ? <Check size={16} className="text-white" /> : habit.emoji}
        </button>
        <div className="min-w-0">
          <div className={`text-[14px] font-medium truncate ${done ? 'line-through text-[var(--text-3)]' : 'text-white'}`}>
            {habit.name}
          </div>
          <div className="text-[11px] text-[var(--text-3)] mt-0.5">
            {streak > 1 ? (
              <span className="text-amber-400 font-semibold">🔥 {streak}d streak</span>
            ) : streak === 1 ? (
              <span className="text-emerald-400 font-semibold">🌱 Started today</span>
            ) : (
              'No streak yet'
            )}
            {' '}· goal: {goal}d
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {days.map((d) => {
            const ds = dateStr(d)
            const dn = isDone(habit, ds)
            const isToday = ds === today
            return (
              <div
                key={ds}
                className={`w-5 h-5 rounded-md border transition-all ${
                  dn ? 'bg-emerald-500 border-transparent shadow-[0_0_6px_rgba(16,185,129,0.4)]' : 'bg-white/[0.03] border-white/[0.08]'
                } ${isToday && !dn ? 'border-accent-400 border-[1.5px]' : ''}`}
                title={ds}
              />
            )
          })}
        </div>
        <button
          onClick={() => onDelete(habit)}
          className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-3)] hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
          title="Remove habit"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  )
}

export default function Habits() {
  const [habits, setHabits] = useState(null)
  const [error, setError] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('⭐')
  const [goal, setGoal] = useState(30)
  const [submitting, setSubmitting] = useState(false)

  const days = last7Days()
  const today = todayStr()

  const load = () => api.habits.list().then(setHabits).catch(() => setError(true))

  useEffect(() => {
    load()
  }, [])

  const toggle = async (habit) => {
    const done = isDone(habit, today)
    setHabits((prev) =>
      prev.map((h) =>
        h.habit_id === habit.habit_id
          ? { ...h, completions: done ? h.completions.filter((d) => d !== today) : [...h.completions, today] }
          : h,
      ),
    )
    try {
      const data = await api.habits.toggle(habit.habit_id, today)
      setHabits((prev) =>
        prev.map((h) =>
          h.habit_id === habit.habit_id
            ? { ...h, completions: data.completions, current_streak: data.current_streak }
            : h,
        ),
      )
    } catch {
      load()
    }
  }

  const remove = async (habit) => {
    setHabits((prev) => prev.filter((h) => h.habit_id !== habit.habit_id))
    try {
      await api.habits.remove(habit.habit_id)
    } catch {
      load()
    }
  }

  const addHabit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    try {
      const habit = await api.habits.create({ name: name.trim(), emoji: emoji.trim() || '⭐', goal_streak: Number(goal) || 30 })
      setHabits((prev) => [...prev, habit])
      setFormOpen(false)
      setName('')
      setEmoji('⭐')
      setGoal(30)
    } finally {
      setSubmitting(false)
    }
  }

  const doneToday = habits?.filter((h) => isDone(h, today)).length ?? 0
  const total = habits?.length ?? 0

  return (
    <PageTransition>
      <motion.section
        className="glass rounded-2xl p-7 md:p-9 flex items-center gap-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-[26px] md:text-[28px] font-bold tracking-tight text-gradient mb-1.5">Habits</h1>
          <p className="text-[14px] text-[var(--text-2)]">Build momentum, one day at a time</p>
        </div>
        <CompletionRing done={doneToday} total={total} />
      </motion.section>

      <GlassCard>
        <div className="flex items-center justify-between mb-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)]">Last 7 days</div>
          <div className="flex gap-1.5 pr-[2px]">
            {days.map((d) => (
              <div key={dateStr(d)} className="w-5 text-center text-[9px] font-semibold uppercase tracking-wide text-[var(--text-3)]">
                {d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2)}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2">
          {habits === null && !error ? (
            <div className="flex flex-col gap-3 py-2">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton-line" style={{ width: `${60 + i * 10}%` }} />)}
            </div>
          ) : error ? (
            <EmptyState title="Could not load habits." subtitle="Backend may be offline." />
          ) : habits.length === 0 ? (
            <EmptyState icon={Sprout} title="No habits yet — add one below!" />
          ) : (
            <AnimatePresence initial={false}>
              {habits.map((h) => (
                <HabitRow key={h.habit_id} habit={h} days={days} today={today} onToggle={toggle} onDelete={remove} />
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="mt-4">
          {!formOpen ? (
            <button
              onClick={() => setFormOpen(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-white/[0.12] text-[var(--text-3)] text-[13px] flex items-center justify-center gap-1.5 hover:border-accent-400 hover:text-accent-400 hover:bg-accent-500/5 transition-all"
            >
              <Plus size={14} /> Add habit
            </button>
          ) : (
            <form onSubmit={addHabit} className="flex flex-wrap gap-2 items-center">
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={2}
                className="w-12 text-center text-lg bg-white/[0.06] border border-white/[0.08] rounded-lg px-2 py-2 outline-none focus:border-accent-400"
                title="Pick an emoji"
              />
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Habit name…"
                maxLength={40}
                className="flex-1 min-w-[140px] bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2 text-[14px] outline-none focus:border-accent-400 placeholder:text-[var(--text-3)]"
              />
              <input
                type="number"
                min={1}
                max={365}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                title="Goal streak (days)"
                className="w-[72px] bg-white/[0.06] border border-white/[0.08] rounded-lg px-2 py-2 text-[14px] outline-none focus:border-accent-400"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-lg text-[13px] font-medium bg-accent-500 text-white hover:bg-accent-400 hover:shadow-glow-sm transition-all disabled:opacity-40"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/[0.06] border border-white/[0.08] text-[var(--text-2)] hover:text-white transition-all"
              >
                <X size={14} />
              </button>
            </form>
          )}
        </div>
      </GlassCard>
    </PageTransition>
  )
}
