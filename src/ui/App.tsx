import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { LandingPage } from './pages/LandingPage'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { AdminPage } from './pages/AdminPage'
import { CreateBoardPage } from './pages/CreateBoardPage'
import { BoardPage } from './pages/BoardPage'
import { ContributePage } from './pages/ContributePage'
import { PricingPage } from './pages/PricingPage'
import { TemplatesPage } from './pages/TemplatesPage'
import { RevealPage } from './pages/RevealPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RequireAuth } from './components/RequireAuth'
import { RequireAdmin } from './components/RequireAdmin'
import { useAppStore } from './store/useAppStore'
import { TemplatePreviewApp } from './templates/TemplatePreviewApp'

export function App() {
  const bootstrap = useAppStore((s) => s.bootstrap)

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}
