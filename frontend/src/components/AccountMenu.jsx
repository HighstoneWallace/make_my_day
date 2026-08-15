import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, ChevronDown, LogOut } from 'lucide-react'
import AvatarCircle from './AvatarCircle.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { fileToAvatarDataUrl } from '../avatar.js'

export default function AccountMenu({ showChevron = false }) {
  const { user, logout, updateProfile } = useAuth()
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)
  const rootRef = useRef(null)

  useEffect(() => {
    function onPointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  if (!user) return null

  const onPickPhoto = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    try {
      const dataUrl = await fileToAvatarDataUrl(file)
      await updateProfile({ avatar_url: dataUrl })
    } catch {
      // TODO: surface avatar upload failure in the UI
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 w-full px-1.5 py-1.5 rounded-xl hover:bg-white/[0.05] transition-colors text-left"
      >
        <AvatarCircle user={user} size={32} />
        <span className="min-w-0 flex-1">
          <span className="block text-[13.5px] font-semibold tracking-tight truncate text-white">{user.name}</span>
        </span>
        {showChevron && <ChevronDown size={14} className="text-[var(--text-3)] shrink-0" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-[calc(100%+6px)] w-56 glass-strong rounded-xl p-1.5 shadow-2xl z-50"
          >
            <div className="px-3 py-2 text-[12px] text-[var(--text-3)] truncate border-b border-white/[0.06] mb-1">
              {user.email}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[var(--text-2)] hover:text-white hover:bg-white/[0.06] transition-colors disabled:opacity-50"
            >
              <Camera size={15} /> {uploading ? 'Uploading…' : 'Change photo'}
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[var(--text-2)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={15} /> Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickPhoto} />
    </div>
  )
}
