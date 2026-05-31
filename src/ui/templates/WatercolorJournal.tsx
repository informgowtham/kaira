/**
 * WatercolorJournal Template
 * ─────────────────────────────────────────────────────────────────
 * A premium fine-art themed celebration template.
 *
 * Background: Coarse-grain artist paper texture, large soft pools of
 * color pigment wash (rose, iris, and gold), and ink splatters.
 *
 * Layout: Message cards are styled as handwritten deckled-edge travel
 * postcards pinned to the canvas with colorful pushpins, swaying
 * gently in a summer breeze.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

const PAPER_CSS = `
  .paper-canvas {
    background-color: #faf7f2;
    background-image: 
      radial-gradient(rgba(145, 110, 80, 0.04) 1px, transparent 0),
      radial-gradient(rgba(145, 110, 80, 0.03) 1px, transparent 0);
    background-size: 24px 24px;
    background-position: 0 0, 12px 12px;
  }
  @keyframes paper-breeze {
    0%, 100% { transform: rotate(-1.5deg) translateY(0px); }
    50%       { transform: rotate(2deg) translateY(-3px); }
  }
  .breeze-sway {
    animation: paper-breeze 7s ease-in-out infinite;
    transform-origin: top center;
  }
`

const PIGMENTS = [
  { left: '10%', top: '15%', color: 'radial-gradient(circle, rgba(251,113,133,0.18) 0%, transparent 65%)', size: '500px' },
  { right: '15%', top: '5%', color: 'radial-gradient(circle, rgba(129,140,248,0.15) 0%, transparent 60%)', size: '450px' },
  { left: '40%', bottom: '10%', color: 'radial-gradient(circle, rgba(252,211,77,0.16) 0%, transparent 60%)', size: '480px' },
]

const PIN_COLORS = [
  'from-rose-500 to-rose-700 shadow-rose-900/40',
  'from-sky-500 to-sky-700 shadow-sky-900/40',
  'from-emerald-500 to-emerald-700 shadow-emerald-900/40',
  'from-amber-500 to-amber-700 shadow-amber-900/40',
]

const POSTCARD_ROTATIONS = ['-rotate-1', 'rotate-2', '-rotate-2', 'rotate-1', '-rotate-3', 'rotate-3']

export function WatercolorJournal(props: SignatureTemplateProps & { isRevealing?: boolean; onRevealComplete?: () => void }) {
  const [isUnveiling, setIsUnveiling] = useState(false)
  const { messages, recipientName } = props
  const title = props.title || (recipientName ? `A Journal for ${recipientName} 🎨` : 'Wishes & Watercolors 🎨')

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-rose-950 font-sans paper-canvas">
      <AnimatePresence onExitComplete={() => { if (isUnveiling && props.onRevealComplete) props.onRevealComplete(); }}>
        {props.isRevealing && !isUnveiling && (
          <motion.div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#faf7f2] overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 2, delay: 0.8 } }}
          >
            {/* Canvas Texture */}
            <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[radial-gradient(rgba(145,110,80,0.1)_1px,transparent_0)] bg-[length:24px_24px]" />
            
            {/* Ink drop that explodes */}
            <motion.div
              className="absolute w-20 h-20 rounded-full pointer-events-none mix-blend-multiply"
              initial={{ scale: 0, opacity: 0 }}
              exit={{ 
                scale: 150,
                opacity: [0, 0.8, 0.8, 0],
                backgroundColor: ["#f43f5e", "#8b5cf6", "#14b8a6", "#f43f5e"],
                transition: { duration: 2.5, times: [0, 0.2, 0.8, 1], ease: "easeInOut" }
              }}
            />

            <motion.button
              onClick={() => setIsUnveiling(true)}
              className="relative z-10 px-10 py-5 text-xl font-serif text-rose-950 bg-white/50 backdrop-blur-sm border border-rose-900/20 rounded-full hover:bg-rose-50 transition-colors shadow-lg cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }}
            >
              Splash Canvas
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      {props.topBar}
      <style dangerouslySetInnerHTML={{ __html: PAPER_CSS }} />

      {/* ── LAYER 1: WATERCOLOR COLOR PIGMENT WASHES ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        {PIGMENTS.map((wash, idx) => (
          <div
            key={idx}
            className="absolute rounded-full"
            style={{
              left: wash.left,
              right: wash.right,
              top: wash.top,
              bottom: wash.bottom,
              width: wash.size,
              height: wash.size,
              background: wash.color,
              filter: 'blur(55px)',
            }}
          />
        ))}
      </div>

      {/* ── LAYER 2: FINE ART INK SPLATTERS (SVG Vectors) ── */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
          {/* Splatter top right */}
          <g transform="translate(1000, 150) scale(0.6)" fill="#4c0519">
            <circle cx="0" cy="0" r="12" />
            <circle cx="20" cy="10" r="4" />
            <circle cx="-15" cy="-25" r="2" />
            <circle cx="-28" cy="18" r="3.5" />
            <circle cx="35" cy="-12" r="1.5" />
          </g>
          {/* Splatter bottom left */}
          <g transform="translate(150, 600) scale(0.8)" fill="#1e1b4b">
            <circle cx="0" cy="0" r="8" />
            <circle cx="-18" cy="-10" r="3" />
            <circle cx="25" cy="15" r="2" />
            <circle cx="8" cy="-24" r="2.5" />
          </g>
        </svg>
      </div>

      {/* ── LAYER 3: CONTENT ── */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="pt-10 pb-6 text-center px-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(225,29,72,0.08)', border: '1px solid rgba(225,29,72,0.2)', color: '#be123c' }}
          >
            🎨 Handmade Art Journal
          </div>
          <h1
            className="text-4xl sm:text-5xl font-serif font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #4c0519 0%, #881337 40%, #1e1b4b 80%, #030712 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </h1>
          <p className="mt-2 text-sm text-stone-600/70 font-serif italic">
            {messages.length} handwritten postcard memories painted onto canvas
          </p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap justify-center gap-2">{props.actionSlot}</div> : null}
        </header>

        {/* Message Board */}
        <main className="flex-1 px-6 pb-24 pt-6 max-w-6xl mx-auto w-full">
          {messages.length === 0 ? (
            props.emptyState
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 mt-6">
              {messages.map((msg, idx) => {
                const rotationClass = POSTCARD_ROTATIONS[idx % POSTCARD_ROTATIONS.length]
                const pinStyle = PIN_COLORS[idx % PIN_COLORS.length]

                return (
                  <motion.div
                    key={msg.id}
                    className="flex justify-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.min(idx * 0.06, 1.5) }}
                  >
                    {/* Breeze sway container */}
                    <div className={`relative ${rotationClass} breeze-sway`} style={{ animationDelay: `${-idx * 0.9}s` }}>
                      
                      {/* ── LAYER 1: PUSHPIN AT TOP ── */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
                        {/* Pin needle shadow */}
                        <div className="w-1 h-3 bg-neutral-950/20 rotate-12 blur-[0.5px] -mb-1 ml-1" />
                        {/* Needle */}
                        <div className="w-[1.5px] h-3 bg-neutral-400" />
                        {/* Pin head */}
                        <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${pinStyle} shadow-lg`} />
                        {/* Pin cap top */}
                        <div className="w-2.5 h-1 bg-white/35 rounded-t -mt-3.5 opacity-60" />
                      </div>

                      {/* ── LAYER 2: POSTCARD NOTE ── */}
                      <article
                        className="w-64 min-h-[220px] p-5 cursor-default bg-white border border-stone-200/80 shadow-[0_15px_35px_-5px_rgba(110,80,60,0.18)] text-left flex flex-col justify-between overflow-hidden relative"
                        style={{
                          borderRadius: '3px 6px 4px 8px / 6px 3px 7px 4px', // organic deckled postcard cuts
                        }}
                      >
                        {/* Postcard post lines */}
                        <div className="absolute top-4 bottom-4 left-1/2 w-px bg-stone-200/50 border-dashed border-l hidden" />

                        <div>
                          {/* Note meta */}
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#be123c] opacity-60">
                              {msg.displayName ? msg.displayName.slice(0, 15) : 'Postcard'}
                            </span>
                            {msg.emoji && <span className="text-lg">{msg.emoji}</span>}
                          </div>

                          {/* Postcard message */}
                          <p
                            className="text-stone-800 text-[13px] leading-relaxed font-serif whitespace-pre-wrap select-text italic line-clamp-8"
                            style={{ fontFamily: "'Georgia', serif", lineHeight: '1.7' }}
                          >
                            "{msg.text}"
                          </p>

                          {/* Media attachments */}
                          {(msg.gifUrl || msg.imageUrl) && (
                            <div className="mt-4 overflow-hidden rounded border border-stone-100 bg-stone-50 p-1 shadow-inner">
                              <img src={msg.gifUrl || msg.imageUrl} alt="" className="w-full object-cover max-h-24 rounded-sm filter sepia-[15%]" />
                            </div>
                          )}
                        </div>

                        {/* Stamp and Date */}
                        <div className="flex items-end justify-between mt-5 pt-3 border-t border-stone-100">
                          <div>
                            <span className="text-[11px] font-mono opacity-50 block">WRITTEN</span>
                            <span className="text-[10px] font-serif text-stone-700">
                              {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>

                          {/* Decorative Stamp box */}
                          <div className="w-9 h-11 border-2 border-dashed border-stone-300 p-0.5 rounded flex items-center justify-center bg-stone-50 select-none">
                            <div className="w-full h-full bg-rose-100/50 rounded-sm flex flex-col items-center justify-center text-[11px] text-rose-800/60 font-serif font-black tracking-tighter leading-none border border-rose-200">
                              <span>USA</span>
                              <span className="text-[9px] mt-0.5">🎨</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center pb-6 text-xs text-stone-500/30 font-serif italic">
          🎨 Made with KairaBoard &bull; Watercolor Journal Template
          {props.footerSlot ? <div className="mt-4">{props.footerSlot}</div> : null}
        </footer>
      </div>
    </div>
  )
}
