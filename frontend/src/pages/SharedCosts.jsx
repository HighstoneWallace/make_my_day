import { motion } from 'framer-motion'
import { ArrowRight, Receipt, Users } from 'lucide-react'
import GlassCard from '../components/GlassCard.jsx'
import PageTransition from '../components/PageTransition.jsx'
import AvatarCircle from '../components/AvatarCircle.jsx'

// TODO: replace with real data from GET /api/shared-costs/groups once the backend endpoint exists.
const MOCK_GROUPS = [
  { id: 1, name: 'Rome trip weekend', members: 4, total: 612 },
  { id: 2, name: 'Flatmates · utilities', members: 3, total: 214 },
]

// TODO: replace with real data from GET /api/shared-costs/balances once the backend endpoint exists.
const MOCK_BALANCES = [
  { id: 1, name: 'Josh', amount: 42.5 },
  { id: 2, name: 'Ovo', amount: -18 },
  { id: 3, name: 'Jennifer', amount: -24.5 },
]

// TODO: replace with real data from GET /api/shared-costs/expenses once the backend endpoint exists.
const MOCK_EXPENSES = [
  { id: 1, label: 'Groceries', paidBy: 'You', amount: 86.4, split: 4, group: 'Rome trip weekend', date: '2026-08-14' },
  { id: 2, label: 'Electricity bill', paidBy: 'Josh', amount: 96, split: 3, group: 'Flatmates · utilities', date: '2026-08-10' },
  { id: 3, label: 'Firewood & charcoal', paidBy: 'Alex', amount: 38, split: 4, group: 'Rome trip weekend', date: '2026-08-09' },
]

function fmtEur(n) {
  const sign = n < 0 ? '-' : '+'
  return `${sign}€${Math.abs(n).toFixed(2)}`
}

export default function SharedCosts() {
  const youAreOwed = MOCK_BALANCES.filter((b) => b.amount > 0).reduce((s, b) => s + b.amount, 0)
  const youOwe = MOCK_BALANCES.filter((b) => b.amount < 0).reduce((s, b) => s + Math.abs(b.amount), 0)

  return (
    <PageTransition>
      <motion.section
        className="glass rounded-2xl p-7 md:p-9"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-[26px] md:text-[28px] font-bold tracking-tight text-gradient mb-1.5">Shared Costs</h1>
        <p className="text-[14px] text-[var(--text-2)]">
          Split group expenses and settle up automatically — skeleton page — mock data until the shared costs API ships
        </p>
      </motion.section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
            <ArrowRight size={18} className="text-emerald-400 -rotate-45" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-[var(--text-3)]">You're owed</div>
            <div className="text-[19px] font-bold text-white">€{youAreOwed.toFixed(2)}</div>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
            <ArrowRight size={18} className="text-red-400 rotate-[135deg]" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-[var(--text-3)]">You owe</div>
            <div className="text-[19px] font-bold text-white">€{youOwe.toFixed(2)}</div>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-500/15 flex items-center justify-center shrink-0">
            <Users size={18} className="text-accent-400" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-[var(--text-3)]">Active groups</div>
            <div className="text-[19px] font-bold text-white">{MOCK_GROUPS.length}</div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)] mb-4">
            Groups
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_GROUPS.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] border border-white/[0.06] px-3.5 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-accent-500/15 flex items-center justify-center shrink-0">
                    <Users size={15} className="text-accent-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-medium text-white truncate">{g.name}</div>
                    <div className="text-[11.5px] text-[var(--text-3)]">{g.members} people</div>
                  </div>
                </div>
                <div className="text-[13px] font-mono text-[var(--text-2)] shrink-0">€{g.total.toFixed(2)}</div>
              </div>
            ))}
            <button
              disabled
              className="mt-1 w-full py-2.5 rounded-lg text-[13px] font-medium border border-dashed border-white/[0.12] text-[var(--text-3)] cursor-not-allowed"
              title="Coming soon"
            >
              + New group
            </button>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)] mb-4">
            Balances
          </div>
          <div className="flex flex-col">
            {MOCK_BALANCES.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-b-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <AvatarCircle user={{ name: b.name }} size={26} />
                  <span className="text-[13.5px] text-white truncate">{b.name}</span>
                </div>
                <div className={`text-[13px] font-mono font-medium shrink-0 ${b.amount < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {fmtEur(b.amount)}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)]">
            Recent shared expenses
          </div>
          <button
            disabled
            className="flex items-center gap-1.5 text-[12px] text-[var(--text-3)] cursor-not-allowed"
            title="Coming soon"
          >
            <Receipt size={13} /> Add expense
          </button>
        </div>
        <div className="flex flex-col">
          {MOCK_EXPENSES.map((e) => (
            <div key={e.id} className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-b-0">
              <div>
                <div className="text-[14px] font-medium text-white">{e.label}</div>
                <div className="text-[11.5px] text-[var(--text-3)] mt-0.5">
                  {e.paidBy} paid · split {e.split} ways · {e.group} · {e.date}
                </div>
              </div>
              <div className="text-[13px] font-mono font-medium text-[var(--text-2)]">€{e.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </PageTransition>
  )
}
