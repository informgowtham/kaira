import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import React, { useEffect, Suspense } from 'react'
import { LandingPage } from './pages/LandingPage'
import { AuthPage } from './pages/AuthPage'
import { ContributePage } from './pages/ContributePage'
import { PricingPage } from './pages/PricingPage'
import { TemplatesPage } from './pages/TemplatesPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RequireAuth } from './components/RequireAuth'
import { RequireAdmin } from './components/RequireAdmin'
import { useAppStore } from './store/useAppStore'
import { TemplatePreviewApp } from './templates/TemplatePreviewApp'
import { ErrorBoundary } from './components/ErrorBoundary'

const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const AdminPage = React.lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })))
const CreateBoardPage = React.lazy(() => import('./pages/CreateBoardPage').then(m => ({ default: m.CreateBoardPage })))
const BoardPage = React.lazy(() => import('./pages/BoardPage').then(m => ({ default: m.BoardPage })))
const RevealPage = React.lazy(() => import('./pages/RevealPage').then(m => ({ default: m.RevealPage })))

export function App() {
  const bootstrap = useAppStore((s) => s.bootstrap)

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={
          <div className="min-h-screen kb-grid flex items-center justify-center">
            <div className="text-white/60 text-sm">Loading...</div>
          </div>
        }>
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
