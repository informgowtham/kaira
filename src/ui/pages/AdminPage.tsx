import { useEffect, useMemo, useState } from 'react'
import type { ReactNode, SelectHTMLAttributes } from 'react'
import { useSEO } from '../utils/seo'
import { TopBar } from '../components/TopBar'
import { Surface } from '../components/Surface'
import { Button } from '../components/Button'
import {
  createAdminOrganization,
  getAdminBoard,
  getAdminSummary,
  listAdminBoards,
  listAdminDeliveries,
  listAdminEvents,
  listAdminOrganizations,
  listAdminUsers,
  patchAdminBoard,
  patchAdminOrganization,
  type AdminBoardDetail,
  type AdminBoardRow,
  type AdminDeliveryRow,
  type AdminEventRow,
  type AdminOrganizationRow,
  type AdminSummary,
  type AdminUserRow,
} from '../store/api'
import { useAppStore } from '../store/useAppStore'
import {
  Building2,
  CalendarClock,
  ChartColumn,
  CircleDot,
  LayoutGrid,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from 'lucide-react'

type TabKey = 'overview' | 'organizations' | 'users' | 'boards' | 'deliveries' | 'analytics'
type BoardStatusFilter = '' | AdminBoardRow['status']
type DeliveryStateFilter = '' | NonNullable<AdminDeliveryRow['delivery_state']>
type BoardFormState = {
  status: '' | AdminBoardRow['status']
  planTier: '' | AdminBoardRow['plan_tier']
  theme: string
  scheduledAt: string
  destinationType: '' | NonNullable<AdminBoardRow['destination_type']>
  recipientContact: string
  deliveryState: '' | NonNullable<AdminBoardRow['delivery_state']>
}

const TABS: { id: TabKey; label: string; icon: ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <ChartColumn size={16} /> },
  { id: 'organizations', label: 'Organizations', icon: <Building2 size={16} /> },
  { id: 'users', label: 'Users', icon: <Users size={16} /> },
  { id: 'boards', label: 'Boards', icon: <LayoutGrid size={16} /> },
  { id: 'deliveries', label: 'Deliveries', icon: <CalendarClock size={16} /> },
  { id: 'analytics', label: 'Analytics', icon: <CircleDot size={16} /> },
]

