import { motion } from 'framer-motion'
import { useMemo } from 'react'

/** Twinkling stars with subtle pulse — fits Anniversary & Farewell themes */
export function AnimatedStars() {
  const stars = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 5,
      brightness: 0.4 + Math.random() * 0.6,
    }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: `rgba(255, 255, 255, ${s.brightness})`,
            boxShadow: `0 0 ${s.size * 2}px ${s.size}px rgba(255, 255, 255, ${s.brightness * 0.3})`,
          }}
          animate={{
            opacity: [s.brightness * 0.3, s.brightness, s.brightness * 0.3],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.delay,
          }}
        />
      ))}

      {/* A few larger "feature" stars with cross-shine */}
      {[
        { x: 15, y: 20, size: 6 },
        { x: 72, y: 35, size: 5 },
        { x: 45, y: 12, size: 7 },
        { x: 88, y: 65, size: 5 },
      ].map((fs, i) => (
        <motion.div
          key={`feature-${i}`}
          className="absolute"
          style={{ left: `${fs.x}%`, top: `${fs.y}%` }}
          animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.6, 1, 0.6] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
        >
          {/* Horizontal bar */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: fs.size * 4,
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent)',
            }}
          />
          {/* Vertical bar */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 1,
              height: fs.size * 4,
              background: 'linear-gradient(180deg, transparent, rgba(255,255,255,.7), transparent)',
            }}
          />
          {/* Center dot */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: fs.size,
              height: fs.size,
              background: 'rgba(255,255,255,.9)',
              boxShadow: `0 0 ${fs.size * 3}px ${fs.size}px rgba(255,255,255,.3)`,
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
