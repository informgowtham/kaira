import type { Board, Message, PlanTier, User } from './types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:4000'
const TOKEN_KEY = 'kairaboard.auth.token'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  token?: string | null
  body?: unknown
}

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string | null) {
  if (!token) localStorage.removeItem(TOKEN_KEY)
  else localStorage.setItem(TOKEN_KEY, token)
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = options.token ?? getStoredToken()
  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(payload.error || `Request failed: ${response.status}`)
  }
  return response.json() as Promise<T>
}

function mapUser(raw: { id: string; email: string; provider: 'google' | 'email'; displayName: string; isAdmin?: boolean }): User {
  return {
    id: raw.id,
    email: raw.email,
    provider: raw.provider,
    displayName: raw.displayName,
    isAdmin: raw.isAdmin ?? false,
  }
}

function mapBoard(raw: any): Board {
  return {
    id: raw.id,
    ownerId: raw.owner_id,
    recipientName: raw.recipient_name,
    occasion: raw.occasion,
    themeId: raw.theme,
    title: raw.title,
    status: raw.status,
    contributorToken: raw.contributor_token,
    revealToken: raw.reveal_token,
    planTier: raw.plan_tier,
    scheduledAt: raw.scheduled_at || undefined,
    destinationType: raw.destination_type || undefined,
    recipientContact: raw.recipient_contact || undefined,
    createdAt: raw.created_at,
  }
}

function mapMessage(raw: any): Message {
  return {
    id: raw.id,
    boardId: raw.board_id,
    displayName: raw.display_name || undefined,
    text: raw.text,
    emoji: raw.emoji || undefined,
    gifUrl: raw.gif_url || undefined,
    imageUrl: raw.image_url || undefined,
    sticker: raw.sticker || undefined,
    createdAt: raw.created_at,
  }
}

export async function loginEmail(input: { email: string; password?: string; displayName?: string; mode: 'login' | 'signup' }) {
  const payload = await request<{
    token: string
    user: { id: string; email: string; provider: 'google' | 'email'; displayName: string; isAdmin: boolean }
    plan: PlanTier
  }>('/api/auth/email', {
    method: 'POST',
    body: input,
  })
  setStoredToken(payload.token)
  return { token: payload.token, user: mapUser(payload.user), plan: payload.plan }
}

export async function loginGoogle(input: { credential?: string }) {
  const payload = await request<{
    token: string
    user: { id: string; email: string; provider: 'google' | 'email'; displayName: string; isAdmin: boolean }
    plan: PlanTier
  }>('/api/auth/google', {
    method: 'POST',
    body: input,
  })
  setStoredToken(payload.token)
  return { token: payload.token, user: mapUser(payload.user), plan: payload.plan }
}

export async function getMe() {
  const payload = await request<{
    user: { id: string; email: string; provider: 'google' | 'email'; displayName: string; isAdmin: boolean }
    plan: PlanTier
  }>('/api/auth/me')
  return { user: mapUser(payload.user), plan: payload.plan }
}

export async function setPlanRemote(plan: PlanTier) {
  const payload = await request<{ plan: PlanTier }>('/api/auth/plan', {
    method: 'PATCH',
    body: { plan },
  })
  return payload.plan
}

export async function listBoards() {
  const payload = await request<{ boards: any[] }>('/api/boards')
  return payload.boards.map(mapBoard)
}

export async function createBoardRemote(input: {
  recipientName: string
  occasion: Board['occasion']
  themeId: string
  title: string
  planTier: PlanTier
  recipientContact: string
  scheduledAt: string
  destinationType?: 'recipient' | 'creator'
}) {
  const payload = await request<{ board: any }>('/api/boards', {
    method: 'POST',
    body: input,
  })
  return mapBoard(payload.board)
}

export async function getBoard(boardId: string) {
  const payload = await request<{ board: any; messages: any[] }>(`/api/boards/${boardId}`)
  return {
    board: mapBoard(payload.board),
    messages: payload.messages.map(mapMessage),
  }
}

