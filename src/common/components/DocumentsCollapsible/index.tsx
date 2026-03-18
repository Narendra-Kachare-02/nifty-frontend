import { useState } from 'react';

export interface DocumentItemForList {
  id: string;
  name: string;
  url?: string;
}

interface DocumentsCollapsibleProps {
  documents: DocumentItemForList[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
  'aria-label'?: string;
  /** Section title (e.g. "Agreement Documents") */
  sectionTitle?: string;
}

const MAX_LIST_HEIGHT = 220;

const DocIcon = () => (
  <svg className="w-4 h-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DocumentsHeaderIcon = () => (
  <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

/** Documents header (same style as Agent). Expandable flat list with selectable rows and enhanced UI. */
export const DocumentsCollapsible: React.FC<DocumentsCollapsibleProps> = ({
  documents,
  selectedId = null,
  onSelect,
  className = '',
  'aria-label': ariaLabel = 'Documents',
  sectionTitle = 'Documents',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      className={`w-full rounded-2xl border-2 bg-white overflow-hidden transition-all duration-300 ease-out ${
        isExpanded
          ? 'border-blue-400 shadow-xl shadow-blue-100/60 ring-2 ring-blue-200/60'
          : 'border-gray-200 shadow-md hover:shadow-xl hover:border-blue-200/80'
      } ${className}`}
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`group w-full text-left px-4 py-4 flex items-center gap-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-inset rounded-t-2xl cursor-pointer ${
          isExpanded ? 'bg-blue-50/90' : 'hover:bg-blue-50/50'
        }`}
        aria-expanded={isExpanded}
        aria-controls="documents-list"
        id="documents-header"
      >
        <DocumentsHeaderIcon />
        <h3 className="flex-1 text-base font-bold text-gray-900 min-w-0">{sectionTitle}</h3>
        <span
          className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 ${
            isExpanded ? 'rotate-180 bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
          }`}
          aria-hidden
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      <section
        id="documents-list"
        aria-labelledby="documents-header"
        className={`border-t border-gray-200 overflow-hidden transition-all duration-200 ${
          isExpanded ? 'max-h-[500px] opacity-100 bg-gray-50/70' : 'max-h-0 opacity-0'
        }`}
      >
        <ul
          className="list-none pl-0 m-0 overflow-y-auto overscroll-contain px-2 py-3"
          style={{ maxHeight: MAX_LIST_HEIGHT }}
        >
          {documents.length === 0 ? (
            <li className="px-4 py-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm text-gray-500">No documents</p>
                <p className="text-xs text-gray-400">Upload agreement documents to get started</p>
              </div>
            </li>
          ) : (
            documents.map((doc) => {
              const isSelected = selectedId === doc.id;
              return (
                <li key={doc.id}>
                  <button
                    type="button"
                    onClick={() => onSelect?.(doc.id)}
                    aria-pressed={isSelected}
                    className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-inset ${
                      isSelected
                        ? 'bg-blue-100/90 text-blue-900 font-medium shadow-md ring-2 ring-blue-300/60'
                        : 'text-gray-800 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200/60'
                    }`}
                  >
                    <DocIcon />
                    <div className="min-w-0 flex-1 flex flex-col gap-1">
                      <span className="truncate font-medium">{doc.name}</span>
                      <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">Agreement Document</span>
                    </div>
                    {isSelected && (
                      <svg className="w-4 h-4 shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </section>
  );
};
