import { motion } from 'framer-motion'
import type { SignatureTemplateDefinition } from './signatureTypes'

export function SignatureTemplatePreview(props: {
  template: SignatureTemplateDefinition
  className?: string
  recipientName?: string
}) {
  const { template } = props
  const title = props.recipientName ? `For ${props.recipientName}` : template.name

  return (
    <div className={`relative overflow-hidden rounded-xl border border-white/10 ${props.className ?? 'h-40'}`}>
      {template.id === 'signature:birthday-wall-art' ? <BirthdayPreview /> : null}
      {template.id === 'signature:hanging-tree-garden' ? <TreePreview /> : null}
      {template.id === 'signature:cosmic-constellation' ? <CosmicPreview /> : null}
      {template.id === 'signature:vinyl-lounge' ? <VinylPreview /> : null}
      {template.id === 'signature:watercolor-journal' ? <WatercolorPreview /> : null}
      {template.id === 'signature:floral-letterpress' ? <FloralPreview title={title} /> : null}
      {template.id === 'signature:origami-fold' ? <OrigamiPreview /> : null}
      {template.id === 'signature:butterfly-garden' ? <ButterflyPreview title={title} /> : null}
      {template.id === 'signature:paperclip-desk' ? <DeskPreview /> : null}
      {template.id === 'signature:memory-lane-paper' ? <MemoryLanePreview /> : null}
      {template.id === 'signature:scrapbook-tape' ? <ScrapbookPreview /> : null}
    </div>
  )
}

function BirthdayPreview() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(135deg,#241033,#421537,#111827)]">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:24px_24px]" />
      {['#f472b6', '#818cf8', '#fbbf24'].map((color, idx) => (
        <motion.div
          key={color}
          className="absolute rounded-full"
          style={{ left: `${16 + idx * 30}%`, top: `${18 + idx * 10}%`, width: 28, height: 36, background: color }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3 + idx, repeat: Infinity }}
        />
      ))}
      <div className="absolute bottom-4 left-5 right-5 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((idx) => (
          <div key={idx} className="h-16 rotate-[-2deg] border-[6px] border-amber-700 bg-amber-50 shadow-xl" />
        ))}
      </div>
    </div>
  )
}

function TreePreview() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#031126,#082414)]">
      <div className="absolute left-1/2 top-8 h-36 w-12 -translate-x-1/2 rounded-t-full bg-[#4a2209]" />
      <div className="absolute left-8 right-8 top-8 h-24 rounded-[50%] bg-emerald-700/70 blur-sm" />
      {[18, 42, 66].map((left, idx) => (
        <motion.div
          key={left}
          className="absolute top-16 h-16 w-20 rounded-lg border-2 border-amber-700 bg-amber-50 shadow-xl"
          style={{ left: `${left}%` }}
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 4 + idx, repeat: Infinity }}
        >
          <div className="mx-auto -mt-8 h-8 w-px bg-amber-800" />
        </motion.div>
      ))}
    </div>
  )
}

function FloralPreview({ title }: { title: string }) {
  return (
    <div className="absolute inset-0 bg-[#fff7ed] text-rose-950">
      <div className="absolute inset-3 rounded-xl border border-rose-200 bg-white/55 shadow-inner" />
      {[0, 1, 2, 3, 4].map((idx) => (
        <motion.div
          key={idx}
          className="absolute h-12 w-12 rounded-full bg-rose-200/70"
          style={{ left: `${8 + idx * 19}%`, top: `${8 + (idx % 2) * 58}%` }}
          animate={{ scale: [1, 1.08, 1], opacity: [.65, 1, .65] }}
          transition={{ duration: 4 + idx * .4, repeat: Infinity }}
        />
      ))}
      <div className="absolute left-8 top-12 max-w-[65%] font-serif text-xl font-semibold">{title}</div>
      <div className="absolute bottom-6 left-8 h-10 w-36 rounded bg-rose-100 shadow-sm" />
    </div>
  )
}