export async function patchBoard(boardId: string, patch: Partial<Board>) {
  const payload = await request<{ board: any }>(`/api/boards/${boardId}`, {
    method: 'PATCH',
    body: {
      scheduledAt: patch.scheduledAt,
      destinationType: patch.destinationType,
      recipientContact: patch.recipientContact,
      status: patch.status,
      theme: patch.themeId,
    },
  })
  return mapBoard(payload.board)
}

export async function uploadFile(file: File) {
  const token = getStoredToken()
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(payload.error || `Upload failed: ${response.status}`)
  }
  const payload = await response.json() as { url: string }
  // Provide full URL if not running locally, but relative works if proxying,
  // API_BASE is empty by default unless env var is set. Let's return API_BASE + url
  return `${API_BASE === '/' ? '' : API_BASE}${payload.url}`
}

export async function fetchGifs(query: string) {
  const normalized = query.trim()
  const url = normalized ? `/api/gifs?q=${encodeURIComponent(normalized)}` : '/api/gifs'
  const payload = await request<{ gifs: any[] }>(url)
  return payload.gifs
}

export async function removeBoard(boardId: string) {
  await request<{ ok: boolean }>(`/api/boards/${boardId}`, { method: 'DELETE' })
}

export async function addMessageOwner(boardId: string, message: Omit<Message, 'id' | 'createdAt' | 'boardId'>) {
  const payload = await request<{ message: any }>(`/api/boards/${boardId}/messages`, {
    method: 'POST',
    body: message,
  })
  return mapMessage(payload.message)
}

export async function getPublicBoard(boardId: string, token: string) {
  const payload = await request<{ board: any; messages: any[] }>(`/api/public/boards/${boardId}/${token}`)
  return {
    board: mapBoard(payload.board),
    messages: payload.messages.map(mapMessage),
  }
}

export async function addPublicMessage(
  boardId: string,
  token: string,
  message: Omit<Message, 'id' | 'createdAt' | 'boardId'>,
) {
  const payload = await request<{ message: any }>(`/api/public/boards/${boardId}/${token}/messages`, {
    method: 'POST',
    body: message,
  })
  return mapMessage(payload.message)
}

export async function getReveal(boardId: string, token: string) {
  const payload = await request<{ board: any; messages: any[] }>(`/api/reveal/${boardId}/${token}`)
  return {
    board: mapBoard(payload.board),
    messages: payload.messages.map(mapMessage),
  }
}

export type AdminSummary = {
  organizations_count: number
  paid_users_count: number
  free_users_count: number
  overall_boards_count: number
  users_count: number
  boards_count: number
  scheduled_count: number
  delivered_count: number
  deliveries_count: number
  messages_count: number
  events_count: number
}

export type AdminOrganizationRow = {
  id: string
  name: string
  slug: string
  status: 'active' | 'paused' | 'archived'
  plan_tier: PlanTier
  created_at: string
  updated_at: string
  users_count: number
  boards_count: number
  last_activity_at?: string | null
}

export type AdminUserRow = {
  id: string
  email: string
  auth_provider: 'google' | 'email'
  display_name: string
  subscription_status: PlanTier
  organization_id?: string
  organization_name?: string
  organization_role?: 'owner' | 'admin' | 'member'
  created_at: string
  boards_count: number
  is_admin: boolean
}

export type AdminBoardRow = {
  id: string
  organization_id: string
  organization_name: string
  owner_id: string
  owner_email: string
  owner_name: string
  recipient_name: string
  occasion: Board['occasion']
  theme: string
  title: string
  status: Board['status']
  contributor_token: string
  reveal_token: string
  plan_tier: PlanTier
  scheduled_at?: string | null
  destination_type?: 'recipient' | 'creator' | null
  recipient_contact?: string | null
  created_at: string
  updated_at: string
  message_count: number
  delivery_state?: 'draft' | 'scheduled' | 'delivered' | null
  delivery_updated_at?: string | null
}

