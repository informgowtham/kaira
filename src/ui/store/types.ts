export type Occasion = 'birthday' | 'farewell' | 'anniversary' | 'other'
export type PlanTier = 'free' | 'pro'
export type BoardStatus = 'draft' | 'collecting_messages' | 'scheduled' | 'delivered' | 'archived'

export type ThemeCategory = Occasion | 'celebration'
export type ThemeMood = 'elegant' | 'playful' | 'corporate' | 'minimal' | 'neon' | 'gold'

export type User = {
  id: string
  email: string
  displayName: string
  provider: 'google' | 'email'
  isAdmin: boolean
}

export type BoardTheme = {
  id: string
  category: ThemeCategory
  mood: ThemeMood
  name: string
  description: string
  previewGradient: string
  cardStyle: 'glass' | 'paper' | 'neon'
  proOnly?: boolean
  animatedBackground?:
    | 'balloons'
    | 'confetti'
    | 'stars'
    | 'floating-shapes'
    | 'galaxy'
    | 'petal-drift'
    | 'bloom-shimmer'
}

export type Board = {
  id: string
  ownerId: string
  recipientName: string
  occasion: Occasion
  title: string
  themeId: string
  status: BoardStatus
  contributorToken: string
  revealToken: string
  planTier?: PlanTier
  scheduledAt?: string
  destinationType?: 'recipient' | 'creator'
  recipientContact?: string
  createdAt: string
}

export type Message = {
  id: string
  boardId: string
  displayName?: string
  text: string
  createdAt: string
  emoji?: string
  gifUrl?: string
  imageUrl?: string
  sticker?: 'sparkle' | 'heart' | 'star'
}
