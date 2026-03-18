import { useState, useRef, useEffect } from 'react';

export interface ProjectOption {
  id: string;
  name: string;
  reraNumber?: string;
}

interface ProjectDropdownProps {
  projects: ProjectOption[];
  selectedProjectId: string | null;
  onSelect: (id: string) => void;
  placeholder?: string;
  className?: string;
}

export const ProjectDropdown: React.FC<ProjectDropdownProps> = ({
  projects,
  selectedProjectId,
  onSelect,
  placeholder = 'Select project',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200 flex items-center justify-between gap-2 ${
          isOpen
            ? 'border-blue-400 bg-white shadow-md shadow-blue-100/40 ring-1 ring-blue-200'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
            isOpen ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-gray-800 truncate leading-tight">
              {selectedProject?.name ?? placeholder}
            </p>
            {selectedProject?.reraNumber && (
              <p className="text-[10px] text-gray-400 truncate mt-0.5 font-mono">{selectedProject.reraNumber}</p>
            )}
          </div>
        </div>
        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all duration-200 ${
          isOpen ? 'bg-blue-50 rotate-180' : 'bg-gray-50'
        }`}>
          <svg className={`w-3.5 h-3.5 transition-colors ${isOpen ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl shadow-gray-200/60 max-h-60 overflow-y-auto scrollbar-thin-custom py-1"
          role="listbox"
        >
          {projects.map((project) => {
            const isSelected = selectedProjectId === project.id;
            return (
              <button
                key={project.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => { onSelect(project.id); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 transition-colors duration-100 ${
                  isSelected
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-[13px] font-semibold leading-tight truncate ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                    {project.name}
                  </p>
                  {project.reraNumber && (
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">{project.reraNumber}</p>
                  )}
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
