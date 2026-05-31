/**
 * HangingTreeGarden Template
 * ─────────────────────────────────────────────────────────────────
 * A premium interactive digital-art style celebration template.
 *
 * Background: A lush night forest with an ancient oak tree, glowing
 * leaf clusters, drifting fireflies, and soft moonlight.
 *
 * Layout: Message cards are represented as elegant, compact **Wish Tags**
 * hanging from branch anchors on desktop. To prevent clutter when wishes
 * exceed branch anchors (12), it uses a poetic "Breeze Batching" system
 * showing 12 tags at a time.
 *
 * Clicking a tag opens a cinematic lightbox slides detail card to browse
 * all wishes sequentially.
 *
 * Mobile: Renders as a vertical scrollable column of rustic cards hanging
 * on dual rope cords over the forest backdrop.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Sparkles, Wind } from 'lucide-react'

import type { SignatureTemplateProps } from './signatureTypes'

/* ─── CSS Keyframes ─────────────────────────────────────────────── */
const TREE_CSS = `
  @keyframes swing-a {
    0%, 100% { transform: rotate(-5deg); }
    50%       { transform: rotate(5deg); }
  }
  @keyframes swing-b {
    0%, 100% { transform: rotate(4deg); }
    50%       { transform: rotate(-4deg); }
  }
  @keyframes swing-c {
    0%, 100% { transform: rotate(-3deg); }
    50%       { transform: rotate(3deg); }
  }
  @keyframes firefly {
    0%   { opacity: 0;   transform: translate(0, 0); }
    20%  { opacity: 1;   transform: translate(8px, -12px); }
    50%  { opacity: 0.7; transform: translate(-6px, -20px); }
    80%  { opacity: 1;   transform: translate(10px, -8px); }
    100% { opacity: 0;   transform: translate(0, 0); }
  }
  @keyframes leaf-sway {
    0%, 100% { transform: rotate(-2deg) scale(1); }
    50%       { transform: rotate(2deg) scale(1.03); }
  }
  @keyframes moon-glow {
    0%, 100% { opacity: 0.8; }
    50%       { opacity: 1; }
  }
  @keyframes tree-rustle {
    0%, 100% { transform: rotate(0deg); }
    30%       { transform: rotate(-2deg) skewX(-1deg); }
    70%       { transform: rotate(1.5deg) skewX(1deg); }
  }
  .swing-a { animation: swing-a 6s ease-in-out infinite; transform-origin: top center; }
  .swing-b { animation: swing-b 7.5s ease-in-out infinite; transform-origin: top center; }
  .swing-c { animation: swing-c 5.5s ease-in-out infinite; transform-origin: top center; }
  .firefly { animation: firefly ease-in-out infinite; }
  .leaf-cluster { animation: leaf-sway 4s ease-in-out infinite; transform-origin: center center; }
  .moon-pulse { animation: moon-glow 3s ease-in-out infinite; }
  .rustling-tree { animation: tree-rustle 1.2s ease-in-out; }
`

/* ─── Branch coordinates for Hanging Tags ───────────────────────── */
const BRANCH_ANCHORS = [
  { sx: 210, sy: 220, side: 'left'  },
  { sx: 310, sy: 165, side: 'left'  },
  { sx: 430, sy: 125, side: 'left'  },
  { sx: 540, sy: 150, side: 'mid'   },
  { sx: 660, sy: 130, side: 'mid'   },
  { sx: 770, sy: 175, side: 'right' },
  { sx: 875, sy: 205, side: 'right' },
  { sx: 975, sy: 245, side: 'right' },
  { sx: 360, sy: 240, side: 'left'  },
  { sx: 600, sy: 235, side: 'mid'   },
  { sx: 820, sy: 285, side: 'right' },
  { sx: 480, sy: 200, side: 'mid'   },
]

const SWING_CLASSES = ['swing-a', 'swing-b', 'swing-c']
const ROPE_LENGTHS = [55, 70, 45, 80, 60, 50, 75, 55, 65, 70, 50, 60]

