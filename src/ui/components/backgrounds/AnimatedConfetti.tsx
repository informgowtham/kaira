import { motion } from 'framer-motion'
import { useMemo } from 'react'

/** Slow-falling confetti pieces — great for Birthday & Anniversary */
export function AnimatedConfetti() {
  const pieces = useMemo(() => {
    const shapes = ['circle', 'rect', 'diamond'] as const
    const colors = [
      'rgba(251,191,36,.7)',
      'rgba(244,114,182,.7)',
      'rgba(34,211,238,.65)',
      'rgba(168,85,247,.7)',
      'rgba(74,222,128,.65)',
      'rgba(248,113,113,.7)',
      'rgba(253,224,71,.65)',
      'rgba(96,165,250,.65)',
    ]
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 5 + Math.random() * 10,
      shape: shapes[i % shapes.length],
      color: colors[i % colors.length],
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
      rotate: Math.random() * 360,
      sway: 20 + Math.random() * 40,
    }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: '-5%',
            width: p.shape === 'rect' ? p.size * 0.6 : p.size,
            height: p.shape === 'rect' ? p.size * 1.4 : p.size,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'diamond' ? '2px' : '1px',
            transform: p.shape === 'diamond' ? 'rotate(45deg)' : undefined,
          }}
          animate={{
            y: [0, window.innerHeight + 100],
            x: [0, p.sway, -p.sway * 0.6, p.sway * 0.4, 0],
            rotate: [p.rotate, p.rotate + 360],
            opacity: [0, 1, 1, 0.6, 0],
          }}
          transition={{
            y: { duration: p.duration, repeat: Infinity, ease: 'linear', delay: p.delay },
            x: { duration: p.duration * 0.7, repeat: Infinity, ease: 'easeInOut', delay: p.delay },
            rotate: { duration: p.duration * 1.5, repeat: Infinity, ease: 'linear', delay: p.delay },
            opacity: { duration: p.duration, repeat: Infinity, ease: 'linear', delay: p.delay },
          }}
        />
      ))}
    </div>
  )
}
