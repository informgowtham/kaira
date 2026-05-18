import { motion } from 'framer-motion'
import { useMemo } from 'react'

/** Deep space parallax starfield — for the 'Deep Space' and other cosmic themes */
export function AnimatedGalaxy() {
  // Three layers of stars at different speeds for parallax
  const layers = useMemo(() => {
    return [
      { count: 60, sizeRange: [1, 2], speed: 40, opacity: 0.35, color: '255,255,255' },
      { count: 30, sizeRange: [2, 3], speed: 25, opacity: 0.55, color: '200,210,255' },
      { count: 12, sizeRange: [3, 5], speed: 18, opacity: 0.75, color: '180,190,255' },
    ].map((layer) => ({
      ...layer,
      stars: Array.from({ length: layer.count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: layer.sizeRange[0] + Math.random() * (layer.sizeRange[1] - layer.sizeRange[0]),
        twinkleDuration: 2 + Math.random() * 4,
        twinkleDelay: Math.random() * 5,
      })),
    }))
  }, [])

  // Shooting stars
  const shootingStars = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      startX: 10 + Math.random() * 40,
      startY: 5 + Math.random() * 30,
      duration: 1.5 + Math.random() * 1,
      delay: 4 + i * 7 + Math.random() * 5,
    }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Slow-rotating nebula blurs */}
      <motion.div
        className="absolute"
        style={{
          width: '60%', height: '60%', left: '10%', top: '20%',
          background: 'radial-gradient(circle, rgba(79,70,229,.15), transparent 60%)',
          filter: 'blur(60px)',
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute"
        style={{
          width: '50%', height: '50%', right: '5%', top: '10%',
          background: 'radial-gradient(circle, rgba(147,51,234,.12), transparent 60%)',
          filter: 'blur(50px)',
        }}
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
      />

      {/* Star layers */}
      {layers.map((layer, li) => (
        <motion.div
          key={li}
          className="absolute inset-0"
          animate={{ y: [0, -15, 0], x: [0, 8, 0] }}
          transition={{ duration: layer.speed, repeat: Infinity, ease: 'easeInOut' }}
        >
          {layer.stars.map((s) => (
            <motion.div
              key={s.id}
              className="absolute rounded-full"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                background: `rgba(${layer.color}, ${layer.opacity})`,
                boxShadow: li === 2 ? `0 0 ${s.size * 3}px ${s.size}px rgba(${layer.color}, ${layer.opacity * 0.3})` : undefined,
              }}
              animate={{ opacity: [layer.opacity * 0.4, layer.opacity, layer.opacity * 0.4] }}
              transition={{ duration: s.twinkleDuration, repeat: Infinity, ease: 'easeInOut', delay: s.twinkleDelay }}
            />
          ))}
        </motion.div>
      ))}

      {/* Shooting stars */}
      {shootingStars.map((ss) => (
        <motion.div
          key={ss.id}
          className="absolute"
          style={{
            left: `${ss.startX}%`,
            top: `${ss.startY}%`,
            width: 2,
            height: 2,
            borderRadius: '50%',
            background: 'rgba(255,255,255,.9)',
            boxShadow: '0 0 4px 2px rgba(255,255,255,.4)',
          }}
          animate={{
            x: [0, 300],
            y: [0, 150],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: ss.duration,
            repeat: Infinity,
            repeatDelay: ss.delay + 10,
            ease: 'easeOut',
            delay: ss.delay,
          }}
        >
          {/* Trail */}
          <div
            className="absolute right-full top-1/2 -translate-y-1/2"
            style={{
              width: 60,
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.5))',
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
