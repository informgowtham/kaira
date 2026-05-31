/**
 * BirthdayWallArt Template
 * ─────────────────────────────────────────────────────────────────
 * A fully self-contained birthday template.
 *
 * Background: A warm gallery wall covered in illustrated birthday
 * items (cake, candles, balloons, gift boxes, confetti, streamers).
 * All decorations are pure SVG + CSS — no external image dependencies.
 *
 * Message Board: Cards are rendered on top of the wall as framed
 * "artwork" with wooden/gilded picture frames, hanging wires, and
 * subtle depth shadows, as if pinned to a gallery wall.
 *
 * Usage (standalone — wires into nothing existing):
 *   import { BirthdayWallArt } from './templates/BirthdayWallArt'
 *   <BirthdayWallArt messages={messages} recipientName="Alex" />
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import type { SignatureTemplateProps } from './signatureTypes'

/* ─── Frame style variants ──────────────────────────────────────── */
const FRAME_STYLES = [
  {
    outer: 'border-[10px] border-[#7c4f1e]',
    inner: 'bg-[#fdf3e8]',
    shadow: 'shadow-[0_20px_60px_-10px_rgba(0,0,0,0.75),inset_0_0_0_2px_rgba(255,220,150,0.15)]',
    label: 'bg-[#7c4f1e] text-amber-100',
    tint: 'text-amber-900',
  },
  {
    outer: 'border-[10px] border-[#2c2c2c]',
    inner: 'bg-[#f5f0f0]',
    shadow: 'shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8),inset_0_0_0_2px_rgba(255,255,255,0.05)]',
    label: 'bg-[#2c2c2c] text-gray-200',
    tint: 'text-gray-800',
  },
  {
    outer: 'border-[10px] border-[#9b6b00]',
    inner: 'bg-[#fffdf0]',
    shadow: 'shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7),inset_0_0_0_2px_rgba(212,175,55,0.25)]',
    label: 'bg-[#9b6b00] text-yellow-100',
    tint: 'text-yellow-900',
  },
]

const ROTATIONS = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-0', 'rotate-2', '-rotate-1']

/* ─── Inline CSS for keyframe animations ────────────────────────── */
const WALL_ART_CSS = `
  @keyframes wax-flicker {
    0%, 100% { opacity: 1; transform: scaleY(1) scaleX(1); }
    25%       { opacity: 0.85; transform: scaleY(0.88) scaleX(1.07); }
    50%       { opacity: 0.95; transform: scaleY(1.04) scaleX(0.95); }
    75%       { opacity: 0.80; transform: scaleY(0.92) scaleX(1.05); }
  }
  @keyframes balloon-drift {
    0%, 100% { transform: translateY(0px) rotate(-3deg); }
    50%       { transform: translateY(-18px) rotate(3deg); }
  }
  @keyframes confetti-fall {
    0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
    100% { transform: translateY(160px) rotate(540deg); opacity: 0; }
  }
  @keyframes streamer-wave {
    0%, 100% { transform: skewY(-5deg) scaleX(1); }
    50%       { transform: skewY(5deg) scaleX(0.92); }
  }
  .flicker   { animation: wax-flicker 2.4s ease-in-out infinite; }
  .balloon-1 { animation: balloon-drift 5s ease-in-out infinite; }
  .balloon-2 { animation: balloon-drift 6.5s ease-in-out infinite reverse; animation-delay: -1.5s; }
  .balloon-3 { animation: balloon-drift 4.8s ease-in-out infinite; animation-delay: -2s; }
  .confetti-p { animation: confetti-fall linear infinite; }
  .streamer   { animation: streamer-wave 3s ease-in-out infinite; }
`

