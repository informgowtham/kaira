import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

export function Button(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    left?: ReactNode
    tone?: 'light' | 'dark' | 'paper'
  },
) {
  const { className, variant = 'primary', left, tone = 'dark', children, ...rest } = props
  return (
    <button
      {...rest}
      className={clsx(
        'kb-ring inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition',
        variant === 'primary' &&
          'bg-white/90 text-black hover:bg-white active:bg-white/85 shadow-[0_10px_24px_rgba(0,0,0,0.35)]',
        variant === 'secondary' &&
          (tone === 'dark'
            ? 'kb-glass text-white hover:bg-white/10 active:bg-white/12 kb-shadow'
            : 'bg-black/5 text-black/70 border border-black/10 hover:bg-black/10 hover:text-black/90 active:bg-black/15 shadow-sm'),
        variant === 'ghost' &&
          (tone === 'dark'
            ? 'text-white/85 hover:text-white hover:bg-white/8 active:bg-white/10'
            : 'text-black/60 hover:text-black/90 hover:bg-black/5 active:bg-black/10'),
        variant === 'danger' && 'bg-rose-500/90 text-white hover:bg-rose-500 active:bg-rose-500/80',
        rest.disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {left}
      {children}
    </button>
  )
}
