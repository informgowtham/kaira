/**
 * CosmicConstellation Template
 * ─────────────────────────────────────────────────────────────────
 * A premium space-themed celebration template.
 *
 * Background: Rotating nebulae glows, floating micro-particles, and
 * twinkling vector stars on a deep space void.
 *
 * Layout: Message cards are positioned as glowing star nodes in a
 * spatial celestial coordinate map on desktop, connected by active
 * laser-thin SVG constellation lines when hovered.
 *
 * Supports any number of messages via a hybrid approach:
 * - Dynamic golden-angle spiral placement for ≤30 messages
 * - Batched cluster navigation for >30 messages
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

const COSMIC_CSS = `
  @keyframes star-twinkle {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50%       { opacity: 1; transform: scale(1.2); }
  }
  @keyframes nebulae-rotate {
    0%   { transform: rotate(0deg) scale(1); }
    50%  { transform: rotate(180deg) scale(1.15); }
    100% { transform: rotate(360deg) scale(1); }
  }
  @keyframes cosmic-drift {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    50%       { transform: translateY(-15px) translateX(10px); }
  }
  .twinkle { animation: star-twinkle infinite ease-in-out; }
  .nebulae { animation: nebulae-rotate 25s infinite linear; }
  .dust-drift { animation: cosmic-drift 8s infinite ease-in-out; }
`

const STAR_COORDINATES = Array.from({ length: 60 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  duration: 2 + Math.random() * 4,
  delay: Math.random() * -5,
}))

function generateCoordinates(count: number): { cx: number; cy: number }[] {
  const coords: { cx: number; cy: number }[] = []
  const goldenAngle = 137.508 * (Math.PI / 180)
  const padding = 8 // % from edges
  for (let i = 0; i < count; i++) {
    const r = 12 + (i / Math.max(count - 1, 1)) * 32 // radius from 12% to 44% of container
    const theta = i * goldenAngle
    const cx = 50 + r * Math.cos(theta)
    const cy = 50 + r * Math.sin(theta)
    coords.push({
      cx: Math.max(padding, Math.min(100 - padding, cx)),
      cy: Math.max(padding, Math.min(100 - padding, cy)),
    })
  }
  return coords
}

const BATCH_SIZE = 24

export function CosmicConstellation(props: SignatureTemplateProps & { isRevealing?: boolean; onRevealComplete?: () => void }) {
  const [showOverlay, setShowOverlay] = useState(props.isRevealing)

  useEffect(() => {
    if (props.isRevealing) setShowOverlay(true)
  }, [props.isRevealing])

  const { messages, recipientName } = props
  const title = props.title || (recipientName ? `Celebrating ${recipientName} 🌌` : 'Star Map Memory 🌌')
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [batchIndex, setBatchIndex] = useState(0)

  const totalBatches = Math.ceil(messages.length / BATCH_SIZE)
  const useBatching = messages.length > 30
  const visibleMessages = useBatching
    ? messages.slice(batchIndex * BATCH_SIZE, (batchIndex + 1) * BATCH_SIZE)
    : messages
  const coordinates = generateCoordinates(visibleMessages.length)
  const positioned = visibleMessages.map((msg, idx) => ({
    msg,
    coord: coordinates[idx],
  }))

  return (
    <>
      <AnimatePresence onExitComplete={() => { if (!showOverlay) props.onRevealComplete?.() }}>
        {showOverlay && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5, delay: 1.5 } }}
          >
            {/* The single star that goes supernova */}
            <motion.div
              className="absolute bg-white rounded-full"
              initial={{ width: 10, height: 10, boxShadow: '0 0 20px 5px rgba(255,255,255,0.8)' }}
              exit={{ 
                scale: 300, 
                opacity: 0, 
                boxShadow: '0 0 100px 50px rgba(255,255,255,1)',
                transition: { duration: 2, ease: "easeIn" } 
              }}
            />

            {/* Cosmic dust blowing outward */}
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{ backgroundColor: ['#a855f7', '#3b82f6', '#ec4899', '#ffffff'][i % 4] }}
                exit={{ 
                  x: (Math.random() - 0.5) * 3000, 
                  y: (Math.random() - 0.5) * 3000,
                  scale: 0,
                  opacity: 0,
                  transition: { duration: 1.5 + Math.random(), ease: "easeOut" }
                }}
              />
            ))}

            <motion.button
              className="relative z-10 px-8 py-3 text-sm font-bold tracking-[0.3em] text-white bg-transparent border border-white/30 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setShowOverlay(false)}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              IGNITE
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative min-h-screen w-full overflow-hidden bg-[#03010c] text-white font-sans">
      {props.topBar}
      <style dangerouslySetInnerHTML={{ __html: COSMIC_CSS }} />

      {/* ── LAYER 1: TWINKLING DEEP SPACE VOID ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Twinkling star field */}
        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
          {STAR_COORDINATES.map((star, idx) => (
            <circle
              key={idx}
              cx={`${star.x}%`}
              cy={`${star.y}%`}
              r={star.size}
              fill="#fff"
              className="twinkle"
              style={{
                animationDuration: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </svg>
      </div>

      {/* ── LAYER 2: GLOWING NEBULAE CLOUDS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div
          className="absolute rounded-full nebulae"
          style={{
            top: '10%',
            left: '15%',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute rounded-full nebulae"
          style={{
            bottom: '15%',
            right: '10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)',
            filter: 'blur(90px)',
            animationDirection: 'reverse',
          }}
        />
        <div
          className="absolute rounded-full nebulae"
          style={{
            top: '40%',
            left: '45%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* ── LAYER 3: DUST PARTICLES ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 dust-drift">
        {[20, 45, 75, 90].map((left, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-purple-400/35 filter blur-[2px]"
            style={{
              left: `${left}%`,
              top: `${15 + idx * 22}%`,
              width: 4 + idx * 2,
              height: 4 + idx * 2,
            }}
          />
        ))}
      </div>

      {/* ── LAYER 4: INTERACTIVE CONSTELLATION OVERLAY ── */}
      {hoveredIdx !== null && visibleMessages.length > 1 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden md:block" aria-hidden="true">
          {(() => {
            const current = positioned[hoveredIdx]
            const nextIdx = (hoveredIdx + 1) % visibleMessages.length
            const prevIdx = (hoveredIdx - 1 + visibleMessages.length) % visibleMessages.length
            const next = positioned[nextIdx]
            const prev = positioned[prevIdx]
            
            return (
              <>
                {/* Line to Next Star */}
                <motion.line
                  x1={`${current.coord.cx}%`}
                  y1={`${current.coord.cy}%`}
                  x2={`${next.coord.cx}%`}
                  y2={`${next.coord.cy}%`}
                  stroke="#c084fc"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.75 }}
                  transition={{ duration: 0.4 }}
                />
                {/* Line to Prev Star */}
                <motion.line
                  x1={`${current.coord.cx}%`}
                  y1={`${current.coord.cy}%`}
                  x2={`${prev.coord.cx}%`}
                  y2={`${prev.coord.cy}%`}
                  stroke="#60a5fa"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.75 }}
                  transition={{ duration: 0.4 }}
                />
              </>
            )
          })()}
        </svg>
      )}

      {/* ── LAYER 5: CONTENT ── */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Header */}
        <header className="pt-10 pb-6 text-center px-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#d8b4fe' }}
          >
            🌌 Cosmic Star Map
          </div>
          <h1
            className="text-4xl sm:text-5xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #e9d5ff 0%, #c084fc 40%, #60a5fa 80%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </h1>
          <p className="mt-2 text-sm text-purple-200/60">
            {messages.length} stellar wishes mapped across the galaxy
          </p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap justify-center gap-2">{props.actionSlot}</div> : null}
        </header>

        {/* Message Board */}
        <main className="flex-1 px-6 pb-20 pt-4 overflow-visible">
          <div className="max-w-6xl mx-auto overflow-visible">
            {messages.length === 0 ? (
              props.emptyState
            ) : (
              <>
                {/* 1. Spatial Star Map Layout (Desktop View) */}
                <div className="hidden md:block relative w-full min-h-[620px] aspect-square md:aspect-[3/2] overflow-visible">
                  {positioned.map(({ msg, coord }, idx) => {
                    const isHovered = hoveredIdx === idx
                    return (
                      <div
                        key={msg.id}
                        style={{
                          position: 'absolute',
                          left: `${coord.cx}%`,
                          top: `${coord.cy}%`,
                        }}
                        className="transform -translate-x-1/2 -translate-y-1/2 overflow-visible z-20"
                        onMouseEnter={() => setHoveredIdx(idx)}
                        onMouseLeave={() => setHoveredIdx(null)}
                        onClick={() => setHoveredIdx(hoveredIdx === idx ? null : idx)}
                      >
                        {/* Glow Star Coordinate */}
                        <div className="relative flex items-center justify-center mb-2">
                          <motion.div
                            className="w-3.5 h-3.5 rounded-full bg-purple-400 shadow-[0_0_12px_#a855f7]"
                            animate={{ scale: isHovered ? [1, 1.4, 1] : 1 }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          {isHovered && (
                            <div className="absolute w-7 h-7 rounded-full border border-purple-400/50 animate-ping" />
                          )}
                        </div>

                        {/* Message Card */}
                        <motion.div
                          className="rounded-2xl border backdrop-blur-xl transition-all duration-300 overflow-hidden cursor-default"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            borderColor: isHovered ? 'rgba(168,85,247,0.45)' : 'rgba(255,255,255,0.08)',
                            boxShadow: isHovered
                              ? '0 20px 45px -5px rgba(168,85,247,0.25), 0 0 15px rgba(168,85,247,0.15)'
                              : '0 15px 35px -5px rgba(0,0,0,0.5)',
                            width: 200,
                          }}
                          animate={{ scale: isHovered ? 1.05 : 1 }}
                        >
                          {/* Laser accent line */}
                          <div
                            className="h-1"
                            style={{
                              background: isHovered
                                ? 'linear-gradient(90deg, #a855f7, #ec4899)'
                                : 'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.15))',
                            }}
                          />
                          <div className="p-3 text-left">
                            <div className="flex items-center justify-between gap-1 mb-2">
                              <span className="text-[11px] font-bold tracking-wider text-purple-300 truncate">
                                {msg.displayName || 'Stellar Guest'}
                              </span>
                              {msg.emoji && <span className="text-sm">{msg.emoji}</span>}
                            </div>
                            <p className="text-[11px] leading-relaxed text-purple-100/90 line-clamp-4">
                              {msg.text}
                            </p>
                            {(msg.gifUrl || msg.imageUrl) && (
                              <div className="mt-2 overflow-hidden rounded border border-white/10 bg-black/40">
                                <img src={msg.gifUrl || msg.imageUrl} alt="" className="w-full object-cover max-h-16" />
                              </div>
                            )}
                            <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-purple-300/40">
                              <span>NO. {String(idx + 1).padStart(3, '0')}</span>
                              <span>
                                {new Date(msg.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )
                  })}
                </div>

                {/* Batch Navigation (Desktop, only when batching) */}
                {useBatching && (
                  <div className="hidden md:flex items-center justify-center gap-4 mt-4">
                    <button
                      onClick={() => setBatchIndex(i => Math.max(0, i - 1))}
                      disabled={batchIndex === 0}
                      className="px-4 py-2 rounded-full text-sm font-medium border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      aria-label="Previous constellation group"
                    >
                      ← Prev Cluster
                    </button>
                    <span className="text-xs text-purple-300/60 font-mono">
                      {batchIndex + 1} / {totalBatches}
                    </span>
                    <button
                      onClick={() => setBatchIndex(i => Math.min(totalBatches - 1, i + 1))}
                      disabled={batchIndex === totalBatches - 1}
                      className="px-4 py-2 rounded-full text-sm font-medium border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      aria-label="Next constellation group"
                    >
                      Next Cluster →
                    </button>
                  </div>
                )}

                {/* 2. Responsive Grid Fallback (Mobile/Tablet View) */}
                <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.05, 1.5) }}
                      className="rounded-2xl border bg-white/5 border-white/10 p-4 text-left shadow-[0_10px_25px_rgba(0,0,0,0.4)]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-purple-300">
                          {msg.displayName || 'Stellar Guest'}
                        </span>
                        {msg.emoji && <span className="text-base">{msg.emoji}</span>}
                      </div>
                      <p className="text-xs leading-relaxed text-purple-100/90 whitespace-pre-wrap line-clamp-6">
                        {msg.text}
                      </p>
                      {(msg.gifUrl || msg.imageUrl) && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                          <img src={msg.gifUrl || msg.imageUrl} alt="" className="w-full object-cover max-h-36" />
                        </div>
                      )}
                      <div className="mt-3 text-[11px] font-mono text-white/30 text-right">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center pb-6 text-xs text-purple-300/25">
          🌠 Made with KairaBoard &bull; Cosmic Constellation Template
          {props.footerSlot ? <div className="mt-4">{props.footerSlot}</div> : null}
        </footer>
      </div>
    </div>
    </>
  )
}
