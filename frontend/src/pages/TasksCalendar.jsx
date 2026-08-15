import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, CheckSquare, Headphones, MapPin, RefreshCw, Sparkles } from 'lucide-react'
import GlassCard from '../components/GlassCard.jsx'
import Badge from '../components/Badge.jsx'
import EmptyState from '../components/EmptyState.jsx'
import PageTransition from '../components/PageTransition.jsx'
import { api } from '../api.js'
import { dueInfo, eventDuration, eventStatus, fmtTime, greeting } from '../utils.js'

function TaskRow({ task }) {
  const due = dueInfo(task.due)
  return (
    <div className="flex items-start gap-3 px-2 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors">
      <div className="w-4 h-4 rounded-full border-[1.5px] border-white/20 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-medium text-white leading-snug">{task.title}</div>
        {task.notes && (
          <div className="text-[11.5px] text-[var(--text-3)] mt-0.5 truncate">{task.notes.split('\n')[0]}</div>
        )}
      </div>
      {due && (
        <Badge tone={due.tone === 'red' ? 'red' : due.tone === 'amber' ? 'amber' : 'muted'} className="mt-0.5 shrink-0">
          {due.label}
        </Badge>
      )}
    </div>
  )
}

function TasksList({ tasks }) {
  const groups = useMemo(() => {
    const g = {}
    for (const t of tasks) {
      g[t.tasklist] ??= []
      g[t.tasklist].push(t)
    }
    for (const list of Object.values(g)) {
      list.sort((a, b) => {
        const da = a.due ? new Date(a.due).getTime() : Infinity
        const db = b.due ? new Date(b.due).getTime() : Infinity
        return da - db
      })
    }
    return g
  }, [tasks])

  if (!tasks.length) {
    return <EmptyState icon={CheckSquare} title="All clear — no open tasks!" />
  }

  return (
    <div className="max-h-[380px] overflow-y-auto pr-1 flex flex-col gap-4">
      {Object.entries(groups).map(([list, items]) => (
        <div key={list}>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)] pb-2 mb-0.5 border-b border-white/[0.06]">
            {list}
          </div>
          {items.map((t) => (
            <TaskRow key={t.id ?? t.title} task={t} />
          ))}
        </div>
      ))}
    </div>
  )
}