function OrigamiPreview() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(135deg,#eff6ff,#ffffff_45%,#e0e7ff)]">
      {[0, 1, 2].map((idx) => (
        <motion.div
          key={idx}
          className="absolute h-20 w-24 bg-white shadow-xl [clip-path:polygon(0_0,100%_42%,0_100%,22%_48%)]"
          style={{ left: `${14 + idx * 25}%`, top: `${18 + idx * 14}%` }}
          animate={{ x: [0, 10, 0], rotate: [idx * 6, idx * 6 + 5, idx * 6] }}
          transition={{ duration: 4 + idx, repeat: Infinity }}
        />
      ))}
      <div className="absolute bottom-5 left-6 right-6 h-12 rounded-xl bg-indigo-600/15 border border-indigo-200" />
    </div>
  )
}

function ButterflyPreview({ title }: { title: string }) {
  return (
    <div className="absolute inset-0 bg-white">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 420 180" aria-hidden="true">
        <path d="M0 150 C80 40 145 220 235 72 C290 -20 330 130 420 52" fill="none" stroke="#c4b5fd" strokeDasharray="8 8" strokeWidth="3" />
      </svg>
      {[70, 210, 330].map((left, idx) => (
        <motion.div
          key={left}
          className="absolute"
          style={{ left, top: 38 + idx * 30 }}
          animate={{ y: [0, -8, 0], rotate: [-5, 7, -5] }}
          transition={{ duration: 3.8 + idx, repeat: Infinity }}
        >
          <div className="flex gap-0.5">
            <div className="h-9 w-7 rounded-full bg-pink-100 border-4 border-gray-300" />
            <div className="h-9 w-7 rounded-full bg-violet-100 border-4 border-gray-300" />
          </div>
        </motion.div>
      ))}
      <div className="absolute left-7 top-8 max-w-[55%] text-xl font-semibold text-purple-900">{title}</div>
    </div>
  )
}

function DeskPreview() {
  return (
    <div className="absolute inset-0 bg-[#d7c2a4]">
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,rgba(80,47,24,.2)_1px,transparent_1px)] [background-size:18px_18px]" />
      {[10, 36, 62].map((left, idx) => (
        <motion.div
          key={left}
          className="absolute top-8 h-24 w-24 rotate-[-4deg] rounded-sm bg-yellow-50 p-2 shadow-xl"
          style={{ left: `${left}%` }}
          animate={{ y: [0, idx === 1 ? -4 : 4, 0] }}
          transition={{ duration: 4 + idx, repeat: Infinity }}
        >
          <div className="absolute -top-3 left-6 h-7 w-4 rounded-full border-2 border-blue-500" />
          <div className="mt-5 h-2 rounded bg-slate-300" />
          <div className="mt-2 h-2 w-2/3 rounded bg-slate-200" />
        </motion.div>
      ))}
    </div>
  )
}

function MemoryLanePreview() {
  return (
    <div className="absolute inset-0 bg-[#f7efe1]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 420 180" aria-hidden="true">
        <path d="M20 130 C95 70 135 160 210 92 C285 24 315 114 400 52" fill="none" stroke="#b45309" strokeDasharray="5 7" strokeWidth="4" />
      </svg>
      {[50, 175, 305].map((left, idx) => (
        <div key={left} className="absolute h-16 w-24 rounded-lg border border-amber-200 bg-white shadow-lg" style={{ left, top: 50 + (idx % 2) * 45 }}>
          <div className="mx-auto -mt-2 h-4 w-12 rotate-[-4deg] bg-amber-200/80" />
        </div>
      ))}
    </div>
  )
}

function ScrapbookPreview() {
  return (
    <div className="absolute inset-0 bg-[#fffaf0]">
      <div className="absolute left-8 top-8 h-28 w-28 -rotate-6 bg-pink-100 shadow-xl" />
      <div className="absolute left-24 top-14 h-24 w-32 rotate-3 bg-sky-100 shadow-xl" />
      <div className="absolute right-12 top-8 h-28 w-24 rotate-6 bg-yellow-100 shadow-xl" />
      {[60, 160, 290].map((left, idx) => (
        <motion.div
          key={left}
          className="absolute h-4 w-16 rotate-[-8deg] rounded-sm bg-rose-300/70"
          style={{ left, top: 28 + idx * 36 }}
          animate={{ opacity: [.65, 1, .65] }}
          transition={{ duration: 3 + idx, repeat: Infinity }}
        />
      ))}
    </div>
  )
}

