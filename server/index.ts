import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { OAuth2Client } from 'google-auth-library'
import { pool, withTx } from './db'
import { authMiddleware, signAuthToken, type AuthedUser } from './auth'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'placeholder-client-id'
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)
const KLIPY_API_KEY = process.env.KLIPY_API_KEY || ''

type ReqUser = Express.Request & { user: AuthedUser }

const app = express()
const port = Number(process.env.API_PORT || 4000)
const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || 'admin@kairaboard.dev')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
)

function isAdminEmail(email: string) {
  return ADMIN_EMAILS.has(email.trim().toLowerCase())
}

const INTERNAL_ORG_ID = '10000000-0000-0000-0000-000000000001'
const DEMO_ORG_ID = '10000000-0000-0000-0000-000000000002'
const DEFAULT_ORG_ID = '10000000-0000-0000-0000-000000000099'

function slugifyOrgName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || `org-${Date.now()}`
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = (req as ReqUser).user
  if (!isAdminEmail(user.email)) {
    res.status(403).json({ error: 'Admin access required' })
    return
  }
  next()
}

function organizationFilter(query: express.Request['query']) {
  return typeof query.organizationId === 'string' && query.organizationId.trim()
    ? query.organizationId.trim()
    : ''
}

async function ensureUserOrganization(userId: string, email: string, role: 'owner' | 'admin' | 'member' = 'owner') {
  const organizationId =
    email === 'admin@kairaboard.dev' ? INTERNAL_ORG_ID :
    email === 'user@kairaboard.dev' ? DEMO_ORG_ID :
    DEFAULT_ORG_ID

  await pool.query(
    `INSERT INTO organization_members (organization_id, user_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (organization_id, user_id)
     DO UPDATE SET role = EXCLUDED.role`,
    [organizationId, userId, email === 'admin@kairaboard.dev' ? 'admin' : role],
  )
  return organizationId
}

async function primaryOrganizationId(userId: string) {
  const result = await pool.query(
    `SELECT organization_id
     FROM organization_members
     WHERE user_id = $1
     ORDER BY CASE role WHEN 'owner' THEN 1 WHEN 'admin' THEN 2 ELSE 3 END, created_at
     LIMIT 1`,
    [userId],
  )
  return result.rows[0]?.organization_id || DEFAULT_ORG_ID
}

const UPLOADS_DIR = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

app.use(
  cors({
    origin: (origin, callback) => {
      // Dev-friendly CORS: allow common local Vite ports/hosts.
      const customOrigins = (process.env.CORS_ORIGIN || '')
        .split(',')
        .map(o => o.trim())
        .filter(Boolean)

      const allowlist = new Set([
        ...customOrigins,
        'http://127.0.0.1:4173',
        'http://localhost:4173',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
      ])

      if (!origin) return callback(null, true)
      if (allowlist.has(origin)) return callback(null, true)
      return callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: false,
  }),
)
app.use(express.json({ limit: '2mb' }))
app.use('/uploads', express.static(UPLOADS_DIR))

app.get('/api/gifs', async (req, res) => {
  if (!KLIPY_API_KEY) {
    res.status(503).json({ error: 'GIF provider is not configured' })
    return
  }

  const query = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  const endpoint = query
    ? `https://api.klipy.com/api/v1/${KLIPY_API_KEY}/gifs/search?q=${encodeURIComponent(query)}&per_page=12`
    : `https://api.klipy.com/api/v1/${KLIPY_API_KEY}/gifs/trending?per_page=12`

  try {
    const response = await fetch(endpoint)
    if (!response.ok) {
      res.status(502).json({ error: 'GIF provider request failed' })
      return
    }
    const json = await response.json() as { data?: any }
    const results = json?.data?.data || json?.data || []
    res.json({ gifs: results })
  } catch (error) {
    console.error('GIF proxy error:', error)
    res.status(502).json({ error: 'Failed to fetch GIFs' })
  }
})

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' })
    return
  }
  res.json({ url: `/uploads/${req.file.filename}` })
})

app.get('/api/health', (_, res) => {
  res.json({ ok: true })
})

