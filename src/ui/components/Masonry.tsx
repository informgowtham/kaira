import type { ReactNode } from 'react'

export function Masonry(props: { children: ReactNode }) {
  return <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 [column-fill:_balance]">{props.children}</div>
}
