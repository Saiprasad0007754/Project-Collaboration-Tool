import { Component } from 'react';
import Button from './Button';

/**
 * Catches JavaScript errors anywhere in its child component tree,
 * logs them, and renders a fallback UI instead of crashing the
 * whole app. Wrap route-level pages (or the whole <App />) with this.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Hook point for sending errors to a logging service (Sentry, etc.)
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Something went wrong
            </h2>
            <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
              An unexpected error occurred while rendering this section. You can try again, or
              refresh the page if the problem persists.
            </p>
            <Button onClick={this.handleReset}>Try again</Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