export type AdminDeliveryRow = {
  id: string
  board_id: string
  organization_id: string
  organization_name: string
  title: string
  status: Board['status']
  plan_tier: PlanTier
  owner_email: string
  owner_name: string
  scheduled_at?: string | null
  destination_type?: 'recipient' | 'creator' | null
  recipient_contact?: string | null
  delivery_state: 'draft' | 'scheduled' | 'delivered'
  updated_at: string
}

export type AdminEventRow = {
  id: string
  event_name: string
  board_id?: string | null
  actor_user_id?: string | null
  organization_id?: string | null
  organization_name?: string | null
  meta: Record<string, unknown>
  created_at: string
}

export type AdminBoardDetail = {
  board: AdminBoardRow & {
    owner_plan: PlanTier
    delivery_id?: string | null
  }
  messages: any[]
  events: AdminEventRow[]
}

function adminQuery(params: Record<string, string | number | undefined | null>) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim()) {
      search.set(key, String(value))
    }
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export async function listAdminOrganizations(q = '') {
  const payload = await request<{ organizations: AdminOrganizationRow[] }>(`/api/admin/organizations${adminQuery({ q })}`)
  return payload.organizations
}

export async function createAdminOrganization(input: { name: string; status?: AdminOrganizationRow['status']; planTier?: PlanTier }) {
  const payload = await request<{ organization: AdminOrganizationRow }>('/api/admin/organizations', {
    method: 'POST',
    body: input,
  })
  return payload.organization
}

export async function patchAdminOrganization(
  organizationId: string,
  patch: Partial<{ name: string; status: AdminOrganizationRow['status']; planTier: PlanTier }>,
) {
  const payload = await request<{ organization: AdminOrganizationRow }>(`/api/admin/organizations/${organizationId}`, {
    method: 'PATCH',
    body: patch,
  })
  return payload.organization
}

export async function assignAdminOrganizationMember(
  organizationId: string,
  input: { userId: string; role?: 'owner' | 'admin' | 'member' },
) {
  return request<{ member: { organization_id: string; user_id: string; role: string; created_at: string } }>(
    `/api/admin/organizations/${organizationId}/members`,
    {
      method: 'POST',
      body: input,
    },
  )
}

export async function getAdminSummary(organizationId = '') {
  const payload = await request<{ summary: AdminSummary }>(`/api/admin/summary${adminQuery({ organizationId })}`)
  return payload.summary
}

export async function listAdminUsers(input: { q?: string; organizationId?: string } = {}) {
  const payload = await request<{ users: AdminUserRow[] }>(`/api/admin/users${adminQuery(input)}`)
  return payload.users
}

export async function listAdminBoards(input: { q?: string; organizationId?: string; status?: string } = {}) {
  const payload = await request<{ boards: AdminBoardRow[] }>(`/api/admin/boards${adminQuery(input)}`)
  return payload.boards
}

export async function getAdminBoard(boardId: string) {
  const payload = await request<AdminBoardDetail>(`/api/admin/boards/${boardId}`)
  return payload
}

export async function patchAdminBoard(
  boardId: string,
  patch: Partial<{
    status: Board['status']
    planTier: PlanTier
    theme: string
    scheduledAt: string | null
    destinationType: 'recipient' | 'creator' | null
    recipientContact: string | null
    deliveryState: 'draft' | 'scheduled' | 'delivered'
  }>,
) {
  const payload = await request<{ board: AdminBoardRow }>(`/api/admin/boards/${boardId}`, {
    method: 'PATCH',
    body: patch,
  })
  return payload.board
}

export async function listAdminDeliveries(input: { q?: string; organizationId?: string; state?: string } = {}) {
  const payload = await request<{ deliveries: AdminDeliveryRow[] }>(`/api/admin/deliveries${adminQuery(input)}`)
  return payload.deliveries
}

export async function listAdminEvents(input: { limit?: number; organizationId?: string } = {}) {
  const payload = await request<{ events: AdminEventRow[] }>(`/api/admin/events${adminQuery({ limit: input.limit ?? 100, organizationId: input.organizationId })}`)
  return payload.events
}