app.post('/api/auth/email', async (req, res) => {
  const { email, password, displayName, mode } = req.body as {
    email?: string
    password?: string
    displayName?: string
    mode?: 'login' | 'signup'
  }
  if (!email?.trim()) {
    res.status(400).json({ error: 'Email is required' })
    return
  }
  if (!password || password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' })
    return
  }

  const normalizedEmail = email.trim().toLowerCase()
  const normalizedName = (displayName?.trim() || normalizedEmail.split('@')[0] || 'Creator').slice(0, 80)

  const existing = await pool.query(
    'SELECT id, email, auth_provider, display_name, password_hash, subscription_status FROM users WHERE email = $1',
    [normalizedEmail],
  )

  let userRow = existing.rows[0]

  if (mode === 'login') {
    if (!userRow) {
      res.status(404).json({ error: 'Account not found. Try sign up.' })
      return
    }
    if (userRow.auth_provider !== 'email') {
      res.status(400).json({ error: `Please sign in with ${userRow.auth_provider}` })
      return
    }
    const isValid = await bcrypt.compare(password, userRow.password_hash)
    if (!isValid) {
      res.status(401).json({ error: 'Invalid password' })
      return
    }
  } else {
    // Signup mode
    if (userRow) {
      res.status(409).json({ error: 'Email already exists. Try log in.' })
      return
    }
    const hash = await bcrypt.hash(password, 10)
    const created = await pool.query(
      `INSERT INTO users (email, auth_provider, display_name, password_hash)
       VALUES ($1, 'email', $2, $3)
       RETURNING id, email, auth_provider, display_name, subscription_status`,
      [normalizedEmail, normalizedName, hash],
    )
    userRow = created.rows[0]
  }

  const user: AuthedUser = {
    id: userRow.id,
    email: userRow.email,
    provider: userRow.auth_provider as 'google' | 'email',
    displayName: userRow.display_name,
  }

  await ensureUserOrganization(user.id, user.email)
  const token = signAuthToken(user)
  res.json({ token, user: { ...user, isAdmin: isAdminEmail(user.email) }, plan: userRow.subscription_status as 'free' | 'pro' })
})

app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body as { credential?: string }
  if (!credential) {
    res.status(400).json({ error: 'Google credential is required' })
    return
  }
  if (GOOGLE_CLIENT_ID === 'placeholder-client-id') {
    res.status(503).json({ error: 'Google Sign-In is not configured' })
    return
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload || !payload.email) {
      res.status(400).json({ error: 'Invalid Google payload' })
      return
    }

    const email = payload.email.trim().toLowerCase()
    const displayName = (payload.name || email.split('@')[0]).slice(0, 80)

    const upserted = await pool.query(
      `INSERT INTO users (email, auth_provider, display_name)
       VALUES ($1, 'google', $2)
       ON CONFLICT (email)
       DO UPDATE SET auth_provider = 'google', display_name = EXCLUDED.display_name
       RETURNING id, email, auth_provider, display_name, subscription_status`,
      [email, displayName],
    )
    const row = upserted.rows[0]
    const user: AuthedUser = {
      id: row.id,
      email: row.email,
      provider: row.auth_provider as 'google' | 'email',
      displayName: row.display_name,
    }
    await ensureUserOrganization(user.id, user.email)
    const token = signAuthToken(user)
    res.json({ token, user: { ...user, isAdmin: isAdminEmail(user.email) }, plan: row.subscription_status as 'free' | 'pro' })
  } catch (error) {
    console.error('Google auth error:', error)
    res.status(401).json({ error: 'Invalid Google credential' })
  }
})

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const user = (req as ReqUser).user
  const dbUser = await pool.query(
    'SELECT id, email, auth_provider, display_name, subscription_status FROM users WHERE id = $1',
    [user.id],
  )
  if (!dbUser.rows[0]) {
    res.status(401).json({ error: 'User not found' })
    return
  }
  const row = dbUser.rows[0]
  res.json({
    user: { id: row.id, email: row.email, provider: row.auth_provider, displayName: row.display_name, isAdmin: isAdminEmail(row.email) },
    plan: row.subscription_status as 'free' | 'pro',
  })
})

app.patch('/api/auth/plan', authMiddleware, async (req, res) => {
  const user = (req as ReqUser).user
  const { plan } = req.body as { plan?: 'free' | 'pro' }
  if (plan !== 'free' && plan !== 'pro') {
    res.status(400).json({ error: 'Invalid plan' })
    return
  }
  await pool.query('UPDATE users SET subscription_status = $1 WHERE id = $2', [plan, user.id])
  res.json({ plan })
})

app.get('/api/admin/organizations', authMiddleware, requireAdmin, async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  const like = `%${q}%`
  const organizations = await pool.query(
    `SELECT o.id, o.name, o.slug, o.status, o.plan_tier, o.created_at, o.updated_at,
            COUNT(DISTINCT om.user_id)::int AS users_count,
            COUNT(DISTINCT b.id)::int AS boards_count,
            MAX(GREATEST(COALESCE(b.updated_at, b.created_at), o.updated_at)) AS last_activity_at
     FROM organizations o
     LEFT JOIN organization_members om ON om.organization_id = o.id
     LEFT JOIN boards b ON b.organization_id = o.id
     WHERE ($1 = '' OR o.name ILIKE $2 OR o.slug ILIKE $2)
     GROUP BY o.id
     ORDER BY o.name ASC
     LIMIT 200`,
    [q, like],
  )
  res.json({ organizations: organizations.rows })
})

