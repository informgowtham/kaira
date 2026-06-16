import type { Occasion } from '../store/types'
import type { SignatureTemplateDefinition, SignatureTemplateId } from './signatureTypes'

export const SIGNATURE_TEMPLATES: SignatureTemplateDefinition[] = [
  {
    id: 'signature:confetti-orbit',
    category: 'birthday',
    name: 'Confetti Orbit',
    description: 'Cream paper space with orbiting confetti bursts and floating celebration notes.',
    accent: '#f43f5e',
    previewTone: 'light',
  },
  {
    id: 'signature:joy-ribbons',
    category: 'birthday',
    name: 'Joy Ribbons',
    description: 'Ribbon arcs, bright stage lighting, and tall message banners for lively wishes.',
    accent: '#7c3aed',
    previewTone: 'light',
  },
  {
    id: 'signature:birthday-wall-art',
    category: 'birthday',
    name: 'Birthday Wall Art',
    description: 'A playful framed gallery wall with cakes, balloons, and birthday artwork.',
    accent: '#f472b6',
    previewTone: 'dark',
  },
  {
    id: 'signature:hanging-tree-garden',
    category: 'anniversary',
    name: 'Hanging Tree Garden',
    description: 'A living memory tree with message tags tied to glowing branches.',
    accent: '#4ade80',
    previewTone: 'dark',
  },
  {
    id: 'signature:cosmic-constellation',
    category: 'anniversary',
    name: 'Cosmic Constellation',
    description: 'Glowing star map with coordinate paths and neon-glass cards.',
    accent: '#a855f7',
    previewTone: 'dark',
  },
  {
    id: 'signature:vinyl-lounge',
    category: 'farewell',
    name: 'Retro Vinyl Lounge',
    description: 'Tactile vintage record jackets with sliding, spinning vinyl discs.',
    accent: '#f97316',
    previewTone: 'dark',
  },
  {
    id: 'signature:watercolor-journal',
    category: 'farewell',
    name: 'Watercolor Journal',
    description: 'Hand-painted pigment washes, ink splatters, and pinned postcards.',
    accent: '#be123c',
    previewTone: 'paper',
  },
  {
    id: 'signature:paper-trails',
    category: 'farewell',
    name: 'Paper Trails',
    description: 'Stamped stationery and warm routes tracing shared stops and stories.',
    accent: '#9a5b37',
    previewTone: 'paper',
  },
  {
    id: 'signature:gratitude-grid',
    category: 'farewell',
    name: 'Gratitude Grid',
    description: 'A neat editorial thank-you wall with structured cards and appreciation labels.',
    accent: '#0f766e',
    previewTone: 'paper',
  },
  {
    id: 'signature:floral-letterpress',
    category: 'birthday',
    name: 'Floral Letterpress',
    description: 'Cream paper, pressed flowers, foil blooms, and greeting-card elegance.',
    accent: '#be5b7b',
    previewTone: 'paper',
  },
  {
    id: 'signature:origami-fold',
    category: 'other',
    name: 'Origami Fold',
    description: 'Folded paper planes, angular layers, and unfolding message panels.',
    accent: '#4f46e5',
    previewTone: 'light',
  },
  {
    id: 'signature:butterfly-garden',
    category: 'birthday',
    name: 'Butterfly Garden',
    description: 'Pastel butterflies, dotted trails, and a clean white greeting-card field.',
    accent: '#a855f7',
    previewTone: 'light',
  },
  {
    id: 'signature:paperclip-desk',
    category: 'farewell',
    name: 'Paperclip Desk',
    description: 'Pinned notes, paper clips, desk texture, and an editorial team send-off.',
    accent: '#2563eb',
    previewTone: 'paper',
  },
  {
    id: 'signature:memory-lane-paper',
    category: 'farewell',
    name: 'Memory Lane Paper',
    description: 'A paper timeline where notes sit along a warm path of shared moments.',
    accent: '#b45309',
    previewTone: 'paper',
  },
  {
    id: 'signature:scrapbook-tape',
    category: 'other',
    name: 'Scrapbook Tape',
    description: 'Layered papers, tape strips, stickers, photos, and handmade keepsake energy.',
    accent: '#db2777',
    previewTone: 'paper',
  },
  {
    id: 'signature:milestone-rings',
    category: 'anniversary',
    name: 'Milestone Rings',
    description: 'Soft ceremonial rings, refined spacing, and milestone cards arranged in orbit.',
    accent: '#b45309',
    previewTone: 'light',
  },
  {
    id: 'signature:aurora-awards',
    category: 'anniversary',
    name: 'Aurora Awards',
    description: 'Polished ribbons of light with a premium recognition-stage mood.',
    accent: '#0ea5e9',
    previewTone: 'dark',
  },
  {
    id: 'signature:abstract-collage',
    category: 'other',
    name: 'Abstract Collage',
    description: 'Cut-paper blocks, painted marks, and a modern gallery collage composition.',
    accent: '#ea580c',
    previewTone: 'paper',
  },
  {
    id: 'signature:color-field',
    category: 'other',
    name: 'Color Field',
    description: 'Museum-like color planes with calm floating notes and spacious composition.',
    accent: '#2563eb',
    previewTone: 'light',
  },
]

export function isSignatureTemplateId(themeId: string | undefined): themeId is SignatureTemplateId {
  return Boolean(themeId && SIGNATURE_TEMPLATES.some((template) => template.id === themeId))
}

export function getSignatureTemplate(themeId: string | undefined) {
  return SIGNATURE_TEMPLATES.find((template) => template.id === themeId)
}

export function signatureTemplatesForOccasion(occasion: Occasion) {
  const direct = SIGNATURE_TEMPLATES.filter((template) => template.category === occasion)
  if (direct.length >= 2) return direct
  return [...direct, ...SIGNATURE_TEMPLATES.filter((template) => template.category !== occasion)].slice(0, 4)
}

export function firstSignatureTemplateForOccasion(occasion: Occasion) {
  return signatureTemplatesForOccasion(occasion)[0]
}
