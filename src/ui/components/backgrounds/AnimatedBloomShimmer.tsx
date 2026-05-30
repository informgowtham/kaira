import { motion } from 'framer-motion'

/** Soft floral foil shimmer for premium greeting-card themes. */
export function AnimatedBloomShimmer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-[18%] top-[8%] h-[65%] w-[60%] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,221,238,.28) 0%, rgba(255,191,218,.18) 35%, rgba(255,255,255,0) 72%)',
          filter: 'blur(2px)',
        }}
        animate={{
          x: ['0%', '8%', '-4%', '0%'],
          y: ['0%', '4%', '-3%', '0%'],
          scale: [1, 1.05, 0.98, 1],
          opacity: [0.45, 0.7, 0.52, 0.45],
        }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute right-[-10%] top-[18%] h-[56%] w-[52%] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,245,218,.25) 0%, rgba(255,212,161,.16) 34%, rgba(255,255,255,0) 72%)',
          filter: 'blur(2px)',
        }}
        animate={{
          x: ['0%', '-6%', '4%', '0%'],
          y: ['0%', '-4%', '2%', '0%'],
          scale: [1, 0.97, 1.04, 1],
          opacity: [0.4, 0.58, 0.47, 0.4],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute left-[22%] top-[42%] h-[45%] w-[55%] -rotate-6 rounded-full"
        style={{
          background:
            'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.17) 42%, rgba(255,225,240,.24) 52%, rgba(255,255,255,0) 68%)',
          filter: 'blur(1px)',
        }}
        animate={{ x: ['-10%', '42%'], opacity: [0, 0.5, 0] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
      />
    </div>
  )
}
