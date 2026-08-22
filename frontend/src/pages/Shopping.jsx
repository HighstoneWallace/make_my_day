import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ExternalLink, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import GlassCard from '../components/GlassCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import PageTransition from '../components/PageTransition.jsx'
import { api } from '../api.js'

function fmtPrice(min, max) {
  if (min == null && max == null) return ''
  if (min != null && max != null) return `€${min}–${max}`
  if (min != null) return `from €${min}`
  return `up to €${max}`
}

function ShopRow({ item, onToggle, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="group flex items-center gap-3 py-3 border-b border-[var(--border)] last:border-b-0"
    >
      <button
        onClick={() => onToggle(item)}
        title={item.purchased ? 'Mark as pending' : 'Mark as purchased'}
        className={`w-6 h-6 rounded-lg border-[1.5px] flex items-center justify-center shrink-0 transition-all ${
          item.purchased
            ? 'bg-emerald-500 border-transparent text-white'
            : 'border-[var(--border-2)] hover:border-emerald-400 hover:bg-emerald-500/10'
        }`}
      >
        {item.purchased && <Check size={13} />}
      </button>

      <div className="flex-1 min-w-0">
        <div className={`text-[14px] font-medium truncate ${item.purchased ? 'line-through text-[var(--text-3)]' : 'text-[var(--text-1)]'}`}>
          {item.name}
        </div>
        {item.description && <div className="text-[11.5px] text-[var(--text-3)] mt-0.5 truncate">{item.description}</div>}
      </div>

      <div className="text-[12px] font-mono text-[var(--text-2)] shrink-0">{fmtPrice(item.price_min, item.price_max)}</div>

      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-400 text-[12px] inline-flex items-center gap-1 shrink-0 hover:underline"
        >
          <ExternalLink size={11} /> Link
        </a>
      ) : (
        <span className="w-[38px]" />
      )}

      <button
        onClick={() => onDelete(item)}
        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-3)] hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
        title="Remove"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  )
}

export default function Shopping() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', priceMin: '', priceMax: '', url: '' })
  const [submitting, setSubmitting] = useState(false)

  const load = () => api.shopping.list().then(setItems).catch(() => setError(true))

  useEffect(() => {
    load()
  }, [])

  const toggle = async (item) => {
    setItems((prev) => prev.map((i) => (i.item_id === item.item_id ? { ...i, purchased: !i.purchased } : i)))
    try {
      const data = await api.shopping.toggle(item.item_id)
      setItems((prev) => prev.map((i) => (i.item_id === item.item_id ? { ...i, purchased: data.purchased } : i)))
    } catch {
      load()
    }
  }

  const remove = async (item) => {
    setItems((prev) => prev.filter((i) => i.item_id !== item.item_id))
    try {
      await api.shopping.remove(item.item_id)
    } catch {
      load()
    }
  }

  const addItem = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSubmitting(true)
    try {
      const item = await api.shopping.create({
        name: form.name.trim(),
        description: form.description.trim(),
        price_min: form.priceMin !== '' ? parseFloat(form.priceMin) : null,
        price_max: form.priceMax !== '' ? parseFloat(form.priceMax) : null,
        url: form.url.trim(),
      })
      setItems((prev) => [...prev, item])
      setFormOpen(false)
      setForm({ name: '', description: '', priceMin: '', priceMax: '', url: '' })
    } finally {
      setSubmitting(false)
    }
  }

  const pending = items?.filter((i) => !i.purchased).length ?? 0
  const purchased = items?.filter((i) => i.purchased).length ?? 0

  return (
    <PageTransition>
      <motion.section
        className="glass rounded-2xl p-7 md:p-9"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-[26px] md:text-[28px] font-semibold tracking-normal font-serif mb-1.5">Shopping Wishlist</h1>
        <p className="text-[14px] text-[var(--text-2)]">Things worth saving up for</p>
      </motion.section>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)]">
            <ShoppingBag size={13} /> Wishlist
          </div>
          {items && items.length > 0 && (
            <span className="text-[12px] text-[var(--text-3)]">
              {pending} pending{purchased ? ` · ${purchased} bought` : ''}
            </span>
          )}
        </div>

        {items === null && !error ? (
          <div className="flex flex-col gap-3 py-2">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton-line" style={{ width: `${60 + i * 10}%` }} />)}
          </div>
        ) : error ? (
          <EmptyState title="Could not load shopping list." subtitle="Backend may be offline." />
        ) : items.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="Your wishlist is empty — add something below!" />
        ) : (
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <ShopRow key={item.item_id} item={item} onToggle={toggle} onDelete={remove} />
            ))}
          </AnimatePresence>
        )}

        <div className="mt-4">
          {!formOpen ? (
            <button
              onClick={() => setFormOpen(true)}
              className="w-full py-2.5 rounded-xl border border-dashed border-[var(--border-2)] text-[var(--text-3)] text-[13px] flex items-center justify-center gap-1.5 hover:border-accent-400 hover:text-accent-400 hover:bg-accent-500/5 transition-all"
            >
              <Plus size={14} /> Add item
            </button>
          ) : (
            <form onSubmit={addItem} className="flex flex-col gap-2.5 p-4 rounded-xl bg-[var(--surf)] border border-[var(--border)]">
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Item name…"
                maxLength={80}
                className="bg-[var(--surf-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[14px] outline-none focus:border-accent-400 placeholder:text-[var(--text-3)]"
              />
              <input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Description (optional)"
                maxLength={200}
                className="bg-[var(--surf-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[14px] outline-none focus:border-accent-400 placeholder:text-[var(--text-3)]"
              />
              <div className="flex flex-wrap gap-2 items-center">
                <input
                  type="number" min={0} step={0.01}
                  value={form.priceMin}
                  onChange={(e) => setForm((f) => ({ ...f, priceMin: e.target.value }))}
                  placeholder="Min €"
                  className="w-24 bg-[var(--surf-2)] border border-[var(--border)] rounded-lg px-2 py-2 text-[14px] outline-none focus:border-accent-400 placeholder:text-[var(--text-3)]"
                />
                <span className="text-[var(--text-3)] text-[13px]">–</span>
                <input
                  type="number" min={0} step={0.01}
                  value={form.priceMax}
                  onChange={(e) => setForm((f) => ({ ...f, priceMax: e.target.value }))}
                  placeholder="Max €"
                  className="w-24 bg-[var(--surf-2)] border border-[var(--border)] rounded-lg px-2 py-2 text-[14px] outline-none focus:border-accent-400 placeholder:text-[var(--text-3)]"
                />
                <input
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  placeholder="Link (optional)"
                  className="flex-1 min-w-[120px] bg-[var(--surf-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[14px] outline-none focus:border-accent-400 placeholder:text-[var(--text-3)]"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg text-[13px] font-medium bg-accent-500 text-white hover:bg-accent-400 transition-all disabled:opacity-40"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--surf-2)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text-1)] transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            </form>
          )}
        </div>
      </GlassCard>
    </PageTransition>
  )
}
