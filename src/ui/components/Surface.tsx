import type { ReactNode } from 'react'
import { clsx } from 'clsx'

export function Surface(props: { className?: string; children: ReactNode }) {
  return <div className={clsx('kb-glass kb-shadow rounded-xl', props.className)}>{props.children}</div>
}
