import { useState } from 'react';
import { ExtractedDataDisplay } from '../ExtractedDataDisplay';

interface WorkflowOutputPanelProps {
  extractedData?: Record<string, unknown> | object | null;
  hasOutput: boolean;
}

/** Right-side output panel - WhatsApp style. Shows extracted data when Agent-1 completes. */
export const WorkflowOutputPanel: React.FC<WorkflowOutputPanelProps> = ({
  extractedData,
  hasOutput,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden bg-white rounded-2xl border-2 border-gray-200/80 shadow-lg shadow-gray-100/80 transition-all duration-300 hover:shadow-xl hover:border-gray-300/80">
      {/* Header */}
      <div className="shrink-0 px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" aria-hidden />
            Output Panel
          </span>
          {hasOutput && (
            <span className="text-xs font-medium text-emerald-600">Agent-1 complete</span>
          )}
        </div>
        <h3 className="text-base font-bold text-gray-900 mt-2">
          {hasOutput ? 'Extracted Agreement Data' : 'Waiting for Agent-1 output...'}
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          {hasOutput
            ? 'Data extracted from your uploaded document'
            : 'Output will appear here when extraction completes'}
        </p>
      </div>

      {/* Content area - full height */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 lg:p-6">
        {hasOutput && extractedData ? (
          <div
            className="animate-fade-slide-in"
            style={{ animationDuration: '0.4s', animationFillMode: 'both' }}
          >
            <ExtractedDataDisplay
              data={extractedData}
              isExpanded={isExpanded}
              onToggleExpand={() => setIsExpanded((p) => !p)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">No output yet</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Agent-1 will extract data from your document. Results will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
