import type { BoardTheme } from './types'

export const THEMES: BoardTheme[] = [
  // BIRTHDAY (6)
  {
    id: 'bday-elegant',
    category: 'birthday',
    mood: 'elegant',
    name: 'Violet Glow',
    description: 'Soft gradients, calm glow, premium vibe.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(168,85,247,.55), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(59,130,246,.45), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'balloons',
  },
  {
    id: 'bday-candy-pop',
    category: 'birthday',
    mood: 'playful',
    name: 'Candy Pop',
    description: 'Bright candy gradients with confetti sparkle.',
    previewGradient:
      'radial-gradient(900px 600px at 15% 25%, rgba(34,211,238,.55), transparent 55%), radial-gradient(900px 600px at 85% 30%, rgba(251,113,133,.55), transparent 55%), radial-gradient(900px 600px at 55% 10%, rgba(253,224,71,.35), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'confetti',
  },
  {
    id: 'bday-floral-candlelight',
    category: 'birthday',
    mood: 'elegant',
    name: 'Floral Candlelight',
    description: 'Blush petals and foil shimmer for luxe birthday wishes.',
    previewGradient:
      'radial-gradient(920px 620px at 18% 18%, rgba(244,114,182,.42), transparent 58%), radial-gradient(900px 620px at 84% 22%, rgba(251,191,36,.32), transparent 56%), radial-gradient(940px 620px at 52% 88%, rgba(129,140,248,.30), transparent 58%), linear-gradient(145deg, rgba(94,33,71,.34), rgba(78,50,119,.24) 48%, rgba(42,77,148,.26))',
    cardStyle: 'paper',
    animatedBackground: 'bloom-shimmer',
  },
  {
    id: 'bday-garden-macaron',
    category: 'birthday',
    mood: 'playful',
    name: 'Garden Macaron',
    description: 'Pastel botanical layers with gentle petal drift.',
    previewGradient:
      'radial-gradient(900px 620px at 14% 24%, rgba(251,113,133,.36), transparent 56%), radial-gradient(900px 620px at 86% 20%, rgba(56,189,248,.34), transparent 56%), radial-gradient(900px 620px at 56% 92%, rgba(196,181,253,.34), transparent 56%), linear-gradient(155deg, rgba(99,102,241,.24), rgba(236,72,153,.17) 46%, rgba(34,197,94,.16))',
    cardStyle: 'glass',
    animatedBackground: 'petal-drift',
  },
  {
    id: 'bday-fireworks',
    category: 'birthday',
    mood: 'neon',
    name: 'Fireworks Burst',
    description: 'Electric bursts of color for a big moment.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(56,189,248,.55), transparent 55%), radial-gradient(900px 600px at 80% 25%, rgba(168,85,247,.55), transparent 55%), radial-gradient(900px 600px at 60% 85%, rgba(250,204,21,.32), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.02))',
    cardStyle: 'neon',
    animatedBackground: 'confetti',
  },
  {
    id: 'bday-sunset',
    category: 'birthday',
    mood: 'minimal',
    name: 'Warm Sunset',
    description: 'A cozy, warm gradient like a summer evening.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(251,146,60,.55), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(244,63,94,.45), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'balloons',
  },
  {
    id: 'bday-retro-disco',
    category: 'birthday',
    mood: 'playful',
    name: 'Retro Disco',
    description: 'Mirror-ball energy with colorful dancefloor light.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 18%, rgba(250,204,21,.48), transparent 55%), radial-gradient(900px 600px at 82% 22%, rgba(236,72,153,.52), transparent 55%), radial-gradient(900px 600px at 45% 90%, rgba(56,189,248,.40), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.02))',
    cardStyle: 'neon',
    animatedBackground: 'confetti',
  },
  {
    id: 'bday-cosmic-cake',
    category: 'birthday',
    mood: 'elegant',
    name: 'Cosmic Cake',
    description: 'Celestial glow with premium midnight sparkle.',
    previewGradient:
      'radial-gradient(900px 600px at 18% 24%, rgba(99,102,241,.56), transparent 55%), radial-gradient(900px 600px at 82% 20%, rgba(168,85,247,.50), transparent 55%), radial-gradient(900px 600px at 60% 88%, rgba(251,191,36,.28), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'galaxy',
  },
  {
    id: 'bday-pop-art',
    category: 'birthday',
    mood: 'neon',
    name: 'Pop Art Burst',
    description: 'Bold color blocks and punchy high-contrast joy.',
    previewGradient:
      'radial-gradient(900px 600px at 16% 20%, rgba(59,130,246,.62), transparent 55%), radial-gradient(900px 600px at 84% 20%, rgba(244,63,94,.60), transparent 55%), radial-gradient(900px 600px at 50% 85%, rgba(250,204,21,.36), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.02))',
    cardStyle: 'neon',
    animatedBackground: 'floating-shapes',
  },

  // FAREWELL (6)
  {
    id: 'farewell-corporate',
    category: 'farewell',
    mood: 'corporate',
    name: 'Blue Meridian',
    description: 'Clean and modern for teams.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 30%, rgba(59,130,246,.55), transparent 55%), radial-gradient(900px 600px at 80% 20%, rgba(168,85,247,.35), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'floating-shapes',
  },
  {
    id: 'farewell-aurora',
    category: 'farewell',
    mood: 'elegant',
    name: 'Aurora Goodbye',
    description: 'Soft aurora ribbons for warm send-offs.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 25%, rgba(59,130,246,.45), transparent 55%), radial-gradient(900px 600px at 85% 20%, rgba(34,211,238,.40), transparent 55%), radial-gradient(900px 600px at 55% 85%, rgba(168,85,247,.35), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'stars',
  },
  {
    id: 'farewell-pressed-petal',
    category: 'farewell',
    mood: 'minimal',
    name: 'Pressed Petal Note',
    description: 'A heartfelt card look with soft floral paper depth.',
    previewGradient:
      'radial-gradient(920px 620px at 18% 18%, rgba(244,114,182,.24), transparent 56%), radial-gradient(900px 620px at 82% 22%, rgba(59,130,246,.24), transparent 56%), radial-gradient(920px 620px at 54% 90%, rgba(251,191,36,.16), transparent 56%), linear-gradient(150deg, rgba(255,255,255,.14), rgba(148,163,184,.12) 52%, rgba(30,64,175,.14))',
    cardStyle: 'paper',
    animatedBackground: 'petal-drift',
  },
  {
    id: 'farewell-magnolia-dawn',
    category: 'farewell',
    mood: 'elegant',
    name: 'Magnolia Dawn',
    description: 'Warm magnolia glow for graceful goodbyes.',
    previewGradient:
      'radial-gradient(900px 620px at 16% 22%, rgba(251,146,60,.30), transparent 56%), radial-gradient(920px 620px at 84% 18%, rgba(236,72,153,.24), transparent 56%), radial-gradient(920px 620px at 52% 88%, rgba(14,165,233,.22), transparent 56%), linear-gradient(150deg, rgba(124,58,237,.18), rgba(249,115,22,.16) 44%, rgba(56,189,248,.20))',
    cardStyle: 'glass',
    animatedBackground: 'bloom-shimmer',
  },
  {
    id: 'farewell-warm',
    category: 'farewell',
    mood: 'gold',
    name: 'Golden Memories',
    description: 'A touch of gold to remember the good times.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(250,204,21,.30), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(245,158,11,.30), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'stars',
  },
  {
    id: 'farewell-sunrise-notes',
    category: 'farewell',
    mood: 'playful',
    name: 'Sunrise Notes',
    description: 'A bright horizon for the next chapter.',
    previewGradient:
      'radial-gradient(900px 600px at 15% 20%, rgba(251,146,60,.55), transparent 55%), radial-gradient(900px 600px at 80% 25%, rgba(59,130,246,.40), transparent 55%), radial-gradient(900px 600px at 50% 90%, rgba(244,114,182,.28), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'floating-shapes',
  },
  {
    id: 'farewell-paper-notes',
    category: 'farewell',
    mood: 'minimal',
    name: 'Paper Notes',
    description: 'Editorial paper texture feel for thoughtful words.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(148,163,184,.24), transparent 55%), radial-gradient(900px 600px at 78% 26%, rgba(59,130,246,.26), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.03))',
    cardStyle: 'paper',
    animatedBackground: 'stars',
  },
  {
    id: 'farewell-horizon',
    category: 'farewell',
    mood: 'elegant',
    name: 'Horizon Blue',
    description: 'Wide sky gradient for new beginnings and gratitude.',
    previewGradient:
      'radial-gradient(900px 600px at 15% 22%, rgba(14,165,233,.48), transparent 55%), radial-gradient(900px 600px at 82% 24%, rgba(99,102,241,.42), transparent 55%), radial-gradient(900px 600px at 58% 92%, rgba(251,191,36,.20), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'floating-shapes',
  },
  {
    id: 'farewell-lantern-night',
    category: 'farewell',
    mood: 'gold',
    name: 'Lantern Night',
    description: 'Warm amber lights for meaningful send-off moments.',
    previewGradient:
      'radial-gradient(900px 600px at 18% 20%, rgba(251,191,36,.34), transparent 55%), radial-gradient(900px 600px at 85% 30%, rgba(249,115,22,.30), transparent 55%), radial-gradient(900px 600px at 52% 80%, rgba(30,64,175,.30), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'stars',
  },

  // ANNIVERSARY (6)
  {
    id: 'anni-elegant',
    category: 'anniversary',
    mood: 'elegant',
    name: 'Milestone Aura',
    description: 'For tenure, milestones, and team wins.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(34,211,238,.45), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(168,85,247,.45), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'confetti',
  },
  {
    id: 'anni-aurora-milestone',
    category: 'anniversary',
    mood: 'corporate',
    name: 'Aurora Milestone',
    description: 'Modern recognition with calm motion.',
    previewGradient:
      'radial-gradient(900px 600px at 18% 25%, rgba(34,211,238,.40), transparent 55%), radial-gradient(900px 600px at 82% 20%, rgba(59,130,246,.45), transparent 55%), radial-gradient(900px 600px at 50% 90%, rgba(168,85,247,.35), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'floating-shapes',
  },
  {
    id: 'anni-gold',
    category: 'anniversary',
    mood: 'gold',
    name: 'Premium Gold',
    description: 'A premium highlight for recognition.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(250,204,21,.35), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(168,85,247,.30), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'paper',

    animatedBackground: 'stars',
  },
  {
    id: 'anni-champagne-toast',
    category: 'anniversary',
    mood: 'gold',
    name: 'Champagne Toast',
    description: 'Golden sparkle for big wins and tenure.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(250,204,21,.40), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(245,158,11,.32), transparent 55%), radial-gradient(900px 600px at 55% 10%, rgba(59,130,246,.22), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'confetti',
  },
  {
    id: 'anni-ruby',
    category: 'anniversary',
    mood: 'playful',
    name: 'Ruby Anniversary',
    description: 'Deep reds and purples for lasting impact.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(225,29,72,.50), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(159,18,57,.40), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'glass',

    animatedBackground: 'confetti',
  },
  {
    id: 'anni-silver',
    category: 'anniversary',
    mood: 'minimal',
    name: 'Silver Milestone',
    description: 'Sleek, professional, and timeless.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(148,163,184,.35), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(203,213,225,.25), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'floating-shapes',
  },
  {
    id: 'anni-marble-honor',
    category: 'anniversary',
    mood: 'corporate',
    name: 'Marble Honor',
    description: 'Executive recognition with a polished premium tone.',
    previewGradient:
      'radial-gradient(900px 600px at 18% 22%, rgba(226,232,240,.24), transparent 55%), radial-gradient(900px 600px at 84% 24%, rgba(148,163,184,.30), transparent 55%), radial-gradient(900px 600px at 52% 88%, rgba(59,130,246,.20), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.09), rgba(255,255,255,.03))',
    cardStyle: 'paper',
    animatedBackground: 'floating-shapes',
  },
  {
    id: 'anni-rose-foil',
    category: 'anniversary',
    mood: 'gold',
    name: 'Rose Foil Milestone',
    description: 'Rose-gold shine and floral elegance for milestone pride.',
    previewGradient:
      'radial-gradient(920px 620px at 17% 20%, rgba(251,113,133,.34), transparent 56%), radial-gradient(900px 620px at 83% 20%, rgba(250,204,21,.24), transparent 56%), radial-gradient(920px 620px at 56% 90%, rgba(99,102,241,.20), transparent 56%), linear-gradient(150deg, rgba(120,53,15,.22), rgba(190,24,93,.16) 46%, rgba(30,64,175,.16))',
    cardStyle: 'paper',
    animatedBackground: 'bloom-shimmer',
  },
  {
    id: 'anni-wisteria-keepsake',
    category: 'anniversary',
    mood: 'elegant',
    name: 'Wisteria Keepsake',
    description: 'Keepsake-card style with drifting lavender petals.',
    previewGradient:
      'radial-gradient(900px 620px at 14% 22%, rgba(192,132,252,.36), transparent 56%), radial-gradient(900px 620px at 86% 20%, rgba(56,189,248,.28), transparent 56%), radial-gradient(920px 620px at 54% 90%, rgba(251,191,36,.14), transparent 56%), linear-gradient(155deg, rgba(88,28,135,.24), rgba(79,70,229,.18) 48%, rgba(34,197,94,.14))',
    cardStyle: 'glass',
    animatedBackground: 'petal-drift',
  },

  // OTHER (6)
  {
    id: 'other-botanical-soiree',
    category: 'other',
    mood: 'playful',
    name: 'Botanical Soiree',
    description: 'Greeting-card florals for open-format celebrations.',
    previewGradient:
      'radial-gradient(920px 620px at 16% 20%, rgba(244,114,182,.30), transparent 56%), radial-gradient(900px 620px at 84% 22%, rgba(45,212,191,.28), transparent 56%), radial-gradient(920px 620px at 56% 88%, rgba(251,191,36,.18), transparent 56%), linear-gradient(150deg, rgba(91,33,182,.20), rgba(219,39,119,.16) 44%, rgba(14,165,233,.18))',
    cardStyle: 'glass',
    animatedBackground: 'petal-drift',
  },
  {
    id: 'other-iris-hologram',
    category: 'other',
    mood: 'neon',
    name: 'Iris Hologram',
    description: 'Iridescent floral foil with premium shimmer motion.',
    previewGradient:
      'radial-gradient(920px 620px at 16% 18%, rgba(59,130,246,.38), transparent 56%), radial-gradient(900px 620px at 86% 22%, rgba(244,114,182,.34), transparent 56%), radial-gradient(920px 620px at 54% 90%, rgba(250,204,21,.16), transparent 56%), linear-gradient(145deg, rgba(30,41,59,.30), rgba(79,70,229,.22) 46%, rgba(190,24,93,.20))',
    cardStyle: 'neon',
    animatedBackground: 'bloom-shimmer',
  },
  {
    id: 'celebration-minimal',
    category: 'other',
    mood: 'minimal',
    name: 'Soft Pastel',
    description: 'Gentle gradients, airy spacing.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(168,85,247,.35), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(59,130,246,.35), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'floating-shapes',
  },
  {
    id: 'other-galaxy',
    category: 'other',
    mood: 'elegant',
    name: 'Deep Space',
    description: 'A stellar theme for out-of-this-world achievements.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(79,70,229,.55), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(147,51,234,.45), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'galaxy',
  },
  {
    id: 'other-fresh',
    category: 'other',
    mood: 'playful',
    name: 'Fresh Start',
    description: 'Vibrant and energizing, perfect for welcome cards.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(52,211,153,.45), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(74,222,128,.45), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'paper',
    animatedBackground: 'balloons',
  },
  {
    id: 'other-ocean-drift',
    category: 'other',
    mood: 'elegant',
    name: 'Ocean Drift',
    description: 'Cool blues and gentle drift for classy moments.',
    previewGradient:
      'radial-gradient(900px 600px at 18% 25%, rgba(34,211,238,.45), transparent 55%), radial-gradient(900px 600px at 82% 20%, rgba(59,130,246,.45), transparent 55%), radial-gradient(900px 600px at 55% 85%, rgba(14,165,233,.25), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'floating-shapes',
  },
  {
    id: 'other-carnival-night',
    category: 'other',
    mood: 'playful',
    name: 'Carnival Night',
    description: 'Festival-inspired lights with vibrant celebration energy.',
    previewGradient:
      'radial-gradient(900px 600px at 15% 18%, rgba(250,204,21,.48), transparent 55%), radial-gradient(900px 600px at 84% 24%, rgba(244,63,94,.50), transparent 55%), radial-gradient(900px 600px at 55% 88%, rgba(14,165,233,.38), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.02))',
    cardStyle: 'neon',
    animatedBackground: 'confetti',
  },
  {
    id: 'other-aurora-luxe',
    category: 'other',
    mood: 'elegant',
    name: 'Aurora Luxe',
    description: 'Premium aurora layers for elevated celebration moments.',
    previewGradient:
      'radial-gradient(900px 600px at 18% 22%, rgba(34,211,238,.40), transparent 55%), radial-gradient(900px 600px at 84% 18%, rgba(99,102,241,.48), transparent 55%), radial-gradient(900px 600px at 50% 90%, rgba(168,85,247,.34), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'galaxy',
  },
  {
    id: 'other-sunbeam-studio',
    category: 'other',
    mood: 'minimal',
    name: 'Sunbeam Studio',
    description: 'Bright editorial warmth for open-format celebrations.',
    previewGradient:
      'radial-gradient(900px 600px at 18% 20%, rgba(251,191,36,.34), transparent 55%), radial-gradient(900px 600px at 82% 26%, rgba(56,189,248,.30), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.03))',
    cardStyle: 'paper',
    animatedBackground: 'floating-shapes',
  },
]
