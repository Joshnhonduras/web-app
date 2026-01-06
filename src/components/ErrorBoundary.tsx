import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Growth Hub UI:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isDev = typeof window !== 'undefined' && (window as any).__DEV__;
      return (
        <div className="error-boundary">
          <h1>Something went wrong.</h1>
          <p>
            The app hit an unexpected error. Try refreshing the page. If this keeps happening,
            revisit your API settings or restart Growth Hub.
          </p>
          {isDev && this.state.error && (
            <pre>{this.state.error.message}</pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

