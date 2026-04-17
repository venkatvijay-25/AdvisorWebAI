import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * ErrorBoundary component
 * React class component that catches errors in child components
 * and displays a recovery UI with a "Try again" button
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[Copilot] render error:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      return (
        <div
          style={{
            padding: 32,
            textAlign: 'center',
            color: '#64748B',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠</div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 16,
              color: '#0F172A',
              marginBottom: 4,
            }}
          >
            Something went wrong
          </div>
          <div style={{ fontSize: 13, marginBottom: 16 }}>
            {String(this.state.error?.message || this.state.error)}
          </div>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '8px 16px',
              background: '#2FA4F9',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
