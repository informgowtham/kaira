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
    id: 'bday-playful',
    category: 'birthday',
    mood: 'playful',
    name: 'Confetti Pastel',
    description: 'Playful color pops with gentle motion.',
    previewGradient:
      'radial-gradient(900px 600px at 10% 25%, rgba(34,211,238,.55), transparent 55%), radial-gradient(900px 600px at 80% 20%, rgba(244,114,182,.45), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'confetti',
  },
  {
    id: 'bday-neon',
    category: 'birthday',
    mood: 'neon',
    name: 'Neon Party',
    description: 'High energy neon vibes for a big celebration.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(236,72,153,.65), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(249,115,22,.60), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'neon',

    animatedBackground: 'confetti',
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
    id: 'farewell-minimal',
    category: 'farewell',
    mood: 'minimal',
    name: 'Quiet Night',
    description: 'Minimal, warm, and thoughtful.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(255,255,255,.12), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(59,130,246,.28), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'stars',
  },
  {
    id: 'farewell-botanical',
    category: 'farewell',
    mood: 'elegant',
    name: 'Greenery',
    description: 'Refreshing and calm, like a new beginning.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(16,185,129,.45), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(20,184,166,.35), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'paper',

    animatedBackground: 'floating-shapes',
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

  // OTHER (6)
  {
    id: 'other-neon',
    category: 'other',
    mood: 'neon',
    name: 'Neon Celebration',
    description: 'Bold but elegant neon shimmer.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(236,72,153,.45), transparent 55%), radial-gradient(900px 600px at 80% 30%, rgba(34,211,238,.45), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'neon',

    animatedBackground: 'confetti',
  },
  {
    id: 'other-festival-lights',
    category: 'other',
    mood: 'playful',
    name: 'Festival Lights',
    description: 'Vibrant lights and motion for any celebration.',
    previewGradient:
      'radial-gradient(900px 600px at 20% 20%, rgba(244,114,182,.50), transparent 55%), radial-gradient(900px 600px at 80% 25%, rgba(34,211,238,.45), transparent 55%), radial-gradient(900px 600px at 55% 85%, rgba(74,222,128,.35), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
    cardStyle: 'glass',
    animatedBackground: 'confetti',
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
]
