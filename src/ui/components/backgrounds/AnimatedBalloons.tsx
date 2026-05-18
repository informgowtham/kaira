import { motion } from 'framer-motion'
import { useMemo } from 'react'

/** Colorful balloons drifting upwards — perfect for Birthday themes */
export function AnimatedBalloons() {
  const balloons = useMemo(() => {
    const colors = [
      'rgba(244,114,182,.6)', // pink
      'rgba(251,191,36,.6)',  // amber
      'rgba(34,211,238,.5)',  // cyan
      'rgba(168,85,247,.55)', // violet
      'rgba(74,222,128,.5)',  // green
      'rgba(248,113,113,.55)',// red
      'rgba(96,165,250,.5)',  // blue
      'rgba(253,224,71,.55)', // yellow
    ]
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 18 + Math.random() * 28,
      color: colors[i % colors.length],
      duration: 10 + Math.random() * 14,
      delay: Math.random() * 8,
      sway: 15 + Math.random() * 30,
    }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            bottom: '-10%',
            width: b.size,
            height: b.size * 1.25,
            background: `radial-gradient(ellipse at 35% 30%, rgba(255,255,255,.35), ${b.color} 60%, transparent 100%)`,
            borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
          }}
          animate={{
            y: [0, -(window.innerHeight + 200)],
            x: [0, b.sway, -b.sway * 0.5, b.sway * 0.3, 0],
          }}
          transition={{
            y: { duration: b.duration, repeat: Infinity, ease: 'linear', delay: b.delay },
            x: { duration: b.duration * 0.8, repeat: Infinity, ease: 'easeInOut', delay: b.delay },
          }}
        >
          {/* Balloon string */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: b.size * 1.2,
              width: 1,
              height: b.size * 0.7,
              background: 'rgba(255,255,255,.18)',
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
