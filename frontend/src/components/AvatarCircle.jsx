import { initials } from '../avatar.js'

export default function AvatarCircle({ user, size = 32, className = '' }) {
  const style = { width: size, height: size, fontSize: Math.round(size * 0.4) }

  if (user?.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={user.name || 'Profile photo'}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={style}
      />
    )
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 font-semibold text-white bg-gradient-to-br from-accent-400 to-purple-500 ${className}`}
      style={style}
    >
      {initials(user?.name)}
    </div>
  )
}
