/**
 * VinylLounge Template
 * ─────────────────────────────────────────────────────────────────
 * A premium retro-music themed celebration template.
 *
 * Background: Mid-century modern teak wood panels, warm brass lines,
 * and vintage catalog energy.
 *
 * Layout: Message cards are styled as square 12" vinyl album covers.
 * Hovering a sleeve triggers a highly interactive animation where a
 * glossy black vinyl record slides out and spins 360 degrees.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SignatureTemplateProps } from './signatureTypes'

const WOOD_CSS = `
  .wood-wall {
    background: linear-gradient(180deg, #180d07 0%, #28150c 50%, #150b06 100%);
    background-image: 
      repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(0,0,0,0.3) 60px),
      linear-gradient(180deg, #180d07 0%, #28150c 50%, #150b06 100%);
  }
`

const ALBUM_COVERS = [
  { bg: '#e55934', label: '#fde68a', text: '#270800', border: '#7f230b', accent: '#ffecd1' },
  { bg: '#d6eadf', label: '#3f5e4d', text: '#13241c', border: '#1f3a2b', accent: '#e8f5e9' },
  { bg: '#457b9d', label: '#a8dadc', text: '#091c28', border: '#1d3557', accent: '#f1faee' },
  { bg: '#e9c46a', label: '#264653', text: '#281c00', border: '#f4a261', accent: '#fff8e7' },
  { bg: '#e0b1cb', label: '#5c3d4e', text: '#1f0310', border: '#9f86c0', accent: '#ffecf6' },
  { bg: '#f4a261', label: '#e76f51', text: '#3c1800', border: '#2a9d8f', accent: '#fff3e3' },
]

export function VinylLounge(props: SignatureTemplateProps & { isRevealing?: boolean; onRevealComplete?: () => void }) {
  const [showOverlay, setShowOverlay] = useState(props.isRevealing)

  useEffect(() => {
    if (props.isRevealing) setShowOverlay(true)
  }, [props.isRevealing])

  const { messages, recipientName } = props
  const title = props.title || (recipientName ? `${recipientName}'s Album Lounge 📻` : 'The Vinyl Lounge 📻')

  return (
    <>
      <AnimatePresence onExitComplete={() => { if (!showOverlay) props.onRevealComplete?.() }}>
        {showOverlay && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#111]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, delay: 2 } }}
          >
            {/* Record Sleeve */}
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center bg-[#e55934] shadow-2xl border-r-[20px] border-[#c0392b]"
              exit={{ x: '-100%', transition: { duration: 1.5, ease: 'easeInOut' } }}
            >
              <div className="w-96 h-96 border-4 border-[#ffecd1]/20 rounded-lg flex items-center justify-center">
                <span className="text-[#ffecd1] font-black text-6xl tracking-tighter opacity-50">STEREO</span>
              </div>
            </motion.div>

            {/* Vinyl Record */}
            <motion.div
              className="absolute z-10 w-[800px] h-[800px] rounded-full bg-[#111] shadow-2xl border-4 border-neutral-800 flex items-center justify-center"
              style={{ backgroundImage: 'radial-gradient(circle, #1a1a1a 20%, #111111 60%)' }}
              initial={{ x: 0, rotate: 0 }}
              exit={{ 
                x: '0%', 
                rotate: 720, 
                scale: 5, 
                opacity: 0,
                transition: { duration: 2.5, ease: 'easeInOut', delay: 0.5 } 
              }}
            >
              {/* Grooves */}
              <div className="absolute inset-10 rounded-full border border-neutral-700 opacity-40" />
              <div className="absolute inset-20 rounded-full border border-neutral-800 opacity-60" />
              <div className="absolute inset-40 rounded-full border border-neutral-700 opacity-30" />
              
              {/* Label */}
              <div className="w-64 h-64 rounded-full bg-[#fde68a] border-4 border-[#111] flex items-center justify-center flex-col relative">
                <span className="text-[#270800] font-black text-2xl mb-4">KAIRA RECORD CO.</span>
                <div className="w-6 h-6 rounded-full bg-[#111] absolute center" />
              </div>
            </motion.div>

            <motion.button
              className="relative z-30 px-8 py-4 font-black text-xl text-[#111] bg-[#fde68a] rounded-full shadow-[0_10px_30px_rgba(253,230,138,0.4)] transition-transform uppercase tracking-widest"
              onClick={() => setShowOverlay(false)}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play Record
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative min-h-screen w-full overflow-hidden text-[#ffe3cc] font-sans wood-wall">
      {props.topBar}
      <style dangerouslySetInnerHTML={{ __html: WOOD_CSS }} />

      {/* ── LAYER 1: BRASS SHELVES & ACCENTS ── */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[280px] left-0 right-0 h-1.5 bg-yellow-600/40 shadow" />
        <div className="absolute top-[620px] left-0 right-0 h-1.5 bg-yellow-600/40 shadow" />
      </div>

      {/* ── LAYER 2: CONTENT ── */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="pt-10 pb-6 text-center px-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#fed7aa' }}
          >
            📻 Retro Listening Room
          </div>
          <h1
            className="text-4xl sm:text-5xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #ffedd5 0%, #fdba74 40%, #f97316 80%, #ea580c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </h1>
          <p className="mt-2 text-sm text-amber-200/50">
            {messages.length} grooves, custom sleeves, and retro record vibes
          </p>
          {props.actionSlot ? <div className="mt-5 flex flex-wrap justify-center gap-2">{props.actionSlot}</div> : null}
        </header>

        {/* Message Board */}
        <main className="flex-1 px-6 pb-24 pt-6 max-w-6xl mx-auto w-full">
          {messages.length === 0 ? (
            props.emptyState
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12 mt-6">
              {messages.map((msg, idx) => (
                <VinylCard key={msg.id} msg={msg} idx={idx} />
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center pb-6 text-xs text-orange-200/20">
          📻 Made with KairaBoard &bull; Retro Vinyl Lounge Template
          {props.footerSlot ? <div className="mt-4">{props.footerSlot}</div> : null}
        </footer>
      </div>
    </div>
    </>
  )
}

function VinylCard({ msg, idx }: { msg: any; idx: number }) {
  const [hovered, setHovered] = useState(false)
  const [tappedIdx, setTappedIdx] = useState<number | null>(null)
  const isActive = hovered || tappedIdx === idx
  const theme = ALBUM_COVERS[idx % ALBUM_COVERS.length]

  return (
    <div
      className="relative flex justify-center items-center overflow-visible"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setTappedIdx(tappedIdx === idx ? null : idx)}
    >
      {/* ── LAYER 1: SPINNING VINYL RECORD (Slides out from behind sleeve) ── */}
      <motion.div
        className="absolute w-44 h-44 rounded-full bg-[#111] z-0 shadow-[0_12px_28px_rgba(0,0,0,0.8)] border border-neutral-900 flex items-center justify-center pointer-events-none hidden sm:flex"
        style={{
          backgroundImage: 'radial-gradient(circle, #1a1a1a 20%, #111111 60%)',
        }}
        animate={{
          x: isActive ? 100 : 0,
          rotate: isActive ? 360 : 0,
        }}
        transition={{
          duration: 0.65,
          ease: 'easeOut',
        }}
      >
        {/* Grooves */}
        <div className="absolute inset-3 rounded-full border border-neutral-800 opacity-60" />
        <div className="absolute inset-6 rounded-full border border-neutral-700 opacity-30" />
        <div className="absolute inset-10 rounded-full border border-neutral-800 opacity-60" />
        <div className="absolute inset-14 rounded-full border border-neutral-700 opacity-30" />

        {/* Label */}
        <div
          className="absolute w-16 h-16 rounded-full border-2 border-neutral-900 flex items-center justify-center"
          style={{ backgroundColor: theme.bg }}
        >
          {/* Accent text ring */}
          <div className="text-[11px] font-mono font-bold tracking-tighter opacity-55 select-none" style={{ color: theme.text }}>
            KAIRA RECORD CO.
          </div>
          {/* Spindle hole */}
          <div className="absolute w-2.5 h-2.5 rounded-full bg-[#180d07] border border-black" />
        </div>
      </motion.div>

      {/* ── LAYER 2: ALBUM JACKET (Sleeve card) ── */}
      <motion.article
        className="relative z-10 w-52 h-52 p-4 cursor-default rounded shadow-[5px_15px_35px_rgba(0,0,0,0.65)] select-none text-left flex flex-col justify-between border"
        style={{
          backgroundColor: theme.bg,
          borderColor: theme.border,
          color: theme.text,
        }}
        animate={{
          x: isActive ? -25 : 0,
          rotate: isActive ? -2 : 0,
        }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
      >
        {/* Top Header layout */}
        <div>
          <div className="flex justify-between items-start border-b pb-1.5 mb-2" style={{ borderColor: `${theme.text}25` }}>
            <span className="text-[9px] font-mono uppercase tracking-wider font-bold opacity-60">
              {msg.displayName ? msg.displayName.slice(0, 14) : 'SIDE A'}
            </span>
            <span className="text-[8px] font-mono opacity-40">STEREO</span>
          </div>

          {/* Album Title (Message text - large styled) */}
          <p
            className="text-[12px] font-bold leading-normal tracking-tight font-serif line-clamp-5 whitespace-pre-wrap select-text"
            style={{ color: theme.text }}
          >
            "{msg.text}"
          </p>

          {/* GIF / Image preview inside sleeve */}
          {(msg.gifUrl || msg.imageUrl) && (
            <div className="mt-2 overflow-hidden rounded border" style={{ borderColor: `${theme.text}30`, maxHeight: '42px' }}>
              <img src={msg.gifUrl || msg.imageUrl} alt="" className="w-full h-full object-cover opacity-85" />
            </div>
          )}
        </div>

        {/* Bottom Catalog label */}
        <div className="flex items-end justify-between mt-2 pt-1 border-t" style={{ borderColor: `${theme.text}15` }}>
          <div>
            <div className="text-[10px] font-serif font-black uppercase truncate max-w-[100px] select-text">
              {msg.displayName || 'Guest Track'}
            </div>
            <div className="text-[7px] font-mono opacity-50 uppercase tracking-widest mt-0.5">
              VOL. {String(idx + 1).padStart(3, '0')}
            </div>
          </div>

          {/* Record center hole mimic on cover */}
          <div className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: `${theme.text}20`, backgroundColor: `${theme.text}08` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.text }} />
          </div>
        </div>
      </motion.article>
    </div>
  )
}