/* ─── SVG Birthday Cake ─────────────────────────────────────────── */
function BirthdayCake({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      {/* Plate */}
      <ellipse cx="50" cy="96" rx="46" ry="6" fill="#e5c9b2" />
      {/* Bottom tier */}
      <rect x="14" y="62" width="72" height="32" rx="6" fill="#f8b4c8" />
      <rect x="14" y="62" width="72" height="10" rx="6" fill="#f9c4d4" />
      {/* Frosting drips bottom */}
      {[20, 33, 47, 61, 74].map((dx) => (
        <path key={dx} d={`M${dx} 62 Q${dx + 3} 70 ${dx + 6} 62`} fill="white" opacity="0.7" />
      ))}
      {/* Middle tier */}
      <rect x="24" y="36" width="52" height="26" rx="5" fill="#a78bfa" />
      <rect x="24" y="36" width="52" height="8" rx="5" fill="#c4b5fd" />
      {/* Frosting drips mid */}
      {[30, 42, 55, 66].map((dx) => (
        <path key={dx} d={`M${dx} 36 Q${dx + 3} 43 ${dx + 6} 36`} fill="white" opacity="0.7" />
      ))}
      {/* Top tier */}
      <rect x="34" y="16" width="32" height="20" rx="4" fill="#6ee7b7" />
      <rect x="34" y="16" width="32" height="6" rx="4" fill="#a7f3d0" />
      {/* Candles */}
      {[40, 50, 60].map((cx) => (
        <g key={cx}>
          <rect x={cx - 2} y="4" width="4" height="12" rx="1" fill="#fbbf24" />
          {/* Flame */}
          <ellipse cx={cx} cy="3" rx="3" ry="4" fill="#fde68a" className="flicker" />
          <ellipse cx={cx} cy="2" rx="1.5" ry="2.5" fill="#f97316" className="flicker" />
        </g>
      ))}
      {/* Dots decoration */}
      {[20, 30, 40, 50, 60, 70, 80].map((dx) => (
        <circle key={dx} cx={dx} cy="75" r="2" fill="white" opacity="0.5" />
      ))}
    </g>
  )
}

/* ─── SVG Balloon ───────────────────────────────────────────────── */
function Balloon({ x, y, color, className = '' }: { x: number; y: number; color: string; className?: string }) {
  return (
    <g transform={`translate(${x},${y})`} className={className}>
      <ellipse cx="0" cy="-20" rx="18" ry="22" fill={color} opacity="0.85" />
      <ellipse cx="-5" cy="-30" rx="5" ry="4" fill="white" opacity="0.3" />
      <path d="M0 2 Q3 10 0 24 Q-3 10 0 2" fill={color} opacity="0.7" />
      <path d="M0 24 Q8 30 0 36 Q-8 30 0 24" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
    </g>
  )
}

/* ─── SVG Gift Box ───────────────────────────────────────────────── */
function GiftBox({ x, y, bodyColor, lidColor }: { x: number; y: number; bodyColor: string; lidColor: string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {/* Body */}
      <rect x="0" y="18" width="44" height="36" rx="3" fill={bodyColor} />
      {/* Ribbon vertical */}
      <rect x="19" y="18" width="6" height="36" fill="white" opacity="0.4" />
      {/* Lid */}
      <rect x="-3" y="10" width="50" height="12" rx="3" fill={lidColor} />
      {/* Ribbon on lid */}
      <rect x="19" y="10" width="6" height="12" fill="white" opacity="0.4" />
      {/* Bow left */}
      <path d="M22 10 C14 2 6 4 10 10 C14 16 20 12 22 10" fill="white" opacity="0.5" />
      {/* Bow right */}
      <path d="M22 10 C30 2 38 4 34 10 C30 16 24 12 22 10" fill="white" opacity="0.5" />
      {/* Bow knot */}
      <circle cx="22" cy="10" r="3" fill="white" opacity="0.7" />
    </g>
  )
}

/* ─── SVG Stars / Sparkle ───────────────────────────────────────── */
function Sparkle({ x, y, size = 8, color = '#fbbf24' }: { x: number; y: number; size?: number; color?: string }) {
  const s = size
  return (
    <g transform={`translate(${x},${y})`}>
      <polygon points={`0,${-s} ${s * 0.3},${-s * 0.3} ${s},0 ${s * 0.3},${s * 0.3} 0,${s} ${-s * 0.3},${s * 0.3} ${-s},0 ${-s * 0.3},${-s * 0.3}`} fill={color} opacity="0.8" />
    </g>
  )
}