app.post('/api/admin/organizations', authMiddleware, requireAdmin, async (req, res) => {
  const { name, status, planTier } = req.body as { name?: string; status?: 'active' | 'paused' | 'archived'; planTier?: 'free' | 'pro' }
  if (!name?.trim()) {
    res.status(400).json({ error: 'Organization name is required' })
    return
  }
  const baseSlug = slugifyOrgName(name)
  const slugCount = await pool.query(
    'SELECT COUNT(*)::int AS count FROM organizations WHERE slug = $1 OR slug LIKE $2',
    [baseSlug, `${baseSlug}-%`],
  )
  const slug = slugCount.rows[0]?.count ? `${baseSlug}-${Number(slugCount.rows[0].count) + 1}` : baseSlug
  const organization = await pool.query(
    `INSERT INTO organizations (name, slug, status, plan_tier)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, slug, status, plan_tier, created_at, updated_at`,
    [name.trim().slice(0, 120), slug, status || 'active', planTier || 'free'],
  )
  res.json({ organization: organization.rows[0] })
})

app.patch('/api/admin/organizations/:organizationId', authMiddleware, requireAdmin, async (req, res) => {
  const { organizationId } = req.params
  const { name, status, planTier } = req.body as { name?: string; status?: 'active' | 'paused' | 'archived'; planTier?: 'free' | 'pro' }
  const organization = await pool.query(
    `UPDATE organizations
     SET name = COALESCE($1, name),
         status = COALESCE($2, status),
         plan_tier = COALESCE($3, plan_tier),
         updated_at = NOW()
     WHERE id = $4
     RETURNING id, name, slug, status, plan_tier, created_at, updated_at`,
    [name?.trim() || null, status || null, planTier || null, organizationId],
  )
  if (!organization.rows[0]) {
    res.status(404).json({ error: 'Organization not found' })
    return
  }
  res.json({ organization: organization.rows[0] })
})

app.post('/api/admin/organizations/:organizationId/members', authMiddleware, requireAdmin, async (req, res) => {
  const { organizationId } = req.params
  const { userId, role } = req.body as { userId?: string; role?: 'owner' | 'admin' | 'member' }
  if (!userId) {
    res.status(400).json({ error: 'userId is required' })
    return
  }
  const member = await pool.query(
    `INSERT INTO organization_members (organization_id, user_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (organization_id, user_id)
     DO UPDATE SET role = EXCLUDED.role
     RETURNING organization_id, user_id, role, created_at`,
    [organizationId, userId, role || 'member'],
  )
  res.json({ member: member.rows[0] })
})

app.get('/api/admin/summary', authMiddleware, requireAdmin, async (req, res) => {
  const orgId = organizationFilter(req.query)
  const summary = await pool.query(
    `SELECT
      (SELECT COUNT(*)::int FROM organizations) AS organizations_count,
      (SELECT COUNT(*)::int FROM users WHERE subscription_status = 'pro') AS paid_users_count,
      (SELECT COUNT(*)::int FROM users WHERE subscription_status = 'free') AS free_users_count,
      (SELECT COUNT(*)::int FROM boards) AS overall_boards_count,
      (SELECT COUNT(DISTINCT u.id)::int
       FROM users u
       JOIN organization_members om ON om.user_id = u.id
       WHERE ($1 = '' OR om.organization_id = $1::uuid)) AS users_count,
      (SELECT COUNT(*)::int FROM boards b WHERE ($1 = '' OR b.organization_id = $1::uuid)) AS boards_count,
      (SELECT COUNT(*)::int FROM boards b WHERE b.status = 'scheduled' AND ($1 = '' OR b.organization_id = $1::uuid)) AS scheduled_count,
      (SELECT COUNT(*)::int FROM boards b WHERE b.status = 'delivered' AND ($1 = '' OR b.organization_id = $1::uuid)) AS delivered_count,
      (SELECT COUNT(*)::int FROM deliveries d JOIN boards b ON b.id = d.board_id WHERE ($1 = '' OR b.organization_id = $1::uuid)) AS deliveries_count,
      (SELECT COUNT(*)::int FROM messages m JOIN boards b ON b.id = m.board_id WHERE ($1 = '' OR b.organization_id = $1::uuid)) AS messages_count,
      (SELECT COUNT(*)::int FROM analytics_events e LEFT JOIN boards b ON b.id = e.board_id WHERE ($1 = '' OR b.organization_id = $1::uuid)) AS events_count`,
    [orgId],
  )
  res.json({ summary: summary.rows[0] })
})

