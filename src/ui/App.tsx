import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { RequireAuth } from './components/RequireAuth'
import { RequireAdmin } from './components/RequireAdmin'
import { useAppStore } from './store/useAppStore'
import { ErrorBoundary } from './components/ErrorBoundary'

const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })))
const AuthPage = lazy(() => import('./pages/AuthPage').then((m) => ({ default: m.AuthPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const AdminPage = lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })))
const CreateBoardPage = lazy(() => import('./pages/CreateBoardPage').then((m) => ({ default: m.CreateBoardPage })))
const BoardPage = lazy(() => import('./pages/BoardPage').then((m) => ({ default: m.BoardPage })))
const ContributePage = lazy(() => import('./pages/ContributePage').then((m) => ({ default: m.ContributePage })))
const PricingPage = lazy(() => import('./pages/PricingPage').then((m) => ({ default: m.PricingPage })))
const TemplatesPage = lazy(() => import('./pages/TemplatesPage').then((m) => ({ default: m.TemplatesPage })))
const RevealPage = lazy(() => import('./pages/RevealPage').then((m) => ({ default: m.RevealPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))
const TemplatePreviewApp = lazy(() => import('./templates/TemplatePreviewApp').then((m) => ({ default: m.TemplatePreviewApp })))

function RouteFallback() {
  return (
    <div className="min-h-screen kb-grid flex items-center justify-center">
      <div className="kb-glass rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70">
        Loading KairaBoard...
      </div>
    </div>
  )
}

export function App() {
  const bootstrap = useAppStore((s) => s.bootstrap)

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/templates" element={<TemplatesPage />} />

            <Route
              path="/app"
              element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              }
            />
            <Route
              path="/app/create"
              element={
                <RequireAuth>
                  <CreateBoardPage />
                </RequireAuth>
              }
            />
            <Route
              path="/app/board/:boardId"
              element={
                <RequireAuth>
                  <BoardPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminPage />
                </RequireAdmin>
              }
            />

            <Route path="/c/:boardId/:token" element={<ContributePage />} />
            <Route path="/r/:boardId/:token" element={<RevealPage />} />

            <Route path="/template-preview" element={<TemplatePreviewApp />} />
            <Route path="/app/*" element={<Navigate to="/app" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
