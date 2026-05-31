import type { Occasion } from '../store/types'
import type { SignatureTemplateDefinition, SignatureTemplateId } from './signatureTypes'

export const SIGNATURE_TEMPLATES: SignatureTemplateDefinition[] = [
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