app.get('/api/admin/users', authMiddleware, requireAdmin, async (req, res) => {
  const orgId = organizationFilter(req.query)
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  const like = `%${q}%`
  const users = await pool.query(
    `SELECT u.id, u.email, u.auth_provider, u.display_name, u.subscription_status, u.created_at,
            po.organization_id, po.organization_name, po.organization_role,
            COUNT(DISTINCT b.id)::int AS boards_count
     FROM users u
     JOIN organization_members om ON om.user_id = u.id
     JOIN LATERAL (
       SELECT om2.organization_id, o2.name AS organization_name, om2.role AS organization_role
       FROM organization_members om2
       JOIN organizations o2 ON o2.id = om2.organization_id
       WHERE om2.user_id = u.id
       ORDER BY CASE om2.role WHEN 'owner' THEN 1 WHEN 'admin' THEN 2 ELSE 3 END, om2.created_at
       LIMIT 1
     ) po ON true
     LEFT JOIN boards b ON b.owner_id = u.id
     WHERE ($1 = '' OR om.organization_id = $1::uuid)
       AND ($2 = '' OR u.email ILIKE $3 OR u.display_name ILIKE $3)
     GROUP BY u.id, po.organization_id, po.organization_name, po.organization_role
     ORDER BY u.created_at DESC
     LIMIT 200`,
    [orgId, q, like],
  )
  res.json({
    users: users.rows.map((row) => ({
      ...row,
      is_admin: isAdminEmail(row.email),
    })),
  })
})

app.get('/api/admin/boards', authMiddleware, requireAdmin, async (req, res) => {
  const orgId = organizationFilter(req.query)
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  const status = typeof req.query.status === 'string' ? req.query.status.trim() : ''
  const like = `%${q}%`
  const boards = await pool.query(
    `SELECT b.id, b.organization_id, o.name AS organization_name, b.owner_id,
            u.email AS owner_email, u.display_name AS owner_name,
            b.recipient_name, b.occasion, b.theme, b.title, b.status, b.contributor_token,
            b.reveal_token, b.plan_tier, b.scheduled_at, b.destination_type, b.recipient_contact,
            b.created_at, b.updated_at, COUNT(m.id)::int AS message_count,
            d.delivery_state, d.updated_at AS delivery_updated_at
     FROM boards b
     JOIN organizations o ON o.id = b.organization_id
     JOIN users u ON u.id = b.owner_id
     LEFT JOIN messages m ON m.board_id = b.id
     LEFT JOIN deliveries d ON d.board_id = b.id
     WHERE ($1 = '' OR b.organization_id = $1::uuid)
       AND ($2 = '' OR b.status = $2)
       AND ($3 = '' OR b.title ILIKE $4 OR b.recipient_name ILIKE $4 OR u.email ILIKE $4 OR o.name ILIKE $4)
     GROUP BY b.id, o.id, u.id, d.delivery_state, d.updated_at
     ORDER BY b.created_at DESC
     LIMIT 200`,
    [orgId, status, q, like],
  )
  res.json({ boards: boards.rows })
})

app.get('/api/admin/boards/:boardId', authMiddleware, requireAdmin, async (req, res) => {
  const boardId = req.params.boardId
  const board = await pool.query(
    `SELECT b.id, b.organization_id, o.name AS organization_name, b.owner_id,
            u.email AS owner_email, u.display_name AS owner_name,
            u.subscription_status AS owner_plan, b.recipient_name, b.occasion, b.theme, b.title,
            b.status, b.contributor_token, b.reveal_token, b.plan_tier, b.scheduled_at,
            b.destination_type, b.recipient_contact, b.created_at, b.updated_at,
            d.id AS delivery_id, d.delivery_state, d.updated_at AS delivery_updated_at
     FROM boards b
     JOIN organizations o ON o.id = b.organization_id
     JOIN users u ON u.id = b.owner_id
     LEFT JOIN deliveries d ON d.board_id = b.id
     WHERE b.id = $1`,
    [boardId],
  )
  if (!board.rows[0]) {
    res.status(404).json({ error: 'Board not found' })
    return
  }
  const messages = await pool.query(
    `SELECT id, board_id, display_name, text, emoji, gif_url, image_url, sticker, created_at
     FROM messages WHERE board_id = $1 ORDER BY created_at DESC`,
    [boardId],
  )
  const events = await pool.query(
    `SELECT id, event_name, board_id, actor_user_id, meta, created_at
     FROM analytics_events WHERE board_id = $1 ORDER BY created_at DESC LIMIT 100`,
    [boardId],
  )
  res.json({ board: board.rows[0], messages: messages.rows, events: events.rows })
})

app.get('/api/admin/deliveries', authMiddleware, requireAdmin, async (req, res) => {
  const orgId = organizationFilter(req.query)
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  const state = typeof req.query.state === 'string' ? req.query.state.trim() : ''
  const like = `%${q}%`
  const deliveries = await pool.query(
    `SELECT d.id, d.board_id, b.organization_id, o.name AS organization_name,
            b.title, b.status, b.plan_tier, u.email AS owner_email, u.display_name AS owner_name,
            d.scheduled_at, d.destination_type, d.recipient_contact, d.delivery_state, d.updated_at
     FROM deliveries d
     JOIN boards b ON b.id = d.board_id
     JOIN organizations o ON o.id = b.organization_id
     JOIN users u ON u.id = b.owner_id
     WHERE ($1 = '' OR b.organization_id = $1::uuid)
       AND ($2 = '' OR d.delivery_state = $2)
       AND ($3 = '' OR b.title ILIKE $4 OR u.email ILIKE $4 OR d.recipient_contact ILIKE $4 OR o.name ILIKE $4)
     ORDER BY COALESCE(d.scheduled_at, d.updated_at) DESC
     LIMIT 200`,
    [orgId, state, q, like],
  )
  res.json({ deliveries: deliveries.rows })
})

