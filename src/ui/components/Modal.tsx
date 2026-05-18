import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

export function Modal(props: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  const { open, title, onClose, children } = props
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/55" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-lg rounded-xl kb-glass kb-shadow overflow-hidden"
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="text-sm font-semibold text-white">{title}</div>
              <Button variant="ghost" onClick={onClose} aria-label="Close modal" left={<X size={16} />} />
            </div>
            <div className="px-4 py-4">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
