import { useRef, useEffect, useState } from 'react';

export interface DocumentItemForDropdown {
  id: string;
  name: string;
}

interface DocumentDropdownProps {
  documents: DocumentItemForDropdown[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

const MAX_LIST_HEIGHT = 200;

export const DocumentDropdown: React.FC<DocumentDropdownProps> = ({
  documents,
  value,
  onChange,
  placeholder = 'Select document',
  className = '',
  id = 'doc-dropdown',
  'aria-label': ariaLabel = 'Documents',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDoc = documents.find((d) => d.id === value);
  const displayText = selectedDoc?.name ?? placeholder;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleSelect = (docId: string) => {
    onChange(docId);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, docId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(docId);
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        id={id}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-left text-sm font-medium text-gray-900 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all flex items-center justify-between gap-2"
      >
        <span className={selectedDoc ? 'truncate' : 'text-gray-500'}>{displayText}</span>
        <svg
          className={`w-5 h-5 shrink-0 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-labelledby={id}
          className="absolute left-0 right-0 top-full mt-1 z-10 rounded-xl border-2 border-gray-200 bg-white shadow-lg overflow-y-auto overscroll-contain list-none pl-0 m-0"
          style={{ maxHeight: MAX_LIST_HEIGHT }}
          onKeyDown={handleListKeyDown}
        >
          <li className="border-b border-gray-100">
            <button
              type="button"
              className="w-full px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 text-left"
              onClick={() => handleSelect('')}
              onKeyDown={(e) => handleKeyDown(e, '')}
            >
              {placeholder}
            </button>
          </li>
          {documents.map((doc) => (
            <li key={doc.id}>
              <button
                type="button"
                className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 ${
                  value === doc.id ? 'bg-blue-50 text-blue-800 font-medium' : 'text-gray-800'
                }`}
                onClick={() => handleSelect(doc.id)}
                onKeyDown={(e) => handleKeyDown(e, doc.id)}
              >
                {doc.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