app.get('/api/admin/events', authMiddleware, requireAdmin, async (req, res) => {
  const orgId = organizationFilter(req.query)
  const limit = Math.max(1, Math.min(Number(req.query.limit || 100), 200))
  const events = await pool.query(
    `SELECT e.id, e.event_name, e.board_id, e.actor_user_id, e.meta, e.created_at,
            b.organization_id, o.name AS organization_name
     FROM analytics_events e
     LEFT JOIN boards b ON b.id = e.board_id
     LEFT JOIN organizations o ON o.id = b.organization_id
     WHERE ($1 = '' OR b.organization_id = $1::uuid)
     ORDER BY e.created_at DESC
     LIMIT $2`,
    [orgId, limit],
  )
  res.json({ events: events.rows })
})

app.patch('/api/admin/boards/:boardId', authMiddleware, requireAdmin, async (req, res) => {
  const boardId = req.params.boardId
  const {
    status,
    planTier,
    theme,
    scheduledAt,
    destinationType,
    recipientContact,
    deliveryState,
  } = req.body as {
    status?: 'draft' | 'collecting_messages' | 'scheduled' | 'delivered' | 'archived'
    planTier?: 'free' | 'pro'
    theme?: string
    scheduledAt?: string | null
    destinationType?: 'recipient' | 'creator' | null
    recipientContact?: string | null
    deliveryState?: 'draft' | 'scheduled' | 'delivered'
  }

  if (recipientContact !== undefined && recipientContact !== null && recipientContact.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientContact.trim())) {
    res.status(400).json({ error: 'Invalid recipient email' })
    return
  }
  if (scheduledAt !== undefined && scheduledAt !== null && scheduledAt.trim()) {
    const scheduledDate = new Date(scheduledAt)
    if (Number.isNaN(scheduledDate.getTime())) {
      res.status(400).json({ error: 'Invalid scheduledAt' })
      return
    }
  }

  const updated = await withTx(async (client) => {
    const current = await client.query(
      `SELECT id, status, scheduled_at, destination_type, recipient_contact
       FROM boards WHERE id = $1`,
      [boardId],
    )
    if (!current.rows[0]) {
      return null
    }

    const nextStatus = status || deliveryState || null
    const nextScheduledAt = scheduledAt === undefined || scheduledAt === null || !scheduledAt.trim() ? null : scheduledAt
    const nextDestinationType = destinationType === undefined ? null : destinationType
    const nextRecipientContact = recipientContact === undefined ? null : recipientContact
    const nextDeliveryState = deliveryState || (status && ['draft', 'scheduled', 'delivered'].includes(status) ? status : null)

    const boardResult = await client.query(
      `UPDATE boards
       SET status = COALESCE($1, status),
           plan_tier = COALESCE($2, plan_tier),
           theme = COALESCE($3, theme),
           scheduled_at = COALESCE($4::timestamptz, scheduled_at),
           destination_type = COALESCE($5, destination_type),
           recipient_contact = COALESCE($6, recipient_contact),
           updated_at = NOW()
       WHERE id = $7
       RETURNING id, organization_id, owner_id, recipient_name, occasion, theme, title, status, contributor_token, reveal_token, plan_tier,
                 scheduled_at, destination_type, recipient_contact, created_at, updated_at`,
      [nextStatus, planTier || null, theme || null, nextScheduledAt, nextDestinationType, nextRecipientContact, boardId],
    )

    if (nextScheduledAt !== null || nextDestinationType !== null || nextRecipientContact !== null || nextDeliveryState) {
      await client.query(
        `INSERT INTO deliveries (board_id, scheduled_at, destination_type, recipient_contact, delivery_state, updated_at)
         VALUES ($1, COALESCE($2::timestamptz, (SELECT scheduled_at FROM boards WHERE id = $1)), COALESCE($3, (SELECT destination_type FROM boards WHERE id = $1)), COALESCE($4, (SELECT recipient_contact FROM boards WHERE id = $1)), COALESCE($5, 'draft'), NOW())
         ON CONFLICT (board_id)
         DO UPDATE SET scheduled_at = COALESCE(EXCLUDED.scheduled_at, deliveries.scheduled_at),
                       destination_type = COALESCE(EXCLUDED.destination_type, deliveries.destination_type),
                       recipient_contact = COALESCE(EXCLUDED.recipient_contact, deliveries.recipient_contact),
                       delivery_state = COALESCE(EXCLUDED.delivery_state, deliveries.delivery_state),
                       updated_at = NOW()`,
        [boardId, nextScheduledAt, nextDestinationType, nextRecipientContact, nextDeliveryState],
      )
    }

    return boardResult.rows[0]
  })

  if (!updated) {
    res.status(404).json({ error: 'Board not found' })
    return
  }

  res.json({ board: updated })
})