/* ─── Vintage Tag Colors ────────────────────────────────────────── */
const TAG_STYLES = [
  { bg: '#fffaf0', border: '#b45309', text: '#451a03', accent: '#d97706', shadow: 'rgba(120,53,4,0.15)' },
  { bg: '#f4fbf7', border: '#15803d', text: '#022c22', accent: '#16a34a', shadow: 'rgba(4,47,31,0.12)' },
  { bg: '#fdf4ff', border: '#a855f7', text: '#3b0764', accent: '#c084fc', shadow: 'rgba(59,7,100,0.12)' },
  { bg: '#fff1f2', border: '#f43f5e', text: '#4c0519', accent: '#fb7185', shadow: 'rgba(76,5,25,0.12)' },
]

/* ─── SVG Tree Backdrop Scene ─── */
function TreeScene({ rustle = false }: { rustle?: boolean }) {
  return (
    <div className={`absolute inset-0 w-full h-full ${rustle ? 'rustling-tree' : ''}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#fef9c3" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#fde68a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="leafGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor="#4ade80" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#166534" stopOpacity="0.15" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Sky */}
        <rect width="1200" height="800" fill="url(#skyGrad)" />
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#030a1a" />
            <stop offset="45%" stopColor="#071830" />
            <stop offset="100%" stopColor="#081e0f" />
          </linearGradient>
        </defs>

        {/* Moon */}
        <circle cx="950" cy="95" r="55" fill="url(#moonGlow)" className="moon-pulse" />
        <circle cx="950" cy="95" r="38" fill="#fef9c3" opacity="0.9" className="moon-pulse" />
        <circle cx="932" cy="83" r="28" fill="#fff7a1" opacity="0.75" />

        {/* Twinkling Stars */}
        {[[120,60],[250,40],[400,25],[700,35],[820,20],[1100,50],[1150,80],[300,90],[850,75],[1050,30]].map(([sx,sy],i) => (
          <circle key={i} cx={sx} cy={sy} r={i % 3 === 0 ? 1.8 : 1.2} fill="white" opacity={0.4 + (i % 4) * 0.15} />
        ))}

        {/* Ground hill */}
        <ellipse cx="600" cy="800" rx="900" ry="90" fill="#06180a" />
        <ellipse cx="600" cy="790" rx="850" ry="60" fill="#08230e" />

        {/* Main Tree Trunk */}
        <defs>
          <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="#3d1f0a" />
            <stop offset="40%" stopColor="#552c0f" />
            <stop offset="100%" stopColor="#2c1406" />
          </linearGradient>
        </defs>
        <path d="M550 800 C540 700 520 600 530 500 C545 400 570 350 600 280 C615 240 630 200 620 150"
          stroke="url(#trunkGrad)" strokeWidth="48" fill="none" strokeLinecap="round" />
        <path d="M650 800 C660 700 680 600 670 500 C655 400 630 350 600 280 C585 240 570 200 580 150"
          stroke="url(#trunkGrad)" strokeWidth="38" fill="none" strokeLinecap="round" />

        {/* Main Branches */}
        <path d="M560 430 C480 380 380 360 280 320 C220 295 160 285 120 260" stroke="#4a2209" strokeWidth="20" fill="none" strokeLinecap="round" />
        <path d="M330 350 C280 300 230 280 180 240" stroke="#4a2209" strokeWidth="11" fill="none" strokeLinecap="round" />
        <path d="M220 300 C180 260 150 235 110 210" stroke="#3d1f0a" strokeWidth="7" fill="none" strokeLinecap="round" />

        <path d="M640 430 C720 380 820 360 920 330 C980 305 1040 285 1080 260" stroke="#4a2209" strokeWidth="20" fill="none" strokeLinecap="round" />
        <path d="M870 355 C920 305 970 280 1020 245" stroke="#4a2209" strokeWidth="11" fill="none" strokeLinecap="round" />
        <path d="M980 290 C1020 255 1060 235 1090 210" stroke="#3d1f0a" strokeWidth="7" fill="none" strokeLinecap="round" />

        <path d="M580 330 C510 270 430 230 360 185 C310 155 250 135 200 100" stroke="#3d1f0a" strokeWidth="15" fill="none" strokeLinecap="round" />
        <path d="M620 330 C690 270 770 230 840 185 C890 155 950 135 1000 100" stroke="#3d1f0a" strokeWidth="15" fill="none" strokeLinecap="round" />

        {/* Leaf Clusters */}
        {[
          [120,245,55], [170,225,48], [220,265,44], [290,305,52], [360,178,50], [200,96,58], [160,110,45],
          [1080,245,55], [1030,225,48], [980,265,44], [910,310,52], [840,178,50], [1000,96,58], [1040,110,45],
          [510,82,45], [560,60,52], [620,55,56], [680,58,50], [730,80,44], [590,120,42], [620,115,38]
        ].map(([cx, cy, r], i) => (
          <g key={i} className="leaf-cluster">
            <circle cx={cx} cy={cy} r={r + 8} fill="#022c22" opacity="0.4" />
            <circle cx={cx} cy={cy} r={r} fill="url(#leafGlow)" filter="url(#glow)" />
            <circle cx={cx} cy={cy} r={r - 10} fill="#065f46" opacity="0.75" />
          </g>
        ))}

        {/* Fireflies */}
        {[
          [350, 420, '4s', '0s'],
          [740, 360, '5s', '1s'],
          [280, 310, '3.5s', '0.5s'],
          [920, 440, '4.5s', '2s'],
          [520, 520, '4.2s', '0.2s'],
          [830, 320, '3.8s', '1.5s'],
        ].map(([fx, fy, dur, delay], i) => (
          <circle
            key={i}
            cx={fx as number}
            cy={fy as number}
            r="2.5"
            fill="#a7f3d0"
            filter="url(#glow)"
            className="firefly"
            style={{ animationDuration: dur as string, animationDelay: delay as string }}
          />
        ))}
      </svg>
    </div>
  )
}

export function HangingTreeGarden(props: SignatureTemplateProps & { isRevealing?: boolean; onRevealComplete?: () => void }) {
  const [isUnveiling, setIsUnveiling] = useState(false)
  const { messages, recipientName } = props
  const title = props.title || (recipientName ? `For ${recipientName} 🌿` : 'Your Celebration Tree 🌿')

  /* ─── State for Slideshow Overlay & Wind Breeze Batching ─── */
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const [batchIndex, setBatchIndex] = useState(0)

  useEffect(() => {
    if (activeIdx === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setActiveIdx(i => i !== null ? Math.min(i + 1, messages.length - 1) : i)
      if (e.key === 'ArrowLeft') setActiveIdx(i => i !== null ? Math.max(i - 1, 0) : i)
      if (e.key === 'Escape') setActiveIdx(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeIdx, messages.length])
  const [rustling, setRustling] = useState(false)

  const BATCH_SIZE = 12
  const totalBatches = Math.ceil(messages.length / BATCH_SIZE)

  // Curate active subset of messages to display on tree branches
  const activeBatchMessages = messages.slice(batchIndex * BATCH_SIZE, (batchIndex + 1) * BATCH_SIZE)

  const positioned = activeBatchMessages.map((msg, idx) => ({
    msg,
    anchor: BRANCH_ANCHORS[idx % BRANCH_ANCHORS.length],
    rope: ROPE_LENGTHS[idx % ROPE_LENGTHS.length],
    swing: SWING_CLASSES[idx % SWING_CLASSES.length],
    style: TAG_STYLES[idx % TAG_STYLES.length],
    globalIdx: batchIndex * BATCH_SIZE + idx, // track real slideshow index
  }))

  const handlePrev = () => {
    if (activeIdx === null || messages.length === 0) return
    setActiveIdx((activeIdx - 1 + messages.length) % messages.length)
  }

  const handleNext = () => {
    if (activeIdx === null || messages.length === 0) return
    setActiveIdx((activeIdx + 1) % messages.length)
  }

  const handleBreeze = () => {
    if (rustling || totalBatches <= 1) return
    setRustling(true)
    setTimeout(() => {
      setBatchIndex((batchIndex + 1) % totalBatches)
      setRustling(false)
    }, 600)
  }

  return (
    <div className="relative w-full overflow-hidden font-sans bg-[#030a1a]" style={{ minHeight: '100vh' }}>
      <AnimatePresence onExitComplete={() => { if (isUnveiling && props.onRevealComplete) props.onRevealComplete(); }}>
        {props.isRevealing && !isUnveiling && (
          <motion.div
            className="fixed inset-0 z-[999999] flex items-center justify-center overflow-hidden bg-slate-900"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(20px)', transition: { duration: 2.5, ease: "easeInOut" } }}
          >
            {/* Dense morning fog layers */}
            <motion.div 
              className="absolute inset-0 bg-slate-200 opacity-20 blur-[100px]"
              exit={{ x: "-50%", opacity: 0, transition: { duration: 2.5 } }}
            />
            <motion.div 
              className="absolute inset-0 bg-slate-400/30 blur-[120px]"
              exit={{ x: "50%", opacity: 0, transition: { duration: 2.5 } }}
            />
            <motion.div 
              className="absolute w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-100/10 via-transparent to-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              exit={{ scale: 1.5, opacity: 0, transition: { duration: 2.5 } }}
            />

            {/* Sun ray */}
            <motion.div 
              className="absolute top-[-20%] left-[-20%] w-[140%] h-[40%] bg-gradient-to-r from-transparent via-amber-100/30 to-transparent rotate-45 blur-3xl pointer-events-none"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              exit={{ scale: 3, opacity: 0, transition: { duration: 2 } }}
            />

            <motion.button 
              onClick={() => setIsUnveiling(true)}
              className="relative z-10 px-10 py-5 text-xl font-serif text-slate-800 bg-white/80 backdrop-blur-md rounded-full shadow-[0_0_50px_rgba(255,255,255,0.4)] border border-white/50 hover:bg-white transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.8 } }}
            >
              Unveil Garden
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      {props.topBar}
      <style dangerouslySetInnerHTML={{ __html: TREE_CSS }} />

      {/* ── Background Tree (faded behind mobile list, fully integrated in desktop layout) ── */}
      <div className="absolute inset-0 md:hidden opacity-40 pointer-events-none">
        <TreeScene />
      </div>

      {/* ── Immersive Garden Canvas Wrapper ── */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="pt-8 pb-4 text-center px-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)', color: '#86efac' }}
          >
            🌳 Celebration Memory Tree
          </div>
          <h1
            className="text-4xl sm:text-5xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #bbf7d0 0%, #4ade80 40%, #34d399 80%, #6ee7b7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </h1>
          <p className="mt-2 text-sm text-[#86efac]/50">
            {messages.length} wishes hanging from the branches. Click to open and read.
          </p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap justify-center gap-2">{props.actionSlot}</div> : null}
        </header>

        {/* Tree and Message Container */}
        <div className="flex-1 px-4 pb-20 pt-4 overflow-visible">
          <div className="max-w-6xl mx-auto overflow-visible">
            {messages.length === 0 ? (
              props.emptyState
            ) : (
              <>
                {/* 1. Desktop Mode: Immersive Spatial Wish-Tag Canvas */}
                <div className="hidden md:block relative w-full aspect-[1200/800] max-w-5xl mx-auto mt-4 overflow-visible">
                  <TreeScene rustle={rustling} />
                  
                  {/* Poetic Wind breeze trigger for batching wishes */}
                  {totalBatches > 1 && (
                    <div className="absolute top-4 right-4 z-30">
                      <button
                        onClick={handleBreeze}
                        disabled={rustling}
                        aria-label="Show next batch of messages"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-950/90 border border-emerald-500/35 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-emerald-900 transition cursor-pointer select-none animate-pulse hover:animate-none"
                      >
                        <Wind size={13} className={rustling ? 'animate-spin' : ''} />
                        Breeze (Batch {batchIndex + 1}/{totalBatches})
                      </button>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={batchIndex}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 overflow-visible"
                    >
                      {positioned.map(({ msg, anchor, rope, swing, style, globalIdx }) => {
                        const leftPercent = (anchor.sx / 1200) * 100
                        const topPercent = (anchor.sy / 800) * 100

                        return (
                          <div
                            key={msg.id}
                            style={{
                              position: 'absolute',
                              left: `${leftPercent}%`,
                              top: `${topPercent}%`,
                            }}
                            className="transform -translate-x-1/2 overflow-visible z-20"
                          >
                            {/* Hanging Cord String */}
                            <div className="flex flex-col items-center" style={{ marginBottom: '-1px' }}>
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-600 shadow-[0_0_8px_#d97706]" />
                              <div style={{ width: 1.5, height: rope }} className="bg-gradient-to-b from-amber-600 to-amber-955 opacity-70" />
                            </div>

                            {/* Swinging Tag */}
                            <div className={swing} style={{ animationDelay: `${-globalIdx * 0.7}s` }}>
                              <motion.button
                                onClick={() => setActiveIdx(globalIdx)}
                                aria-label={`Open message from ${msg.displayName || 'contributor'}`}
                                className="rounded-sm p-1.5 flex flex-col justify-between items-center transition-all duration-300 shadow-[0_12px_28px_rgba(0,0,0,0.5)] hover:scale-115 hover:shadow-[0_15px_35px_rgba(217,119,6,0.3)] select-none cursor-pointer group"
                                style={{
                                  backgroundColor: style.bg,
                                  border: `2px solid ${style.border}`,
                                  width: 52,
                                  height: 90,
                                }}
                                whileHover={{ y: 2 }}
                              >
                                {/* Accent ribbon band at top */}
                                <div className="w-full h-1 bg-amber-800/20 rounded-sm mb-1" />

                                {/* Tag Initials / Vertical Name */}
                                <div className="flex-1 flex flex-col items-center justify-center">
                                  {msg.emoji ? (
                                    <span className="text-base mb-1 group-hover:animate-bounce">{msg.emoji}</span>
                                  ) : (
                                    <Sparkles className="w-3.5 h-3.5 text-amber-700/60 mb-1" />
                                  )}
                                  <span
                                    className="text-[11px] font-bold font-mono tracking-tighter truncate w-10 text-center uppercase"
                                    style={{ color: style.text }}
                                  >
                                    {msg.displayName ? msg.displayName.slice(0, 6) : 'Friend'}
                                  </span>
                                </div>

                                {/* Tag Tassel bottom */}
                                <div className="w-1 h-1.5 bg-amber-800/35 rounded-full mt-1" />
                              </motion.button>
                            </div>
                          </div>
                        )
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* 2. Mobile Mode: Infinite Scrollable Vertical Board Column */}
                <div className="block md:hidden max-w-lg mx-auto flex flex-col gap-10 mt-8 overflow-visible">
                  {positioned.map(({ msg, swing, style, globalIdx }) => (
                    <motion.div
                      key={msg.id}
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (globalIdx % BATCH_SIZE) * 0.05 }}
                    >
                      {/* Dual Cords */}
                      <div className="flex gap-16 justify-center w-full" style={{ marginBottom: '-1px' }}>
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-amber-700" />
                          <div style={{ width: 1.5, height: 45 }} className="bg-gradient-to-b from-amber-700 to-amber-955 opacity-50" />
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-amber-700" />
                          <div style={{ width: 1.5, height: 45 }} className="bg-gradient-to-b from-amber-700 to-amber-955 opacity-50" />
                        </div>
                      </div>

                      {/* Card Board */}
                      <div className={`${swing} w-full`}>
                        <article
                          className="rounded-xl p-5 border text-left shadow-[0_15px_35px_rgba(0,0,0,0.65)] relative"
                          style={{
                            background: style.bg,
                            borderColor: style.border,
                            color: style.text,
                          }}
                        >
                          {/* Board holes */}
                          <div className="absolute top-2 left-6 w-2 h-2 rounded-full bg-black/10 border border-black/25" />
                          <div className="absolute top-2 right-6 w-2 h-2 rounded-full bg-black/10 border border-black/25" />

                          {/* Message Header */}
                          <div className="flex items-center justify-between border-b pb-2 mb-3" style={{ borderColor: `${style.border}25` }}>
                            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: style.accent }}>
                              {msg.displayName || 'A Friend'}
                            </span>
                            {msg.emoji && <span className="text-xl">{msg.emoji}</span>}
                          </div>

                          {/* Message Body */}
                          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "'Georgia', serif" }}>
                            {msg.text}
                          </p>

                          {/* Media attachments */}
                          {(msg.gifUrl || msg.imageUrl) && (
                            <div className="mt-3 overflow-hidden rounded-lg border border-black/10">
                              <img src={msg.gifUrl || msg.imageUrl} alt="" className="w-full object-cover max-h-48" />
                            </div>
                          )}

                          {/* Date Footer */}
                          <div className="mt-4 flex items-center justify-between text-[11px] font-mono opacity-50 pt-2 border-t" style={{ borderColor: `${style.border}15` }}>
                            <span>WISH {String(globalIdx + 1).padStart(3, '0')}</span>
                            <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                          </div>
                        </article>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Batch Navigation */}
                {totalBatches > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-6 md:hidden">
                    <button
                      onClick={() => setBatchIndex(i => Math.max(0, i - 1))}
                      disabled={batchIndex === 0}
                      className="px-4 py-2 rounded-full text-sm font-medium border border-green-600/30 bg-green-900/30 text-green-300 hover:bg-green-800/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      aria-label="Previous batch of messages"
                    >
                      ← Previous
                    </button>
                    <span className="text-xs text-green-300/60 font-mono">
                      {batchIndex + 1} / {totalBatches}
                    </span>
                    <button
                      onClick={() => setBatchIndex(i => Math.min(totalBatches - 1, i + 1))}
                      disabled={batchIndex === totalBatches - 1}
                      className="px-4 py-2 rounded-full text-sm font-medium border border-green-600/30 bg-green-900/30 text-green-300 hover:bg-green-800/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      aria-label="Next batch of messages"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pb-6 text-xs text-[#86efac]/20">
          🌲 Made with KairaBoard &bull; Hanging Tree Garden Template
          {props.footerSlot ? <div className="mt-4">{props.footerSlot}</div> : null}
        </footer>
      </div>

      {/* ── LAYER 6: CINEMATIC SLIDESHOW LIGHTBOX (Desktop Overlay) ── */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            className="fixed inset-0 bg-[#030712]/85 backdrop-blur-sm z-[99999] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIdx(null)}
          >
            <motion.div
              className="relative w-full max-w-xl p-8 rounded-2xl border-[10px] border-double bg-[#fffdfa] shadow-[0_25px_80px_rgba(0,0,0,0.85)] border-amber-800/40 text-stone-900 overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveIdx(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-200/50 text-stone-600 transition"
              >
                <X size={20} />
              </button>

              {/* Slide Counter */}
              <div className="text-[11px] font-mono uppercase tracking-widest text-amber-800/60 font-semibold mb-2">
                Wish {activeIdx + 1} of {messages.length}
              </div>

              {/* Postcard Details */}
              <div className="text-left">
                <div className="flex items-center gap-3">
                  {messages[activeIdx].emoji && (
                    <span className="text-3xl animate-bounce">{messages[activeIdx].emoji}</span>
                  )}
                  <div>
                    <h3 className="text-lg font-serif font-black tracking-tight text-amber-950">
                      {messages[activeIdx].displayName || 'A Loving Friend'}
                    </h3>
                    <p className="text-[11px] font-mono opacity-50 uppercase tracking-widest mt-0.5">
                      {new Date(messages[activeIdx].createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Heartfelt Note */}
                <p
                  className="text-lg leading-relaxed text-stone-800 italic mt-6 border-l-4 border-amber-800/25 pl-4 whitespace-pre-wrap select-text"
                  style={{ fontFamily: "'Georgia', serif", lineHeight: 1.8 }}
                >
                  "{messages[activeIdx].text}"
                </p>

                {/* Attached GIF / Image */}
                {(messages[activeIdx].gifUrl || messages[activeIdx].imageUrl) && (
                  <div className="mt-6 overflow-hidden rounded-xl border border-stone-200/60 bg-stone-50 max-h-56 shadow-inner flex items-center justify-center">
                    <img
                      src={messages[activeIdx].gifUrl || messages[activeIdx].imageUrl}
                      alt="attachment"
                      className="max-w-full max-h-56 object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Slideshow Controls */}
              <div className="flex items-center justify-between border-t border-stone-200 mt-8 pt-4">
                <button
                  onClick={handlePrev}
                  aria-label="Previous message"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-900 border border-amber-800/20 rounded-full hover:bg-amber-800/10 transition select-none cursor-pointer"
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                
                <span className="text-[11px] font-mono text-stone-400">
                  USE ARROWS TO BROWSE
                </span>

                <button
                  onClick={handleNext}
                  aria-label="Next message"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-900 border border-amber-800/20 rounded-full hover:bg-amber-800/10 transition select-none cursor-pointer"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
