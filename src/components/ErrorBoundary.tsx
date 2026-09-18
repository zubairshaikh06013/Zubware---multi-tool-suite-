import React, { Component, ErrorInfo, ReactNode } from 'react';
import { getLinkUrl } from '../lib/paths';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    showDetails: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, showDetails: false };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled UI Error in Root Boundary:', error, errorInfo);
  }

  public handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public handleResetApp = () => {
    try {
      // Clear potentially corrupted session state while preserving user files
      sessionStorage.clear();
    } catch {
      // Ignore storage errors
    }
    this.setState({ hasError: false, error: null });
    window.location.href = getLinkUrl('/');
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 text-white font-sans text-center">
          <div className="max-w-md w-full p-8 bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl space-y-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto shadow-lg shadow-indigo-600/30">
              SD
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold">Something went wrong</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected error occurred while rendering the application. You can reload or return to the main dashboard.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Reload Application
              </button>
              <button
                onClick={this.handleResetApp}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Go to Homepage
              </button>
            </div>

            {/* Collapsible Error Trace */}
            {this.state.error && (
              <div className="pt-2 text-left">
                <button
                  type="button"
                  onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                  className="text-[11px] font-mono text-slate-400 hover:text-slate-200 underline cursor-pointer"
                >
                  {this.state.showDetails ? 'Hide error details' : 'View error details'}
                </button>
                {this.state.showDetails && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-rose-900/50 text-[11px] font-mono text-rose-300 max-h-36 overflow-auto break-words leading-relaxed">
                    {this.state.error.message || String(this.state.error)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