function formatDateTime(value?: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function toInputDateTime(value?: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return `${local.getFullYear()}-${pad(local.getMonth() + 1)}-${pad(local.getDate())}T${pad(local.getHours())}:${pad(local.getMinutes())}`
}

function adminCount(count: number | undefined) {
  return typeof count === 'number' ? count.toLocaleString() : '0'
}

function pillClass(tone: 'green' | 'gold' | 'blue' | 'muted' | 'rose') {
  const tones = {
    green: 'border-emerald-300/20 bg-emerald-400/12 text-emerald-100',
    gold: 'border-amber-300/25 bg-amber-300/15 text-amber-100',
    blue: 'border-sky-300/20 bg-sky-400/12 text-sky-100',
    muted: 'border-white/10 bg-white/8 text-white/70',
    rose: 'border-rose-300/20 bg-rose-400/12 text-rose-100',
  }
  return `inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-medium ${tones[tone]}`
}

function statusTone(value?: string | null): 'green' | 'gold' | 'blue' | 'muted' | 'rose' {
  if (value === 'active' || value === 'delivered' || value === 'pro') return 'green'
  if (value === 'scheduled') return 'gold'
  if (value === 'collecting_messages') return 'blue'
  if (value === 'paused' || value === 'archived') return 'rose'
  return 'muted'
}

export function AdminPage() {
  const user = useAppStore((s) => s.user)!
  useSEO('Admin Panel', 'Internal admin operations')

  const [tab, setTab] = useState<TabKey>('overview')
  const [organizations, setOrganizations] = useState<AdminOrganizationRow[]>([])
  const [selectedOrganizationId, setSelectedOrganizationId] = useState('')
  const [summary, setSummary] = useState<AdminSummary | null>(null)
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [boards, setBoards] = useState<AdminBoardRow[]>([])
  const [deliveries, setDeliveries] = useState<AdminDeliveryRow[]>([])
  const [events, setEvents] = useState<AdminEventRow[]>([])
  const [selectedBoardId, setSelectedBoardId] = useState('')
  const [boardDetail, setBoardDetail] = useState<AdminBoardDetail | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [organizationQuery, setOrganizationQuery] = useState('')
  const [userQuery, setUserQuery] = useState('')
  const [boardQuery, setBoardQuery] = useState('')
  const [deliveryQuery, setDeliveryQuery] = useState('')
  const [boardStatus, setBoardStatus] = useState<BoardStatusFilter>('')
  const [deliveryState, setDeliveryState] = useState<DeliveryStateFilter>('')
  const [newOrganizationName, setNewOrganizationName] = useState('')

  const [boardForm, setBoardForm] = useState<BoardFormState>({
    status: '',
    planTier: '',
    theme: '',
    scheduledAt: '',
    destinationType: '',
    recipientContact: '',
    deliveryState: '',
  })

  const selectedOrganization = useMemo(
    () => organizations.find((org) => org.id === selectedOrganizationId) || null,
    [organizations, selectedOrganizationId],
  )
  const selectedBoard = boardDetail?.board ?? null

  const scopedParams = useMemo(() => ({ organizationId: selectedOrganizationId }), [selectedOrganizationId])

  async function loadOrganizations() {
    const rows = await listAdminOrganizations(organizationQuery)
    setOrganizations(rows)
    return rows
  }

  async function loadAdminData() {
    setLoading(true)
    setError(null)
    try {
      const orgRows = await loadOrganizations()
      const [summaryData, usersData, boardsData, deliveriesData, eventsData] = await Promise.all([
        getAdminSummary(selectedOrganizationId),
        listAdminUsers({ ...scopedParams, q: userQuery }),
        listAdminBoards({ ...scopedParams, q: boardQuery, status: boardStatus }),
        listAdminDeliveries({ ...scopedParams, q: deliveryQuery, state: deliveryState }),
        listAdminEvents({ ...scopedParams, limit: 100 }),
      ])
      setSummary(summaryData)
      setUsers(usersData)
      setBoards(boardsData)
      setDeliveries(deliveriesData)
      setEvents(eventsData)
      const selectedStillVisible = boardsData.some((board) => board.id === selectedBoardId)
      if (!selectedStillVisible && boardsData[0]) {
        await loadBoardDetail(boardsData[0].id)
      } else if (!boardsData.length) {
        setSelectedBoardId('')
        setBoardDetail(null)
      }
      if (selectedOrganizationId && !orgRows.some((org) => org.id === selectedOrganizationId)) {
        setSelectedOrganizationId('')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  async function loadBoardDetail(boardId: string) {
    setSelectedBoardId(boardId)
    setError(null)
    try {
      const detail = await getAdminBoard(boardId)
      setBoardDetail(detail)
      setBoardForm({
        status: detail.board.status,
        planTier: detail.board.plan_tier,
        theme: detail.board.theme,
        scheduledAt: toInputDateTime(detail.board.scheduled_at),
        destinationType: (detail.board.destination_type || '') as '' | 'recipient' | 'creator',
        recipientContact: detail.board.recipient_contact || '',
        deliveryState: (detail.board.delivery_state || '') as '' | 'draft' | 'scheduled' | 'delivered',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load board details')
    }
  }

  async function saveBoard() {
    if (!selectedBoardId) return
    setSaving(true)
    setError(null)
    try {
      const updated = await patchAdminBoard(selectedBoardId, {
        status: boardForm.status || undefined,
        planTier: boardForm.planTier || undefined,
        theme: boardForm.theme || undefined,
        scheduledAt: boardForm.scheduledAt ? new Date(boardForm.scheduledAt).toISOString() : null,
        destinationType: boardForm.destinationType || null,
        recipientContact: boardForm.recipientContact || null,
        deliveryState: boardForm.deliveryState || undefined,
      })
      setBoards((current) => current.map((board) => (board.id === updated.id ? { ...board, ...updated } : board)))
      await loadBoardDetail(updated.id)
      await loadAdminData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save board')
    } finally {
      setSaving(false)
    }
  }

  async function createOrganization() {
    if (!newOrganizationName.trim()) return
    setSaving(true)
    setError(null)
    try {
      const organization = await createAdminOrganization({ name: newOrganizationName.trim(), planTier: 'free', status: 'active' })
      setNewOrganizationName('')
      setSelectedOrganizationId(organization.id)
      await loadAdminData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create organization')
    } finally {
      setSaving(false)
    }
  }

  async function updateOrganizationPlan(organizationId: string, planTier: AdminOrganizationRow['plan_tier']) {
    setSaving(true)
    setError(null)
    try {
      const updated = await patchAdminOrganization(organizationId, { planTier })
      setOrganizations((current) => current.map((org) => (org.id === updated.id ? { ...org, ...updated } : org)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update organization')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    void loadAdminData()
  }, [selectedOrganizationId, userQuery, boardQuery, deliveryQuery, boardStatus, deliveryState])

  useEffect(() => {
    if (tab === 'organizations') {
      void loadOrganizations().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load organizations'))
    }
  }, [organizationQuery, tab])

  return (
    <div className="min-h-screen kb-grid kb-page">
      <TopBar />
      <div className="mx-auto w-full max-w-[1500px] px-4 pt-8 pb-12">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/70">
              <ShieldCheck size={14} />
              Admin console
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Enterprise operations</h1>
            <p className="mt-1 text-sm text-white/60">
              Manage customers, boards, deliveries, and activity from one organization-aware workspace.
            </p>
            <p className="mt-2 text-xs text-white/45">
              Signed in as <span className="text-white/70">{user.email}</span>
            </p>
          </div>
          <Button variant="secondary" left={<RefreshCw size={16} />} onClick={() => void loadAdminData()} disabled={loading}>
            Refresh
          </Button>
        </div>

        <div className="mt-6 grid gap-4">
          <Surface className="p-4">
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/45">
              <ChartColumn size={14} />
              Overall view
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Metric icon={<Building2 size={16} />} label="Organizations" value={adminCount(summary?.organizations_count)} compact />
              <Metric icon={<Users size={16} />} label="Paid users" value={adminCount(summary?.paid_users_count)} compact />
              <Metric icon={<Users size={16} />} label="Free users" value={adminCount(summary?.free_users_count)} compact />
              <Metric icon={<LayoutGrid size={16} />} label="Boards created" value={adminCount(summary?.overall_boards_count)} compact />
            </div>
          </Surface>

          <Surface className="p-4">
            <div className="grid gap-3 lg:grid-cols-[minmax(240px,360px)_minmax(0,1fr)] lg:items-end">
            <Field label="Organization">
              <Select value={selectedOrganizationId} onValueChange={setSelectedOrganizationId}>
                <option value="">All organizations</option>
                {organizations.map((organization) => (
                  <option key={organization.id} value={organization.id}>
                    {organization.name}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              <Metric icon={<Building2 size={16} />} label="Scope" value={selectedOrganization ? selectedOrganization.name : 'All'} compact />
              <Metric icon={<Users size={16} />} label="Users" value={adminCount(summary?.users_count)} compact />
              <Metric icon={<LayoutGrid size={16} />} label="Boards" value={adminCount(summary?.boards_count)} compact />
              <Metric icon={<CalendarClock size={16} />} label="Scheduled" value={adminCount(summary?.scheduled_count)} compact />
              <Metric icon={<ChartColumn size={16} />} label="Events" value={adminCount(summary?.events_count)} compact />
            </div>
          </div>
          </Surface>
        </div>

        {error ? <div className="mt-4 rounded-xl border border-rose-300/20 bg-rose-500/15 px-4 py-3 text-sm text-rose-100">{error}</div> : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-[230px_minmax(0,1fr)]">
          <Surface className="h-fit p-3">
            <div className="px-2 py-1 text-xs uppercase tracking-[0.18em] text-white/45">Sections</div>
            <div className="mt-2 grid gap-1">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  className={`kb-ring flex items-center gap-2 rounded-lg border px-3 py-3 text-left text-sm transition ${
                    tab === item.id ? 'border-white/20 bg-white/10 text-white' : 'border-transparent text-white/70 hover:bg-white/8'
                  }`}
                  onClick={() => setTab(item.id)}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </Surface>

          <div className="grid gap-4">
            {tab === 'overview' ? (
              <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_420px]">
                <div className="grid gap-4 xl:grid-cols-2">
                  <Surface className="p-5">
                    <PanelHeader title="Recent organizations" count={organizations.length} />
                    <OrganizationCards
                      organizations={organizations.slice(0, 6)}
                      onSelect={(id) => {
                        setSelectedOrganizationId(id)
                        setTab('organizations')
                      }}
                    />
                  </Surface>
                  <Surface className="p-5">
                    <PanelHeader title="Recent boards" count={boards.length} />
                    <DataTable
                      columns={[
                        { key: 'title', label: 'Board', width: 'minmax(220px,1.6fr)' },
                        { key: 'owner', label: 'Owner', width: 'minmax(220px,1.2fr)' },
                        { key: 'status', label: 'Status', width: '140px' },
                        { key: 'delivery', label: 'Delivery', width: '140px' },
                      ]}
                      rows={boards.slice(0, 8).map((row) => ({
                        id: row.id,
                        cells: {
                          title: <StackedCell title={row.title} detail={row.organization_name} />,
                          owner: <StackedCell title={row.owner_email} detail={row.owner_name} />,
                          status: <StatusPill value={row.status} />,
                          delivery: <StatusPill value={row.delivery_state || '-'} />,
                        },
                      }))}
                      onRowClick={(id) => {
                        void loadBoardDetail(id)
                        setTab('boards')
                      }}
                    />
                  </Surface>
                  <Surface className="p-5">
                    <PanelHeader title="Users" count={users.length} />
                    <DataTable
                      columns={[
                        { key: 'name', label: 'Name', width: 'minmax(180px,1fr)' },
                        { key: 'email', label: 'Email', width: 'minmax(260px,1.4fr)' },
                        { key: 'plan', label: 'Plan', width: '110px' },
                        { key: 'boards', label: 'Boards', width: '90px' },
                      ]}
                      rows={users.slice(0, 8).map((row) => ({
                        id: row.id,
                        cells: {
                          name: <StackedCell title={row.display_name} detail={row.organization_name || 'No organization'} />,
                          email: row.email,
                          plan: <StatusPill value={row.subscription_status} />,
                          boards: String(row.boards_count),
                        },
                      }))}
                    />
                  </Surface>
                  <Surface className="p-5">
                    <PanelHeader title="Recent activity" count={events.length} />
                    <DataTable
                      columns={[
                        { key: 'event', label: 'Event', width: 'minmax(180px,1fr)' },
                        { key: 'org', label: 'Organization', width: 'minmax(180px,1fr)' },
                        { key: 'created', label: 'Created', width: '180px' },
                      ]}
                      rows={events.slice(0, 8).map((row) => ({
                        id: row.id,
                        cells: {
                          event: row.event_name,
                          org: row.organization_name || '-',
                          created: formatDateTime(row.created_at),
                        },
                      }))}
                    />
                  </Surface>
                </div>
                <BoardDetailPanel
                  boardDetail={boardDetail}
                  selectedBoard={selectedBoard}
                  boardForm={boardForm}
                  saving={saving}
                  onFormChange={setBoardForm}
                  onSave={() => void saveBoard()}
                  onReload={() => selectedBoardId && void loadBoardDetail(selectedBoardId)}
                />
              </div>
            ) : null}

            {tab === 'organizations' ? (
              <Surface className="p-5">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <PanelHeader title="Organizations" count={organizations.length} />
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <SearchBox value={organizationQuery} onChange={setOrganizationQuery} placeholder="Search organization" />
                    <div className="flex min-w-[280px] gap-2">
                      <input
                        className="kb-ring min-w-0 flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/35"
                        placeholder="New customer name"
                        value={newOrganizationName}
                        onChange={(event) => setNewOrganizationName(event.target.value)}
                      />
                      <Button variant="primary" onClick={() => void createOrganization()} disabled={saving || !newOrganizationName.trim()}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
                <OrganizationCards
                  organizations={organizations}
                  selectedId={selectedOrganizationId}
                  onSelect={setSelectedOrganizationId}
                  onPlanChange={(id, plan) => void updateOrganizationPlan(id, plan)}
                />
              </Surface>
            ) : null}

            {tab === 'users' ? (
              <Surface className="p-5">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <PanelHeader title="Users" count={users.length} />
                  <SearchBox value={userQuery} onChange={setUserQuery} placeholder="Search email or name" />
                </div>
                <DataTable
                  columns={[
                    { key: 'name', label: 'Name', width: 'minmax(190px,1fr)' },
                    { key: 'email', label: 'Email', width: 'minmax(280px,1.4fr)' },
                    { key: 'org', label: 'Organization', width: 'minmax(220px,1fr)' },
                    { key: 'role', label: 'Role', width: '120px' },
                    { key: 'plan', label: 'Plan', width: '110px' },
                    { key: 'boards', label: 'Boards', width: '90px' },
                  ]}
                  rows={users.map((row) => ({
                    id: row.id,
                    cells: {
                      name: row.display_name,
                      email: row.email,
                      org: row.organization_name || '-',
                      role: row.organization_role || '-',
                      plan: <StatusPill value={row.subscription_status} />,
                      boards: String(row.boards_count),
                    },
                  }))}
                />
              </Surface>
            ) : null}

            {tab === 'boards' ? (
              <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.45fr)_minmax(420px,0.85fr)]">
                <Surface className="p-5">
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <PanelHeader title="Boards" count={boards.length} />
                    <FilterBar>
                      <SearchBox value={boardQuery} onChange={setBoardQuery} placeholder="Search boards or owners" />
                      <Select value={boardStatus} onValueChange={(value) => setBoardStatus(value as BoardStatusFilter)}>
                        <option value="">All statuses</option>
                        <option value="draft">Draft</option>
                        <option value="collecting_messages">Collecting</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="delivered">Delivered</option>
                        <option value="archived">Archived</option>
                      </Select>
                    </FilterBar>
                  </div>
                  <DataTable
                    columns={[
                      { key: 'title', label: 'Board', width: 'minmax(260px,1.7fr)' },
                      { key: 'owner', label: 'Owner', width: 'minmax(250px,1.2fr)' },
                      { key: 'org', label: 'Organization', width: 'minmax(200px,1fr)' },
                      { key: 'status', label: 'Status', width: '145px' },
                      { key: 'delivery', label: 'Delivery', width: '145px' },
                      { key: 'messages', label: 'Messages', width: '100px' },
                    ]}
                    rows={boards.map((row) => ({
                      id: row.id,
                      active: row.id === selectedBoardId,
                      cells: {
                        title: <StackedCell title={row.title} detail={`Recipient: ${row.recipient_name}`} />,
                        owner: <StackedCell title={row.owner_email} detail={row.owner_name} />,
                        org: row.organization_name,
                        status: <StatusPill value={row.status} />,
                        delivery: <StatusPill value={row.delivery_state || '-'} />,
                        messages: String(row.message_count),
                      },
                    }))}
                    onRowClick={(id) => void loadBoardDetail(id)}
                  />
                </Surface>
                <BoardDetailPanel
                  boardDetail={boardDetail}
                  selectedBoard={selectedBoard}
                  boardForm={boardForm}
                  saving={saving}
                  onFormChange={setBoardForm}
                  onSave={() => void saveBoard()}
                  onReload={() => selectedBoardId && void loadBoardDetail(selectedBoardId)}
                />
              </div>
            ) : null}

            {tab === 'deliveries' ? (
              <Surface className="p-5">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <PanelHeader title="Deliveries" count={deliveries.length} />
                  <FilterBar>
                    <SearchBox value={deliveryQuery} onChange={setDeliveryQuery} placeholder="Search board or contact" />
                    <Select value={deliveryState} onValueChange={(value) => setDeliveryState(value as DeliveryStateFilter)}>
                      <option value="">All states</option>
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="delivered">Delivered</option>
                    </Select>
                  </FilterBar>
                </div>
                <DataTable
                  columns={[
                    { key: 'board', label: 'Board', width: 'minmax(260px,1.5fr)' },
                    { key: 'owner', label: 'Owner', width: 'minmax(240px,1.2fr)' },
                    { key: 'org', label: 'Organization', width: 'minmax(200px,1fr)' },
                    { key: 'scheduled', label: 'Scheduled', width: '190px' },
                    { key: 'state', label: 'State', width: '130px' },
                    { key: 'contact', label: 'Contact', width: 'minmax(220px,1fr)' },
                  ]}
                  rows={deliveries.map((row) => ({
                    id: row.id,
                    cells: {
                      board: <StackedCell title={row.title} detail={row.status} />,
                      owner: row.owner_email,
                      org: row.organization_name,
                      scheduled: formatDateTime(row.scheduled_at),
                      state: <StatusPill value={row.delivery_state} />,
                      contact: row.recipient_contact || '-',
                    },
                  }))}
                />
              </Surface>
            ) : null}

            {tab === 'analytics' ? (
              <Surface className="p-5">
                <PanelHeader title="Analytics events" count={events.length} />
                <DataTable
                  columns={[
                    { key: 'event', label: 'Event', width: 'minmax(180px,1fr)' },
                    { key: 'org', label: 'Organization', width: 'minmax(220px,1fr)' },
                    { key: 'board', label: 'Board', width: 'minmax(220px,1fr)' },
                    { key: 'actor', label: 'Actor', width: 'minmax(220px,1fr)' },
                    { key: 'created', label: 'Created', width: '190px' },
                  ]}
                  rows={events.map((row) => ({
                    id: row.id,
                    cells: {
                      event: row.event_name,
                      org: row.organization_name || '-',
                      board: row.board_id || '-',
                      actor: row.actor_user_id || '-',
                      created: formatDateTime(row.created_at),
                    },
                  }))}
                />
              </Surface>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function Metric(props: { icon: ReactNode; label: string; value: string; compact?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.16em] text-white/45">{props.label}</div>
          <div className={`${props.compact ? 'text-base' : 'text-2xl'} mt-1 truncate font-semibold text-white`} title={props.value}>
            {props.value}
          </div>
        </div>
        <div className="shrink-0 rounded-lg border border-white/10 bg-white/6 p-2 text-white/70">{props.icon}</div>
      </div>
    </div>
  )
}

function PanelHeader(props: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-sm font-semibold text-white">{props.title}</div>
      <div className="text-xs text-white/55">{props.count.toLocaleString()} items</div>
    </div>
  )
}

function SearchBox(props: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="kb-glass inline-flex min-w-[240px] items-center gap-2 rounded-xl border border-white/10 px-3 py-2">
      <Search size={15} className="shrink-0 text-white/50" />
      <input
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  )
}

function FilterBar(props: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="hidden items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/40 xl:flex">
        <SlidersHorizontal size={14} />
        Filters
      </div>
      {props.children}
    </div>
  )
}

function Select(
  props: Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
    children: ReactNode
    onValueChange: (value: string) => void
  },
) {
  const { className, children, onValueChange, ...rest } = props
  return (
    <select
      {...rest}
      onChange={(e) => onValueChange(e.target.value)}
      className={`kb-ring min-h-[42px] rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white ${className || ''}`}
    >
      {children}
    </select>
  )
}

function Field(props: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <div className="text-xs text-white/60">{props.label}</div>
      {props.children}
    </label>
  )
}

function StatusPill(props: { value?: string | null }) {
  const label = props.value || '-'
  return <span className={pillClass(statusTone(label))}>{label.replace('_', ' ')}</span>
}

function StackedCell(props: { title: string; detail?: string | null }) {
  return (
    <div className="min-w-0">
      <div className="truncate text-white" title={props.title}>
        {props.title}
      </div>
      {props.detail ? (
        <div className="mt-0.5 truncate text-xs text-white/48" title={props.detail}>
          {props.detail}
        </div>
      ) : null}
    </div>
  )
}

function OrganizationCards(props: {
  organizations: AdminOrganizationRow[]
  selectedId?: string
  onSelect?: (id: string) => void
  onPlanChange?: (id: string, plan: AdminOrganizationRow['plan_tier']) => void
}) {
  if (!props.organizations.length) {
    return <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/55">No organizations found.</div>
  }
  return (
    <div className="mt-3 grid gap-3 lg:grid-cols-2">
      {props.organizations.map((organization) => (
        <button
          key={organization.id}
          className={`kb-ring rounded-xl border p-4 text-left transition hover:bg-white/8 ${
            props.selectedId === organization.id ? 'border-amber-200/50 bg-amber-200/10' : 'border-white/10 bg-black/20'
          }`}
          onClick={() => props.onSelect?.(organization.id)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-white" title={organization.name}>
                {organization.name}
              </div>
              <div className="mt-1 truncate text-xs text-white/45">{organization.slug}</div>
            </div>
            <StatusPill value={organization.status} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div>
              <div className="text-xs text-white/40">Users</div>
              <div className="mt-1 text-white">{organization.users_count}</div>
            </div>
            <div>
              <div className="text-xs text-white/40">Boards</div>
              <div className="mt-1 text-white">{organization.boards_count}</div>
            </div>
            <div>
              <div className="text-xs text-white/40">Plan</div>
              <div className="mt-1">
                <StatusPill value={organization.plan_tier} />
              </div>
            </div>
          </div>
          {props.onPlanChange ? (
            <div className="mt-4" onClick={(event) => event.stopPropagation()}>
              <Select
                value={organization.plan_tier}
                onValueChange={(value) => props.onPlanChange?.(organization.id, value as AdminOrganizationRow['plan_tier'])}
              >
                <option value="free">Free plan</option>
                <option value="pro">Pro plan</option>
              </Select>
            </div>
          ) : null}
        </button>
      ))}
    </div>
  )
}

type DataColumn = { key: string; label: string; width: string }
type DataRow = { id: string; cells: Record<string, ReactNode>; active?: boolean }

function DataTable(props: { columns: DataColumn[]; rows: DataRow[]; onRowClick?: (id: string) => void }) {
  const template = props.columns.map((column) => column.width).join(' ')
  return (
    <div className="mt-3">
      <div className="hidden overflow-x-auto rounded-xl border border-white/10 xl:block">
        <div className="min-w-[980px]">
          <div className="grid bg-black/30 text-xs font-semibold text-white/50" style={{ gridTemplateColumns: template }}>
            {props.columns.map((column) => (
              <div key={column.key} className="px-4 py-3">
                {column.label}
              </div>
            ))}
          </div>
          <div className="max-h-[580px] overflow-auto kb-scroll bg-black/12">
            {props.rows.length ? (
              props.rows.map((row) => (
                <button
                  key={row.id}
                  onClick={props.onRowClick ? () => props.onRowClick?.(row.id) : undefined}
                  className={`grid w-full border-t border-white/5 text-left text-sm transition ${
                    row.active ? 'bg-white/10' : 'hover:bg-white/6'
                  } ${props.onRowClick ? 'cursor-pointer' : 'cursor-default'}`}
                  style={{ gridTemplateColumns: template }}
                >
                  {props.columns.map((column) => (
                    <div key={column.key} className="min-w-0 px-4 py-3 text-white/78">
                      {row.cells[column.key] ?? '-'}
                    </div>
                  ))}
                </button>
              ))
            ) : (
              <div className="px-4 py-5 text-sm text-white/55">No results.</div>
            )}
          </div>
        </div>
      </div>
      <div className="grid gap-3 xl:hidden">
        {props.rows.length ? (
          props.rows.map((row) => (
            <button
              key={row.id}
              onClick={props.onRowClick ? () => props.onRowClick?.(row.id) : undefined}
              className={`kb-ring rounded-xl border p-4 text-left ${
                row.active ? 'border-white/20 bg-white/10' : 'border-white/10 bg-black/20'
              }`}
            >
              {props.columns.map((column) => (
                <div key={column.key} className="grid gap-1 border-t border-white/5 py-2 first:border-t-0 first:pt-0 last:pb-0">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-white/40">{column.label}</div>
                  <div className="min-w-0 text-sm text-white/80">{row.cells[column.key] ?? '-'}</div>
                </div>
              ))}
            </button>
          ))
        ) : (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/55">No results.</div>
        )}
      </div>
    </div>
  )
}

function BoardDetailPanel(props: {
  boardDetail: AdminBoardDetail | null
  selectedBoard: AdminBoardDetail['board'] | null
  boardForm: BoardFormState
  saving: boolean
  onFormChange: (fn: (current: BoardFormState) => BoardFormState) => void
  onSave: () => void
  onReload: () => void
}) {
  const { selectedBoard, boardDetail, boardForm, onFormChange } = props
  return (
    <Surface className="p-5">
      <PanelHeader title="Board details" count={selectedBoard ? 1 : 0} />
      {selectedBoard ? (
        <div className="mt-3 grid gap-4">
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <StackedCell title={selectedBoard.title} detail={`Recipient: ${selectedBoard.recipient_name}`} />
              <StatusPill value={selectedBoard.status} />
            </div>
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <InfoItem label="Organization" value={selectedBoard.organization_name} />
              <InfoItem label="Owner" value={selectedBoard.owner_email} />
              <InfoItem label="Created" value={formatDateTime(selectedBoard.created_at)} />
              <InfoItem label="Updated" value={formatDateTime(selectedBoard.updated_at)} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Board status">
              <Select value={boardForm.status} onValueChange={(value) => onFormChange((s) => ({ ...s, status: value as typeof boardForm.status }))}>
                <option value="">Keep current</option>
                <option value="draft">Draft</option>
                <option value="collecting_messages">Collecting</option>
                <option value="scheduled">Scheduled</option>
                <option value="delivered">Delivered</option>
                <option value="archived">Archived</option>
              </Select>
            </Field>
            <Field label="Plan tier">
              <Select value={boardForm.planTier} onValueChange={(value) => onFormChange((s) => ({ ...s, planTier: value as typeof boardForm.planTier }))}>
                <option value="">Keep current</option>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
              </Select>
            </Field>
            <Field label="Delivery state">
              <Select value={boardForm.deliveryState} onValueChange={(value) => onFormChange((s) => ({ ...s, deliveryState: value as typeof boardForm.deliveryState }))}>
                <option value="">Keep current</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="delivered">Delivered</option>
              </Select>
            </Field>
            <Field label="Destination">
              <Select value={boardForm.destinationType} onValueChange={(value) => onFormChange((s) => ({ ...s, destinationType: value as typeof boardForm.destinationType }))}>
                <option value="">Keep current</option>
                <option value="recipient">Recipient</option>
                <option value="creator">Creator</option>
              </Select>
            </Field>
            <Field label="Scheduled at">
              <input
                type="datetime-local"
                className="kb-ring min-h-[42px] rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                value={boardForm.scheduledAt}
                onChange={(e) => onFormChange((s) => ({ ...s, scheduledAt: e.target.value }))}
              />
            </Field>
            <Field label="Recipient contact">
              <input
                className="kb-ring min-h-[42px] rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                value={boardForm.recipientContact}
                onChange={(e) => onFormChange((s) => ({ ...s, recipientContact: e.target.value }))}
              />
            </Field>
            <Field label="Theme ID">
              <input
                className="kb-ring min-h-[42px] rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white md:col-span-2"
                value={boardForm.theme}
                onChange={(e) => onFormChange((s) => ({ ...s, theme: e.target.value }))}
              />
            </Field>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={props.onSave} disabled={props.saving}>
              {props.saving ? 'Saving...' : 'Save changes'}
            </Button>
            <Button variant="secondary" onClick={props.onReload}>
              Reload
            </Button>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <DetailList title="Messages" empty="No messages yet.">
              {boardDetail?.messages.map((message) => (
                <div key={message.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="text-sm font-semibold text-white">{message.display_name || 'Someone'}</div>
                  <div className="mt-1 text-sm text-white/70">{message.text}</div>
                </div>
              ))}
            </DetailList>
            <DetailList title="Events" empty="No events yet.">
              {boardDetail?.events.map((event) => (
                <div key={event.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="text-sm font-semibold text-white">{event.event_name}</div>
                  <div className="mt-1 text-xs text-white/55">{formatDateTime(event.created_at)}</div>
                </div>
              ))}
            </DetailList>
          </div>
        </div>
      ) : (
        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
          Select a board to inspect and edit.
        </div>
      )}
    </Surface>
  )
}

function InfoItem(props: { label: string; value?: string | null }) {
  return (
    <div className="min-w-0">
      <div className="text-xs text-white/40">{props.label}</div>
      <div className="mt-1 truncate text-white/80" title={props.value || '-'}>
        {props.value || '-'}
      </div>
    </div>
  )
}

function DetailList(props: { title: string; empty: string; children?: ReactNode }) {
  const hasChildren = Array.isArray(props.children) ? props.children.length > 0 : Boolean(props.children)
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.18em] text-white/45">{props.title}</div>
      <div className="mt-2 grid max-h-[360px] gap-2 overflow-auto kb-scroll pr-1">
        {hasChildren ? props.children : <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/55">{props.empty}</div>}
      </div>
    </div>
  )
}