app.get('/api/boards', authMiddleware, async (req, res) => {
  const user = (req as ReqUser).user
  const boards = await pool.query(
    `SELECT id, organization_id, owner_id, recipient_name, occasion, theme, title, status, contributor_token, reveal_token, plan_tier,
            scheduled_at, destination_type, recipient_contact, created_at
     FROM boards WHERE owner_id = $1 ORDER BY created_at DESC`,
    [user.id],
  )
  res.json({ boards: boards.rows })
})

app.post('/api/boards', authMiddleware, async (req, res) => {
  const user = (req as ReqUser).user
  const { recipientName, occasion, themeId, title, planTier, recipientContact, scheduledAt, destinationType } = req.body as {
    recipientName?: string
    occasion?: 'birthday' | 'farewell' | 'anniversary' | 'other'
    themeId?: string
    title?: string
    planTier?: 'free' | 'pro'
    recipientContact?: string
    scheduledAt?: string
    destinationType?: 'recipient' | 'creator'
  }
  if (!recipientName?.trim() || !occasion || !themeId || !title?.trim()) {
    res.status(400).json({ error: 'Missing board fields' })
    return
  }

  if (!recipientContact?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientContact.trim())) {
    res.status(400).json({ error: 'Invalid recipient email' })
    return
  }
  if (!scheduledAt?.trim()) {
    res.status(400).json({ error: 'scheduledAt is required' })
    return
  }
  const scheduledDate = new Date(scheduledAt)
  if (Number.isNaN(scheduledDate.getTime())) {
    res.status(400).json({ error: 'Invalid scheduledAt' })
    return
  }
  if (scheduledDate.getTime() <= Date.now()) {
    res.status(400).json({ error: 'scheduledAt must be in the future' })
    return
  }

  const dest: 'recipient' | 'creator' = destinationType === 'creator' ? 'creator' : 'recipient'
  const organizationId = await primaryOrganizationId(user.id)

  const inserted = await withTx(async (client) => {
    const boardResult = await client.query(
      `INSERT INTO boards
        (organization_id, owner_id, recipient_name, occasion, theme, title, status, contributor_token, reveal_token, plan_tier, scheduled_at, destination_type, recipient_contact)
       VALUES ($1, $2, $3, $4, $5, $6, 'scheduled', encode(gen_random_bytes(16), 'hex'), encode(gen_random_bytes(16), 'hex'), $7, $8, $9, $10)
       RETURNING id, organization_id, owner_id, recipient_name, occasion, theme, title, status, contributor_token, reveal_token, plan_tier,
                 scheduled_at, destination_type, recipient_contact, created_at`,
      [organizationId, user.id, recipientName.trim(), occasion, themeId, title.trim(), planTier === 'pro' ? 'pro' : 'free', scheduledDate.toISOString(), dest, recipientContact.trim()],
    )

    const boardRow = boardResult.rows[0]
    await client.query(
      `INSERT INTO deliveries (board_id, scheduled_at, destination_type, recipient_contact, delivery_state, updated_at)
       VALUES ($1, $2, $3, $4, 'scheduled', NOW())
       ON CONFLICT (board_id)
       DO UPDATE SET scheduled_at = EXCLUDED.scheduled_at,
                     destination_type = EXCLUDED.destination_type,
                     recipient_contact = EXCLUDED.recipient_contact,
                     delivery_state = 'scheduled',
                     updated_at = NOW()`,
      [boardRow.id, scheduledDate.toISOString(), dest, recipientContact.trim()],
    )
    return boardRow
  })

  await trackEvent('board_created', inserted.id, user.id, { occasion })
  res.json({ board: inserted })
})

app.get('/api/boards/:boardId', authMiddleware, async (req, res) => {
  const user = (req as ReqUser).user
  const boardId = req.params.boardId
  const board = await fetchOwnedBoard(boardId, user.id)
  if (!board) {
    res.status(404).json({ error: 'Board not found' })
    return
  }

  const messages = await pool.query(
    `SELECT id, board_id, display_name, text, emoji, gif_url, image_url, sticker, created_at
     FROM messages WHERE board_id = $1 ORDER BY created_at DESC`,
    [boardId],
  )
  res.json({ board, messages: messages.rows })
})

