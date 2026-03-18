import React from 'react';
import { DocumentItem } from '../DocumentItem';
import type { DocumentItemForList } from '../DocumentsCollapsible';

interface DocumentsListProps {
  documents: DocumentItemForList[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  emptyMessage?: React.ReactNode;
  'aria-label'?: string;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  selectedId,
  onSelect,
  emptyMessage = null,
  'aria-label': ariaLabel = 'Documents',
}) => {
  return (
    <ul className="list-none p-0 m-0 flex flex-col gap-0.5" aria-label={ariaLabel}>
      {documents.length === 0 ? (
        <li className="px-3 py-8 text-center">
          {emptyMessage ?? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xs text-gray-400">No documents available</p>
            </div>
          )}
        </li>
      ) : (
        documents.map((doc) => (
          <DocumentItem
            key={doc.id}
            id={doc.id}
            name={doc.name}
            url={doc.url}
            isSelected={selectedId === doc.id}
            onSelect={onSelect}
          />
        ))
      )}
    </ul>
  );
};
