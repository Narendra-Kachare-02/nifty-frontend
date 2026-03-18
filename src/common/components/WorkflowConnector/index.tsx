interface WorkflowConnectorProps {
  className?: string;
}

/** Horizontal connector with arrow between workflow nodes (Agent 1 → Agent 2). */
export const WorkflowConnector: React.FC<WorkflowConnectorProps> = ({ className = '' }) => {
  return (
    <div
      className={`flex items-center justify-center shrink-0 w-8 md:w-12 lg:w-16 ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 64 24"
        className="w-full h-6 text-gray-300"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="0" y1="12" x2="48" y2="12" />
        <path d="M44 8l4 4-4 4" />
      </svg>
    </div>
  );
};
