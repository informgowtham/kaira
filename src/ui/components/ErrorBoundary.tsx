import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen kb-grid flex items-center justify-center p-4">
          <div className="kb-glass max-w-md w-full rounded-2xl p-6 sm:p-8 border border-white/10 text-center">
            <div className="mx-auto w-12 h-12 bg-red-500/20 text-red-400 flex items-center justify-center rounded-xl mb-4">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-white/60 text-sm mb-6">
              We encountered an unexpected error. Please try reloading the page.
            </p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
