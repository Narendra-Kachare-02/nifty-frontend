import { Component, type ErrorInfo, type ReactNode } from 'react';

const PREFIX = '[Dashboard ErrorBoundary]';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class DashboardErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(PREFIX, 'caught error', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      console.error(PREFIX, 'rendering fallback UI', this.state.error.message);
      return (
        <div className="flex flex-1 items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md rounded-xl border-2 border-red-200 bg-white p-6 shadow-md">
            <h2 className="text-lg font-bold text-red-800">Dashboard error</h2>
            <p className="mt-2 text-sm text-gray-700">{this.state.error.message}</p>
            <p className="mt-2 text-xs text-gray-500">Check the browser console for details.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
