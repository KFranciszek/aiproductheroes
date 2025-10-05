export function SyzioLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon - Three aligned circles */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Left circle - Team Syzio (Blue) */}
        <circle cx="8" cy="16" r="4" fill="#3b82f6" opacity="0.8" />
        
        {/* Center circle - Tool Syzio (Purple) */}
        <circle cx="16" cy="16" r="4" fill="#8b5cf6" opacity="0.9" />
        
        {/* Right circle - Sprint Syzio (Green) */}
        <circle cx="24" cy="16" r="4" fill="#10b981" opacity="0.8" />
        
        {/* Alignment line */}
        <line
          x1="8"
          y1="16"
          x2="24"
          y2="16"
          stroke="white"
          strokeWidth="0.5"
          opacity="0.3"
        />
      </svg>
      
      {/* Wordmark */}
      <span className="text-2xl font-black tracking-tight">Syzio</span>
    </div>
  )
}
