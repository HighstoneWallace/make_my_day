import { motion } from 'framer-motion'
import { Plus, StickyNote } from 'lucide-react'
import GlassCard from '../components/GlassCard.jsx'
import PageTransition from '../components/PageTransition.jsx'

// TODO: replace with real data from GET /api/notes once the backend endpoint exists.
const MOCK_NOTES = [
  { id: 1, title: 'Trip packing list', preview: 'Passport, charger, hiking boots, first aid kit…', updated: '2 days ago' },
  { id: 2, title: 'Book recommendations', preview: 'Project Hail Mary, The Three-Body Problem…', updated: '5 days ago' },
  { id: 3, title: 'Recipe: weekend pasta', preview: 'Garlic, chili flakes, anchovies, pecorino…', updated: '1 week ago' },
]

export default function Notes() {
  return (
    <PageTransition>
      <motion.section
        className="glass rounded-2xl p-7 md:p-9"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-[26px] md:text-[28px] font-bold tracking-tight text-gradient mb-1.5">Notes</h1>
        <p className="text-[14px] text-[var(--text-2)]">Skeleton page — mock data until the notes API ships</p>
      </motion.section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MOCK_NOTES.map((n) => (
          <GlassCard key={n.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[var(--text-3)]">
              <StickyNote size={14} />
              <span className="text-[11px]">{n.updated}</span>
            </div>
            <div className="text-[15px] font-semibold text-white">{n.title}</div>
            <div className="text-[13px] text-[var(--text-2)] line-clamp-2">{n.preview}</div>
          </GlassCard>
        ))}

        {/* TODO: wire up POST /api/notes once the backend endpoint exists */}
        <button className="rounded-2xl border border-dashed border-white/[0.12] flex flex-col items-center justify-center gap-2 py-10 text-[var(--text-3)] hover:border-accent-400 hover:text-accent-400 hover:bg-accent-500/5 transition-all">
          <Plus size={20} />
          <span className="text-[13px] font-medium">New note</span>
        </button>
      </div>
    </PageTransition>
  )
}
