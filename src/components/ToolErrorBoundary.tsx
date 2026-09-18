import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle, Home, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { getLinkUrl } from '../lib/paths';

interface ToolErrorBoundaryProps {
  children: ReactNode;
  toolTitle?: string;
  onReset?: () => void;
}

interface ToolErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

export class ToolErrorBoundary extends Component<ToolErrorBoundaryProps, ToolErrorBoundaryState> {
  public override state: ToolErrorBoundaryState = {
    hasError: false,
    error: null,
    showDetails: false
  };

  public static getDerivedStateFromError(error: Error): ToolErrorBoundaryState {
    return { hasError: true, error, showDetails: false };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error encountered in tool [${this.props.toolTitle || 'Tool'}]:`, error, errorInfo);
  }

  public handleRetry = () => {
    this.setState({ hasError: false, error: null, showDetails: false });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public handleFullReload = () => {
    window.location.reload();
  };

  public handleGoHome = () => {
    window.location.href = getLinkUrl('/');
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 my-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20 shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {this.props.toolTitle ? `${this.props.toolTitle} Encountered an Issue` : 'Tool Temporary Interruption'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              A temporary issue occurred while loading this tool. You can retry loading the tool below, or explore another utility from Zubware.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={this.handleRetry}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md hover:shadow-indigo-600/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Tool</span>
            </button>

            <button
              onClick={this.handleFullReload}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Page</span>
            </button>

            <button
              onClick={this.handleGoHome}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
          </div>

          {/* Technical Diagnostics Collapsible */}
          {this.state.error && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 text-left">
              <button
                type="button"
                onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1.5 mx-auto transition-colors"
              >
                <span>{this.state.showDetails ? 'Hide Diagnostics' : 'Show Error Details'}</span>
                {this.state.showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {this.state.showDetails && (
                <div className="mt-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-rose-600 dark:text-rose-400 break-words leading-relaxed overflow-x-auto">
                  {this.state.error.message || 'Unknown runtime error'}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
