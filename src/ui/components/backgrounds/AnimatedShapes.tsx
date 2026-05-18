import { motion } from 'framer-motion'
import { useMemo } from 'react'

/** Soft geometric shapes drifting — ideal for Farewell / Other categories */
export function AnimatedShapes() {
  const shapes = useMemo(() => {
    const types = ['circle', 'square', 'triangle', 'hexagon'] as const
    const colors = [
      'rgba(59,130,246,.12)',
      'rgba(168,85,247,.10)',
      'rgba(34,211,238,.10)',
      'rgba(244,114,182,.08)',
      'rgba(250,204,21,.08)',
      'rgba(16,185,129,.10)',
    ]
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 40 + Math.random() * 80,
      type: types[i % types.length],
      color: colors[i % colors.length],
      borderColor: colors[i % colors.length].replace(/[\d.]+\)$/, '0.25)'),
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 6,
      rotateStart: Math.random() * 180,
    }))
  }, [])

  function shapeStyle(type: string, size: number, color: string, borderColor: string): React.CSSProperties {
    const base: React.CSSProperties = { width: size, height: size, background: color, border: `1px solid ${borderColor}` }
    switch (type) {
      case 'circle':
        return { ...base, borderRadius: '50%' }
      case 'square':
        return { ...base, borderRadius: size * 0.15 }
      case 'triangle':
        return {
          width: 0, height: 0,
          borderLeft: `${size * 0.5}px solid transparent`,
          borderRight: `${size * 0.5}px solid transparent`,
          borderBottom: `${size * 0.85}px solid ${color}`,
          background: 'none', border: 'none',
        }
      case 'hexagon':
        return { ...base, borderRadius: size * 0.2, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }
      default:
        return base
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            ...shapeStyle(s.type, s.size, s.color, s.borderColor),
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -25, 15, -10, 0],
            rotate: [s.rotateStart, s.rotateStart + 90, s.rotateStart + 180, s.rotateStart + 270, s.rotateStart + 360],
            opacity: [0.3, 0.7, 0.5, 0.7, 0.3],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.delay,
          }}
        />
      ))}
    </div>
  )
}
