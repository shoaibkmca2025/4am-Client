import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-dark p-8 font-sans">
          <div className="max-w-md w-full bg-brand-surface rounded-[32px] shadow-clay p-8 border border-white/40">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
            <p className="text-brand-muted mb-6">The application encountered an error. Please check the console for more details.</p>
            <pre className="bg-brand-bg p-4 rounded-xl text-xs overflow-auto max-h-40 font-mono text-red-600 border border-brand-border/50 shadow-inner-clay">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-8 w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-4 rounded-xl font-medium shadow-clay hover:shadow-clay-hover hover:-translate-y-0.5 transition-all duration-300"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