/* ─── Falling Confetti Pieces ───────────────────────────────────── */
const CONFETTI_PIECES = [
  { left: '5%',  color: '#f472b6', delay: '0s',    dur: '4s',   shape: 'rect' },
  { left: '14%', color: '#818cf8', delay: '-1.2s', dur: '5s',   shape: 'circle' },
  { left: '22%', color: '#34d399', delay: '-0.5s', dur: '3.8s', shape: 'rect' },
  { left: '35%', color: '#fbbf24', delay: '-2.1s', dur: '4.5s', shape: 'circle' },
  { left: '48%', color: '#f87171', delay: '-0.8s', dur: '5.2s', shape: 'rect' },
  { left: '60%', color: '#60a5fa', delay: '-1.9s', dur: '4.1s', shape: 'circle' },
  { left: '72%', color: '#a78bfa', delay: '-0.3s', dur: '3.5s', shape: 'rect' },
  { left: '83%', color: '#fbbf24', delay: '-2.5s', dur: '4.8s', shape: 'circle' },
  { left: '91%', color: '#f472b6', delay: '-1.1s', dur: '4.3s', shape: 'rect' },
]

/* ─── Main Component ─────────────────────────────────────────────── */
export function BirthdayWallArt(props: SignatureTemplateProps & { isRevealing?: boolean; onRevealComplete?: () => void }) {
  const [showOverlay, setShowOverlay] = useState(props.isRevealing)

  useEffect(() => {
    if (props.isRevealing) setShowOverlay(true)
  }, [props.isRevealing])

  const { messages, recipientName } = props
  const title = props.title || `Happy Birthday${recipientName ? `, ${recipientName}` : ''}! 🎉`
  return (
    <>
      <AnimatePresence onExitComplete={() => { if (!showOverlay) props.onRevealComplete?.() }}>
        {showOverlay && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, delay: 1.5 } }}
          >
            {/* Left Curtain */}
            <motion.div 
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#5c0a1a] border-r-8 border-[#3a040f]"
              style={{ boxShadow: 'inset -20px 0 50px rgba(0,0,0,0.5)' }}
              exit={{ x: '-100%', transition: { duration: 2, ease: [0.4, 0, 0.2, 1] } }}
            >
              {/* Curtain Folds */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.4)_0%,transparent_20%,transparent_80%,rgba(0,0,0,0.4)_100%)] bg-[length:100px_100%]" />
            </motion.div>
            
            {/* Right Curtain */}
            <motion.div 
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#5c0a1a] border-l-8 border-[#3a040f]"
              style={{ boxShadow: 'inset 20px 0 50px rgba(0,0,0,0.5)' }}
              exit={{ x: '100%', transition: { duration: 2, ease: [0.4, 0, 0.2, 1] } }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.4)_0%,transparent_20%,transparent_80%,rgba(0,0,0,0.4)_100%)] bg-[length:100px_100%]" />
            </motion.div>

            <motion.button
              className="relative z-10 px-10 py-4 font-serif text-2xl text-[#fde68a] bg-[#881327] border-2 border-[#fde68a]/50 rounded shadow-[0_0_30px_rgba(0,0,0,0.8)] hover:bg-[#a0162e] transition-colors"
              onClick={() => setShowOverlay(false)}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Open Curtains
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="relative min-h-screen w-full overflow-hidden font-sans"
        style={{ background: 'linear-gradient(160deg, #1a0a2e 0%, #2d0e35 35%, #1a1230 65%, #0d1a2e 100%)' }}
      >
      {props.topBar}
      <style dangerouslySetInnerHTML={{ __html: WALL_ART_CSS }} />

      {/* ── LAYER 1: WALL TEXTURE ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.025) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.02) 40px)
          `,
        }}
      />

      {/* ── LAYER 2: BACKGROUND BIRTHDAY SCENE (SVG) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {/* Birthday Cake — center-left */}
          <BirthdayCake x={80} y={620} scale={1.1} />
          {/* Birthday Cake — bottom-right smaller */}
          <BirthdayCake x={980} y={660} scale={0.75} />

          {/* Balloons — top area */}
          <Balloon x={100} y={180} color="#f472b6" className="balloon-1" />
          <Balloon x={145} y={130} color="#818cf8" className="balloon-2" />
          <Balloon x={1060} y={160} color="#34d399" className="balloon-3" />
          <Balloon x={1105} y={110} color="#fbbf24" className="balloon-1" />
          <Balloon x={600} y={100} color="#f87171" className="balloon-2" />
          <Balloon x={650} y={60}  color="#60a5fa" className="balloon-3" />

          {/* Gift Boxes — floor */}
          <GiftBox x={20}  y={690} bodyColor="#f87171" lidColor="#dc2626" />
          <GiftBox x={80}  y={700} bodyColor="#818cf8" lidColor="#6d28d9" />
          <GiftBox x={1100} y={695} bodyColor="#34d399" lidColor="#059669" />
          <GiftBox x={1150} y={710} bodyColor="#fbbf24" lidColor="#d97706" />

          {/* Hanging Streamers — top left */}
          <path d="M0 0 Q40 60 20 120 Q-10 180 30 240" stroke="#f472b6" strokeWidth="3" fill="none" opacity="0.45" className="streamer" />
          <path d="M30 0 Q70 80 50 150 Q20 210 60 270" stroke="#818cf8" strokeWidth="3" fill="none" opacity="0.4" className="streamer" strokeDasharray="6 4" />

          {/* Hanging Streamers — top right */}
          <path d="M1200 0 Q1160 70 1180 140 Q1210 200 1170 260" stroke="#34d399" strokeWidth="3" fill="none" opacity="0.45" className="streamer" />
          <path d="M1170 0 Q1130 60 1150 130 Q1180 190 1140 250" stroke="#fbbf24" strokeWidth="3" fill="none" opacity="0.4" className="streamer" />

          {/* Garland / Banner string across top */}
          <path d="M0 80 Q150 140 300 90 Q450 40 600 100 Q750 160 900 90 Q1050 30 1200 80" stroke="#f472b6" strokeWidth="2" fill="none" opacity="0.5" strokeDasharray="8 5" />
          {/* Banner triangles (bunting) */}
          {[60, 160, 260, 360, 460, 560, 660, 760, 860, 960, 1060, 1160].map((bx, i) => (
            <polygon
              key={bx}
              points={`${bx - 14},90 ${bx + 14},90 ${bx},115`}
              fill={['#f472b6','#818cf8','#34d399','#fbbf24','#f87171','#60a5fa'][i % 6]}
              opacity="0.7"
            />
          ))}

          {/* Scattered Sparkles / Stars */}
          <Sparkle x={260} y={180} size={10} color="#fbbf24" />
          <Sparkle x={900} y={140} size={8}  color="#f472b6" />
          <Sparkle x={500} y={240} size={6}  color="#818cf8" />
          <Sparkle x={750} y={200} size={9}  color="#34d399" />
          <Sparkle x={150} y={280} size={7}  color="#60a5fa" />
          <Sparkle x={1050} y={300} size={10} color="#fbbf24" />

          {/* Candles on bottom floor */}
          {[350, 430, 780, 860].map((cx) => (
            <g key={cx} transform={`translate(${cx}, 740)`}>
              <rect x="-5" y="-30" width="10" height="30" rx="3" fill="#fbbf24" />
              <ellipse cx="0" cy="-34" rx="6" ry="8" fill="#fde68a" className="flicker" />
              <ellipse cx="0" cy="-36" rx="3" ry="5" fill="#f97316" className="flicker" />
            </g>
          ))}
        </svg>
      </div>

      {/* ── LAYER 3: FALLING CONFETTI ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {CONFETTI_PIECES.map((p, i) => (
          <div
            key={i}
            className="absolute confetti-p"
            style={{
              left: p.left,
              top: '-20px',
              animationDuration: p.dur,
              animationDelay: p.delay,
            }}
          >
            {p.shape === 'rect' ? (
              <div style={{ width: 8, height: 12, background: p.color, borderRadius: 2, opacity: 0.8, transform: `rotate(${i * 37}deg)` }} />
            ) : (
              <div style={{ width: 8, height: 8, background: p.color, borderRadius: '50%', opacity: 0.8 }} />
            )}
          </div>
        ))}
      </div>

      {/* ── LAYER 4: CONTENT ── */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Header */}
        <header className="pt-10 pb-6 text-center px-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.3)', color: '#f9a8d4' }}
          >
            🎂 Birthday Celebration Board
          </div>
          <h1
            className="text-4xl sm:text-5xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #f9a8d4 0%, #c084fc 40%, #818cf8 80%, #67e8f9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {messages.length} heartfelt wishes framed just for you
          </p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap justify-center gap-2">{props.actionSlot}</div> : null}
        </header>

        {/* Framed Message Cards Wall Grid */}
        <main className="flex-1 px-4 sm:px-8 pb-16">
          <div className="max-w-6xl mx-auto">
            {messages.length === 0 ? (
              props.emptyState
            ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-4">
                {messages.map((msg, idx) => {
                  const frame = FRAME_STYLES[idx % FRAME_STYLES.length]
                  const rotation = ROTATIONS[idx % ROTATIONS.length]
                  return (
                    <motion.div
                      key={msg.id}
                      className={`relative ${rotation} cursor-default`}
                      tabIndex={0}
                      role="article"
                      initial={{ opacity: 0, y: 40, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: Math.min(idx * 0.08, 1.5), duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      whileHover={{ scale: 1.04, rotate: 0, zIndex: 20 }}
                      whileFocus={{ scale: 1.04, rotate: 0, zIndex: 20 }}
                    >
                      {/* Hanging Wire */}
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-px h-5 bg-gradient-to-b from-transparent via-white/30 to-white/50" />
                      {/* Nail */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 to-amber-600 border border-amber-900/40 shadow-md" />

                      {/* Frame */}
                      <div
                        className={`relative rounded-sm ${frame.outer} ${frame.shadow}`}
                        style={{ padding: '6px' }}
                      >
                        {/* Inner mat */}
                        <div className={`rounded-sm ${frame.inner} p-5`}>
                          {/* Author */}
                          <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${frame.tint} opacity-60`}>
                            {msg.displayName || 'A Friend'}
                          </p>
                          {/* Emoji */}
                          {msg.emoji && (
                            <div className="text-3xl mb-3">{msg.emoji}</div>
                          )}
                          {/* Message Text */}
                          <p className={`text-sm sm:text-base leading-relaxed ${frame.tint} whitespace-pre-wrap`} style={{ fontFamily: "'Georgia', serif" }}>
                            {msg.text}
                          </p>
                          {/* GIF / Image */}
                          {(msg.gifUrl || msg.imageUrl) && (
                            <div className="mt-4 overflow-hidden rounded" style={{ border: '1px solid rgba(0,0,0,0.1)' }}>
                              <img
                                src={msg.gifUrl || msg.imageUrl}
                                alt="attachment"
                                className="w-full object-cover max-h-36"
                              />
                            </div>
                          )}
                          {/* Date tag */}
                          <div className="mt-4 flex items-center justify-between">
                            <span className={`text-[10px] font-mono opacity-40 ${frame.tint}`}>
                              {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            <span className={`text-[9px] uppercase tracking-widest opacity-25 ${frame.tint}`}>
                              No. {String(idx + 1).padStart(3, '0')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Frame label plate */}
                      <div className={`absolute -bottom-5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider whitespace-nowrap ${frame.label} shadow-md`}>
                        {msg.displayName || 'Guest'}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </AnimatePresence>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center pb-6 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          🎈 Made with KairaBoard &bull; Birthday Wall Art Template
          {props.footerSlot ? <div className="mt-4">{props.footerSlot}</div> : null}
        </footer>
      </div>
    </div>
    </>
  )
}