app.patch('/api/boards/:boardId', authMiddleware, async (req, res) => {
  const user = (req as ReqUser).user
  const boardId = req.params.boardId
  const current = await fetchOwnedBoard(boardId, user.id)
  if (!current) {
    res.status(404).json({ error: 'Board not found' })
    return
  }

  const { scheduledAt, destinationType, recipientContact, status, theme } = req.body as {
    scheduledAt?: string
    destinationType?: 'recipient' | 'creator'
    recipientContact?: string
    status?: 'draft' | 'collecting_messages' | 'scheduled' | 'delivered' | 'archived'
    theme?: string
  }

  const updated = await withTx(async (client) => {
    const boardResult = await client.query(
      `UPDATE boards
       SET scheduled_at = COALESCE($1::timestamptz, scheduled_at),
           destination_type = COALESCE($2, destination_type),
           recipient_contact = COALESCE($3, recipient_contact),
           status = COALESCE($4, status),
           theme = COALESCE($7, theme),
           updated_at = NOW()
       WHERE id = $5 AND owner_id = $6
       RETURNING id, organization_id, owner_id, recipient_name, occasion, theme, title, status, contributor_token, reveal_token, plan_tier,
                 scheduled_at, destination_type, recipient_contact, created_at`,
      [scheduledAt || null, destinationType || null, recipientContact || null, status || null, boardId, user.id, theme || null],
    )
    if (status === 'scheduled' || scheduledAt) {
      await client.query(
        `INSERT INTO deliveries (board_id, scheduled_at, destination_type, recipient_contact, delivery_state, updated_at)
         VALUES ($1, $2, $3, $4, 'scheduled', NOW())
         ON CONFLICT (board_id)
         DO UPDATE SET scheduled_at = EXCLUDED.scheduled_at,
                       destination_type = EXCLUDED.destination_type,
                       recipient_contact = EXCLUDED.recipient_contact,
                       delivery_state = 'scheduled',
                       updated_at = NOW()`,
        [boardId, scheduledAt || null, destinationType || null, recipientContact || null],
      )
    }
    return boardResult.rows[0]
  })

  res.json({ board: updated })
})

app.delete('/api/boards/:boardId', authMiddleware, async (req, res) => {
  const user = (req as ReqUser).user
  const boardId = req.params.boardId
  const deleted = await pool.query('DELETE FROM boards WHERE id = $1 AND owner_id = $2 RETURNING id', [boardId, user.id])
  if (!deleted.rows[0]) {
    res.status(404).json({ error: 'Board not found' })
    return
  }
  res.json({ ok: true })
})

app.post('/api/boards/:boardId/messages', authMiddleware, async (req, res) => {
  const user = (req as ReqUser).user
  const boardId = req.params.boardId
  const board = await fetchOwnedBoard(boardId, user.id)
  if (!board) {
    res.status(404).json({ error: 'Board not found' })
    return
  }
  if (board.status === 'delivered' || board.status === 'archived') {
    res.status(409).json({ error: 'Board is read-only' })
    return
  }
  const message = await insertMessage(boardId, req.body)
  await trackEvent('message_added', boardId, user.id, { from: 'creator' })
  res.json({ message })
})

app.get('/api/public/boards/:boardId/:token', async (req, res) => {
  const { boardId, token } = req.params
  const board = await pool.query(
    `SELECT id, recipient_name, occasion, theme, title, status, contributor_token
     FROM boards WHERE id = $1`,
    [boardId],
  )
  if (!board.rows[0] || board.rows[0].contributor_token !== token) {
    res.status(404).json({ error: 'Board not found' })
    return
  }
  const messages = await pool.query(
    `SELECT id, board_id, display_name, text, emoji, gif_url, image_url, sticker, created_at
     FROM messages WHERE board_id = $1 ORDER BY created_at DESC`,
    [boardId],
  )
  res.json({ board: board.rows[0], messages: messages.rows })
})

app.post('/api/public/boards/:boardId/:token/messages', async (req, res) => {
  const { boardId, token } = req.params
  const board = await pool.query(
    'SELECT id, status, contributor_token FROM boards WHERE id = $1',
    [boardId],
  )
  if (!board.rows[0] || board.rows[0].contributor_token !== token) {
    res.status(404).json({ error: 'Board not found' })
    return
  }
  if (board.rows[0].status === 'delivered' || board.rows[0].status === 'archived') {
    res.status(409).json({ error: 'Board is read-only' })
    return
  }

  const message = await insertMessage(boardId, req.body)
  await trackEvent('message_added', boardId, null, { from: 'contributor' })
  res.json({ message })
})

app.get('/api/reveal/:boardId/:token', async (req, res) => {
  const { boardId, token } = req.params
  const board = await pool.query(
    `SELECT id, recipient_name, occasion, theme, title, status, reveal_token
     FROM boards WHERE id = $1`,
    [boardId],
  )
  if (!board.rows[0] || board.rows[0].reveal_token !== token) {
    res.status(404).json({ error: 'Reveal not found' })
    return
  }
  const messages = await pool.query(
    `SELECT id, board_id, display_name, text, emoji, gif_url, image_url, sticker, created_at
     FROM messages WHERE board_id = $1 ORDER BY created_at DESC`,
    [boardId],
  )
  await trackEvent('reveal_opened', boardId, null, {})
  res.json({ board: board.rows[0], messages: messages.rows })
})

