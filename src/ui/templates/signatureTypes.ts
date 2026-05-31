import type { ReactNode } from 'react'
import type { Message, Occasion } from '../store/types'

export type SignatureTemplateId =
  | 'signature:birthday-wall-art'
  | 'signature:hanging-tree-garden'
  | 'signature:cosmic-constellation'
  | 'signature:vinyl-lounge'
  | 'signature:watercolor-journal'
  | 'signature:floral-letterpress'
  | 'signature:origami-fold'
  | 'signature:butterfly-garden'
  | 'signature:paperclip-desk'
  | 'signature:memory-lane-paper'
  | 'signature:scrapbook-tape'

export type SignatureTemplateDefinition = {
  id: SignatureTemplateId
  category: Occasion
  name: string
  description: string
  accent: string
  previewTone: 'light' | 'dark' | 'paper'
}

export type SignatureTemplateProps = {
  messages: Message[]
  recipientName?: string
  title?: string
  mode?: 'owner' | 'contributor' | 'reveal' | 'preview'
  topBar?: ReactNode
  actionSlot?: ReactNode
  emptyState?: ReactNode
  footerSlot?: ReactNode
  isRevealing?: boolean
  onRevealComplete?: () => void
  previewTone?: 'light' | 'dark' | 'paper'
}
