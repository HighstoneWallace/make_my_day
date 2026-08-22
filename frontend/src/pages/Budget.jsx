import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react'
import GlassCard from '../components/GlassCard.jsx'
import PageTransition from '../components/PageTransition.jsx'

// TODO: replace with real data from GET /api/budget/summary once the backend endpoint exists.
const MOCK_SUMMARY = { income: 3200, expenses: 2140, balance: 1060 }

// TODO: replace with real data from GET /api/budget/transactions once the backend endpoint exists.
const MOCK_TRANSACTIONS = [
  { id: 1, label: 'Rent', amount: -1200, date: '2026-08-01', category: 'Housing' },
  { id: 2, label: 'Salary', amount: 3200, date: '2026-08-01', category: 'Income' },
  { id: 3, label: 'Groceries', amount: -180, date: '2026-08-06', category: 'Food' },
  { id: 4, label: 'Gym membership', amount: -45, date: '2026-08-08', category: 'Health' },
]

function fmt(n) {
  const sign = n < 0 ? '-' : '+'
  return `${sign}€${Math.abs(n).toLocaleString()}`
}

export default function Budget() {
  return (
    <PageTransition>
      <motion.section
        className="glass rounded-2xl p-7 md:p-9"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-[26px] md:text-[28px] font-semibold tracking-normal font-serif mb-1.5">Budget</h1>
        <p className="text-[14px] text-[var(--text-2)]">Skeleton page — mock data until the budget API ships</p>
      </motion.section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
            <ArrowUpRight size={18} className="text-emerald-400" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-[var(--text-3)]">Income</div>
            <div className="text-[19px] font-bold text-[var(--text-1)]">€{MOCK_SUMMARY.income.toLocaleString()}</div>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
            <ArrowDownRight size={18} className="text-red-400" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-[var(--text-3)]">Expenses</div>
            <div className="text-[19px] font-bold text-[var(--text-1)]">€{MOCK_SUMMARY.expenses.toLocaleString()}</div>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-500/15 flex items-center justify-center shrink-0">
            <Wallet size={18} className="text-accent-400" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-[var(--text-3)]">Balance</div>
            <div className="text-[19px] font-bold text-[var(--text-1)]">€{MOCK_SUMMARY.balance.toLocaleString()}</div>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)] mb-4">
          Recent transactions
        </div>
        <div className="flex flex-col">
          {MOCK_TRANSACTIONS.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-2.5 border-b border-[var(--border)] last:border-b-0">
              <div>
                <div className="text-[14px] font-medium text-[var(--text-1)]">{t.label}</div>
                <div className="text-[11.5px] text-[var(--text-3)] mt-0.5">{t.category} · {t.date}</div>
              </div>
              <div className={`text-[13px] font-mono font-medium ${t.amount < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {fmt(t.amount)}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </PageTransition>
  )
}