async function fetchOwnedBoard(boardId: string, ownerId: string) {
  const result = await pool.query(
    `SELECT id, organization_id, owner_id, recipient_name, occasion, theme, title, status, contributor_token, reveal_token, plan_tier,
            scheduled_at, destination_type, recipient_contact, created_at
     FROM boards WHERE id = $1 AND owner_id = $2`,
    [boardId, ownerId],
  )
  return result.rows[0]
}

async function insertMessage(
  boardId: string,
  body: {
    displayName?: string
    text?: string
    emoji?: string
    gifUrl?: string
    imageUrl?: string
    sticker?: string
  },
) {
  if (!body.text?.trim()) {
    throw new Error('Message text is required')
  }
  const inserted = await pool.query(
    `INSERT INTO messages (board_id, display_name, text, emoji, gif_url, image_url, sticker)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, board_id, display_name, text, emoji, gif_url, image_url, sticker, created_at`,
    [boardId, body.displayName || null, body.text.trim(), body.emoji || null, body.gifUrl || null, body.imageUrl || null, body.sticker || null],
  )
  return inserted.rows[0]
}

async function trackEvent(eventName: string, boardId: string | null, actorUserId: string | null, meta: Record<string, unknown>) {
  await pool.query(
    `INSERT INTO analytics_events (event_name, board_id, actor_user_id, meta)
     VALUES ($1, $2, $3, $4::jsonb)`,
    [eventName, boardId, actorUserId, JSON.stringify(meta || {})],
  )
}

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' })
  } else {
    res.status(500).json({ error: err.message || 'Internal server error' })
  }
})

async function processDeliveries() {
  try {
    const toDeliver = await pool.query(`
      SELECT board_id 
      FROM deliveries 
      WHERE delivery_state = 'scheduled' AND scheduled_at <= NOW()
    `)
    
    for (const row of toDeliver.rows) {
      await withTx(async (client) => {
        await client.query(`UPDATE deliveries SET delivery_state = 'delivered', updated_at = NOW() WHERE board_id = $1`, [row.board_id])
        await client.query(`UPDATE boards SET status = 'delivered', updated_at = NOW() WHERE id = $1`, [row.board_id])
      })
      console.log(`[Delivery] Board ${row.board_id} delivered at ${new Date().toISOString()}`)
    }
  } catch (err) {
    console.error('Error processing deliveries:', err)
  }
}

setInterval(processDeliveries, 15000)
processDeliveries()

// Seed test user for test mode
async function seedTestUsers() {
  try {
    const adminHash = await bcrypt.hash('Admin@12345', 10)
    const userHash = await bcrypt.hash('User@12345', 10)

    await pool.query(
      `INSERT INTO organizations (id, name, slug, status, plan_tier)
       VALUES
       ($1, 'KairaBoard Internal', 'kairaboard-internal', 'active', 'pro'),
       ($2, 'Demo Customer', 'demo-customer', 'active', 'free'),
       ($3, 'Default Customer', 'default-customer', 'active', 'free')
       ON CONFLICT (id) DO UPDATE
       SET name = EXCLUDED.name,
           slug = EXCLUDED.slug,
           status = EXCLUDED.status,
           plan_tier = EXCLUDED.plan_tier,
           updated_at = NOW()`,
      [INTERNAL_ORG_ID, DEMO_ORG_ID, DEFAULT_ORG_ID],
    )

    await pool.query(
      `INSERT INTO users (id, email, auth_provider, display_name, password_hash, subscription_status)
       VALUES 
       ('00000000-0000-0000-0000-000000000001', 'admin@kairaboard.dev', 'email', 'Admin User', $1, 'pro'),
       ('00000000-0000-0000-0000-000000000002', 'user@kairaboard.dev', 'email', 'General User', $2, 'free')
       ON CONFLICT (id) DO UPDATE
       SET email = EXCLUDED.email,
           auth_provider = EXCLUDED.auth_provider,
           display_name = EXCLUDED.display_name,
           password_hash = EXCLUDED.password_hash,
           subscription_status = EXCLUDED.subscription_status`,
      [adminHash, userHash],
    )
    await ensureUserOrganization('00000000-0000-0000-0000-000000000001', 'admin@kairaboard.dev', 'admin')
    await ensureUserOrganization('00000000-0000-0000-0000-000000000002', 'user@kairaboard.dev', 'owner')
  } catch (err) {
    console.error('Could not seed test users:', err)
  }
}

seedTestUsers().then(() => {
  app.listen(port, () => {
    console.log(`KairaBoard API listening on http://127.0.0.1:${port}`)
  })
})
