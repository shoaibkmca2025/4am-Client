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
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-8 font-sans">
          <div className="max-w-md w-full bg-white/[0.03] rounded-2xl border border-white/[0.08] p-8">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
            <p className="text-white/60 mb-6 text-sm leading-relaxed">The application encountered an error. Please check the console for more details.</p>
            <pre className="bg-white/[0.04] p-4 rounded-xl text-xs overflow-auto max-h-40 font-mono text-red-400 border border-white/[0.06]">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-8 w-full bg-white text-black py-4 rounded-full font-bold text-sm tracking-wide hover:bg-white/90 transition-colors duration-200"
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
