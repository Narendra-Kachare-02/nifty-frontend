import { Sidebar } from '../Sidebar';
import { ProjectDropdown } from '../ProjectDropdown';
import type { DocumentItemForList } from '../DocumentsCollapsible';
import type { ProjectOption } from '../ProjectDropdown';

interface ProjectSidebarProps {
  /** Project dropdown in sidebar; when provided, selection drives documents and extracted data */
  projects?: ProjectOption[];
  selectedProjectId?: string | null;
  onProjectSelect?: (id: string) => void;
  documents: DocumentItemForList[];
  selectedDocumentId: string | null;
  onDocumentSelect: (id: string) => void;
  /** Extracted agreement data - used for project name and RERA number */
  extractedData?: unknown;
}

const DocIcon = () => (
  <svg className="w-4 h-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

/** Vertical flat list of documents (no dropdown/collapse). */
function DocumentsFlatList({
  documents,
  selectedId,
  onSelect,
}: {
  documents: DocumentItemForList[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="list-none pl-0 m-0 flex flex-col gap-1 overflow-y-auto overscroll-contain" aria-label="Documents">
      {documents.length === 0 ? (
        <li className="px-3 py-6 text-center">
          <p className="text-sm text-gray-500">No documents</p>
          <p className="text-xs text-gray-400 mt-1">Upload or select a project</p>
        </li>
      ) : (
        documents.map((doc) => {
          const isSelected = selectedId === doc.id;
          return (
            <li key={doc.id}>
              <button
                type="button"
                onClick={() => onSelect(doc.id)}
                aria-pressed={isSelected}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-inset ${
                  isSelected
                    ? 'bg-blue-100/90 text-blue-900 font-medium ring-2 ring-blue-300/60'
                    : 'text-gray-800 hover:bg-gray-100/80 border border-transparent hover:border-gray-200'
                }`}
              >
                <DocIcon />
                <span className="truncate flex-1 min-w-0 font-medium">{doc.name}</span>
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
  );
}

/** Sidebar: project dropdown, project info, and documents as vertical flat list. */
export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projects,
  selectedProjectId,
  onProjectSelect,
  documents,
  selectedDocumentId,
  onDocumentSelect,
  extractedData,
}) => {
  const payload = extractedData && typeof extractedData === 'object' ? (extractedData as Record<string, unknown>) : null;
  // New backend shape: result has project.project_name, project.rera_registration_number
  const projectBlock = payload?.project as Record<string, unknown> | undefined;
  const legacy = (payload?.result as Record<string, unknown>) ?? payload;
  const projectName =
    projectBlock?.project_name != null
      ? String(projectBlock.project_name)
      : legacy?.project_name != null
        ? String(legacy.project_name)
        : null;
  const reraNumber =
    projectBlock?.rera_registration_number != null
      ? String(projectBlock.rera_registration_number)
      : legacy?.rera_number != null
        ? String(legacy.rera_number)
        : null;
  const showProjectDropdown = Array.isArray(projects) && projects.length > 0 && onProjectSelect;

  return (
    <Sidebar className="overflow-hidden flex flex-col w-full lg:w-64 xl:w-72 shrink-0">
      {/* Project dropdown – inside left section */}
      {showProjectDropdown && (
        <div className="shrink-0 px-4 sm:px-5 pt-4 pb-3 border-b border-gray-200 bg-gradient-to-br from-blue-50 via-white to-gray-50/50">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Project</label>
          <ProjectDropdown
            projects={projects}
            selectedProjectId={selectedProjectId ?? null}
            onSelect={onProjectSelect}
            placeholder="Select project"
          />
        </div>
      )}

      {/* Project info (name, RERA) – scroll inside this div only */}
      <div className="shrink-0 flex flex-col min-h-0 px-4 sm:px-5 py-4 border-b border-gray-200 bg-gradient-to-br from-blue-50/80 via-white to-gray-50/50 max-h-[25vh] overflow-y-auto overscroll-contain">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2 shrink-0">Project Information</h2>
        {projectName || reraNumber ? (
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Project Name</p>
            <p className={`text-sm font-semibold truncate leading-relaxed ${projectName ? 'text-gray-900' : 'text-gray-400 italic'}`}>
              {projectName || '—'}
            </p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-1">RERA Number</p>
            <p className={`text-sm font-semibold truncate leading-relaxed ${reraNumber ? 'text-gray-900' : 'text-gray-400 italic'}`}>
              {reraNumber || '—'}
            </p>
          </div>
        ) : (
          <div className="py-2">
            <p className="text-sm text-gray-400 italic">No project information yet</p>
            <p className="text-xs text-gray-400 mt-0.5">Extraction results will appear here</p>
          </div>
        )}
      </div>

      {/* Documents – vertical flat list (always visible) */}
      <div className="flex-1 flex flex-col min-h-0 p-4 sm:p-5 bg-gradient-to-b from-gray-50/30 to-white">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Documents</h3>
        <DocumentsFlatList
          documents={documents}
          selectedId={selectedDocumentId}
          onSelect={onDocumentSelect}
        />
      </div>
    </Sidebar>
  );
};
