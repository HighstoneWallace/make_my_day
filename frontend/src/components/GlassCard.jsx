export default function GlassCard({ children, className = '', ...props }) {
  return (
    <div className={`glass rounded-2xl p-6 md:p-7 ${className}`} {...props}>
      {children}
    </div>
  )
}