function EventsTimeline({ events }) {
  if (!events.length) {
    return <EmptyState icon={CalendarDays} title="No events scheduled today" />
  }

  const allDay = events.filter((e) => e.all_day)
  const timed = events.filter((e) => !e.all_day)
  let nowInserted = false

  return (
    <div className="max-h-[380px] overflow-y-auto pr-1">
      {allDay.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-3.5 pb-3.5 border-b border-white/[0.06]">
          {allDay.map((e) => (
            <div key={e.id ?? e.title} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.04] text-[13px] font-medium text-[var(--text-2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400 shrink-0" />
              <span className="flex-1 truncate">{e.title}</span>
              <Badge tone="muted">All day</Badge>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col">
        {timed.map((e, i) => {
          const status = eventStatus(e.start, e.end)
          const startFmt = fmtTime(e.start)
          const dur = eventDuration(e.start, e.end)
          const isLast = i === timed.length - 1
          const showNow = !nowInserted && status !== 'past'
          if (showNow) nowInserted = true

          return (
            <div key={e.id ?? `${e.title}-${i}`}>
              {showNow && i > 0 && (
                <div className="flex items-center gap-2.5 py-1 my-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-400 font-mono">now</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-emerald-400/50 to-transparent" />
                </div>
              )}
              <div className="grid grid-cols-[44px_14px_1fr] gap-x-2.5">
                <div className={`text-[11px] font-mono text-right pt-1.5 leading-none ${status === 'ongoing' ? 'text-emerald-400' : 'text-[var(--text-3)]'} ${status === 'past' ? 'opacity-45' : ''}`}>
                  {startFmt || ''}
                </div>
                <div className="flex flex-col items-center pt-1.5">
                  <div className={`w-[7px] h-[7px] rounded-full shrink-0 ${status === 'ongoing' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[var(--text-3)]'} ${status === 'past' ? 'opacity-40' : ''}`} />
                  {!isLast && <div className="w-px flex-1 bg-white/[0.08] mt-1 -mb-0.5" />}
                </div>
                <div className={`rounded-lg border px-3 py-1.5 my-0.5 mb-1.5 transition-colors ${
                  status === 'ongoing'
                    ? 'border-emerald-500/30 bg-emerald-500/[0.07]'
                    : 'border-white/[0.08] bg-white/[0.04]'
                } ${status === 'past' ? 'opacity-45' : ''}`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13px] font-medium text-white">{e.title}</span>
                    {status === 'ongoing' && <Badge tone="green" dot>Live</Badge>}
                  </div>
                  {(startFmt || e.location) && (
                    <div className="text-[11px] text-[var(--text-3)] mt-0.5 flex items-center gap-1.5 flex-wrap">
                      {startFmt && <span>{startFmt}{dur ? ` · ${dur}` : ''}</span>}
                      {e.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={10} /> {e.location}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        {!nowInserted && (
          <div className="flex items-center gap-2.5 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-400 font-mono">now</span>
            <div className="flex-1 h-px bg-gradient-to-r from-emerald-400/50 to-transparent" />
          </div>
        )}
      </div>
    </div>
  )
}

export default function TasksCalendar() {
  const [tasks, setTasks] = useState(null)
  const [events, setEvents] = useState(null)
  const [briefing, setBriefing] = useState(null)
  const [briefingLoading, setBriefingLoading] = useState(true)
  const [audioLoading, setAudioLoading] = useState(false)
  const [audioSrc, setAudioSrc] = useState(null)
  const [errors, setErrors] = useState({})

  const loadTasks = () =>
    api.tasks().then(setTasks).catch(() => setErrors((e) => ({ ...e, tasks: true })))
  const loadEvents = () =>
    api.events().then(setEvents).catch(() => setErrors((e) => ({ ...e, events: true })))
  const loadBriefing = () => {
    setBriefingLoading(true)
    api.briefing()
      .then((d) => setBriefing(d.briefing))
      .catch(() => setErrors((e) => ({ ...e, briefing: true })))
      .finally(() => setBriefingLoading(false))
  }

  useEffect(() => {
    loadTasks()
    loadEvents()
    loadBriefing()
  }, [])

  const fetchAudio = async () => {
    setAudioLoading(true)
    try {
      const res = await fetch('/api/briefing/audio')
      const blob = await res.blob()
      setAudioSrc(URL.createObjectURL(blob))
    } catch {
      // TODO: surface audio generation failure in the UI
    } finally {
      setAudioLoading(false)
    }
  }

  return (
    <PageTransition>
      <motion.section
        className="glass rounded-2xl p-7 md:p-9 flex flex-col md:flex-row md:items-center gap-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-[30px] md:text-[34px] font-bold tracking-tight text-gradient leading-tight mb-1.5">
            {greeting()}
          </h1>
          <p className="text-[14px] text-[var(--text-2)] mb-6">Here's your daily overview</p>
          <div className="flex gap-7">
            <div>
              <div className="text-[22px] font-bold tracking-tight">{tasks?.length ?? '—'}</div>
              <div className="text-[10px] uppercase tracking-wide text-[var(--text-3)] font-medium mt-0.5">Open tasks</div>
            </div>
            <div>
              <div className="text-[22px] font-bold tracking-tight">{events?.length ?? '—'}</div>
              <div className="text-[10px] uppercase tracking-wide text-[var(--text-3)] font-medium mt-0.5">Events today</div>
            </div>
          </div>
        </div>
      </motion.section>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)]">
            <Sparkles size={13} /> Daily Briefing
          </div>
        </div>
        <div className={`text-[15px] leading-[1.75] ${briefingLoading ? 'italic text-[var(--text-3)]' : 'text-[var(--text-2)]'} min-h-[48px] whitespace-pre-line`}>
          {briefingLoading
            ? 'Generating your briefing…'
            : errors.briefing
              ? 'Backend offline — briefing unavailable. Check your schedule above and habits for today.'
              : briefing}
        </div>
        {audioSrc && <audio controls src={audioSrc} className="w-full mt-3.5 rounded-lg" />}
        <div className="flex gap-2.5 mt-5">
          <button
            onClick={fetchAudio}
            disabled={audioLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium bg-accent-500 text-white hover:bg-accent-400 hover:shadow-glow-sm transition-all disabled:opacity-40"
          >
            <Headphones size={14} /> {audioLoading ? 'Generating…' : 'Listen'}
          </button>
          <button
            onClick={loadBriefing}
            disabled={briefingLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium bg-white/[0.06] border border-white/[0.08] text-[var(--text-2)] hover:bg-white/[0.1] hover:text-white transition-all disabled:opacity-40"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)]">
              <CheckSquare size={13} /> Tasks
            </div>
            {tasks && <span className="text-[12px] text-[var(--text-3)]">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>}
          </div>
          {tasks === null && !errors.tasks ? (
            <div className="flex flex-col gap-2.5">
              {[70, 55, 80, 40].map((w) => <div key={w} className="skeleton-line" style={{ width: `${w}%` }} />)}
            </div>
          ) : errors.tasks ? (
            <EmptyState title="Could not load tasks." subtitle="Backend may be offline." />
          ) : (
            <TasksList tasks={tasks} />
          )}
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)]">
              <CalendarDays size={13} /> Today's Schedule
            </div>
            {events && events.length > 0 && <span className="text-[12px] text-[var(--text-3)]">{events.length} event{events.length !== 1 ? 's' : ''}</span>}
          </div>
          {events === null && !errors.events ? (
            <div className="flex flex-col gap-2.5">
              {[65, 50, 75].map((w) => <div key={w} className="skeleton-line" style={{ width: `${w}%` }} />)}
            </div>
          ) : errors.events ? (
            <EmptyState title="Could not load events." subtitle="Backend may be offline." />
          ) : (
            <EventsTimeline events={events} />
          )}
        </GlassCard>
      </div>
    </PageTransition>
  )
}
