'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from '@/components/ui/icons';
import { Button } from '@/components/ui/common';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component for handling errors in lazy-loaded components
 * Provides a fallback UI when dynamic imports fail
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Replace with your error monitoring service
      // e.g., Sentry.captureException(error, { extra: errorInfo });
    } else {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='flex flex-col items-center justify-center p-8 text-center border border-destructive/20 rounded-lg bg-destructive/5'>
          <AlertTriangle className='h-12 w-12 text-destructive mb-4' />
          <h3 className='text-lg font-semibold text-foreground mb-2'>
            Something went wrong
          </h3>
          <p className='text-sm text-muted-foreground mb-4 max-w-md'>
            Failed to load this component. This might be due to a network issue
            or a temporary problem.
          </p>
          <Button
            onClick={this.handleRetry}
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
          >
            <RefreshCw className='h-4 w-4' />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary wrapper for functional components
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

export default ErrorBoundary;