function CosmicPreview() {
  return (
    <div className="absolute inset-0 bg-[#03010c] overflow-hidden">
      {/* Mini Twinkling Stars */}
      {[20, 45, 75, 90, 10, 60, 30].map((left, idx) => (
        <motion.div
          key={idx}
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{ left: `${left}%`, top: `${15 + (idx % 3) * 25}%` }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2 + idx, repeat: Infinity }}
        />
      ))}
      {/* Nebulae Glow */}
      <div className="absolute inset-4 rounded-full bg-purple-500/20 blur-xl pointer-events-none" />
      {/* Constellation line & nodes */}
      <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="20" y1="30" x2="50" y2="60" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="50" y1="60" x2="80" y2="40" stroke="#c084fc" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="20" cy="30" r="2.5" fill="#a855f7" />
        <circle cx="50" cy="60" r="2.5" fill="#c084fc" />
        <circle cx="80" cy="40" r="2.5" fill="#60a5fa" />
      </svg>
      {/* Star Glass card */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-12 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2" />
        <div className="h-2 w-16 rounded bg-purple-200/20" />
      </div>
    </div>
  )
}

function VinylPreview() {
  return (
    <div className="absolute inset-0 bg-[#1e100a] overflow-hidden flex items-center justify-center">
      {/* Wood lines */}
      <div className="absolute inset-0 opacity-10 [background-image:repeating-linear-gradient(90deg,transparent,transparent_19px,black_20px)]" />
      {/* Sliding Vinyl */}
      <motion.div
        className="absolute w-24 h-24 rounded-full bg-[#111] border border-black flex items-center justify-center shadow-lg"
        animate={{ x: [0, 20, 0], rotate: [0, 360, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-1.5 rounded-full border border-neutral-800 opacity-60" />
        <div className="absolute inset-4 rounded-full border border-neutral-800 opacity-60" />
        <div className="w-8 h-8 rounded-full bg-[#e55934] border border-black flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#1e100a]" />
        </div>
      </motion.div>
      {/* Album cover */}
      <motion.div
        className="absolute w-24 h-24 bg-[#e55934] border border-[#7f230b] rounded flex flex-col justify-between p-2 shadow-2xl"
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      >
        <div className="h-1.5 w-8 rounded bg-[#ffecd1]/40" />
        <div className="h-2 w-16 rounded bg-[#ffecd1]/60" />
        <div className="flex justify-between items-center mt-1 border-t border-black/10 pt-1">
          <div className="h-1.5 w-6 rounded bg-black/30" />
          <div className="w-3 h-3 rounded-full bg-black/10 border border-black/20" />
        </div>
      </motion.div>
    </div>
  )
}

function WatercolorPreview() {
  return (
    <div className="absolute inset-0 bg-[#faf7f2] overflow-hidden flex items-center justify-center">
      {/* Watercolor Wash */}
      <div className="absolute top-4 left-6 w-20 h-20 rounded-full bg-rose-400/20 blur-lg" />
      <div className="absolute bottom-2 right-4 w-24 h-24 rounded-full bg-sky-400/15 blur-lg" />
      {/* Pinned Card */}
      <motion.div
        className="w-28 h-20 bg-white border border-stone-200 shadow-md p-2 relative"
        style={{ borderRadius: "2px 4px 3px 5px" }}
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Metal Pin */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 shadow" />
        {/* Postcard elements */}
        <div className="h-1.5 w-8 rounded bg-rose-500/10" />
        <div className="h-2 w-20 rounded bg-stone-700/10 mt-1" />
        <div className="h-2 w-14 rounded bg-stone-700/10 mt-1" />
        <div className="flex justify-between mt-2 pt-1 border-t border-stone-100">
          <div className="h-1 w-6 rounded bg-stone-400/20" />
          <div className="w-3 h-4 border border-stone-200 bg-rose-100/30" />
        </div>
      </motion.div>
    </div>
  )
}
