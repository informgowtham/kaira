import { motion } from 'framer-motion'
import { useMemo } from 'react'

/** Delicate drifting petals for floral greeting-card themes. */
export function AnimatedPetalDrift() {
  const petals = useMemo(() => {
    const colors = [
      'rgba(255,226,235,.38)',
      'rgba(255,214,227,.34)',
      'rgba(255,239,245,.30)',
      'rgba(245,218,229,.34)',
      'rgba(255,228,241,.32)',
    ]

    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      size: 10 + Math.random() * 16,
      color: colors[i % colors.length],
      duration: 9 + Math.random() * 8,
      delay: Math.random() * 5,
      drift: 18 + Math.random() * 25,
      rotateStart: Math.random() * 180,
    }))
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: '-12%',
            width: petal.size,
            height: petal.size * 0.7,
            borderRadius: '55% 45% 60% 40%',
            background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,.55), ${petal.color})`,
            filter: 'blur(.2px)',
          }}
          animate={{
            y: ['0%', '125%'],
            x: [0, petal.drift, -petal.drift * 0.6, petal.drift * 0.35, 0],
            rotate: [
              petal.rotateStart,
              petal.rotateStart + 40,
              petal.rotateStart + 130,
              petal.rotateStart + 220,
            ],
            opacity: [0, 0.75, 0.55, 0.35, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
