import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../../api/config';
import { store } from '../../../redux/store';

export interface DocumentItemProps {
  id: string;
  name: string;
  url?: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const DocIcon = ({ active }: { active?: boolean }) => (
  <svg className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

function toRelativePath(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

function DocumentViewerModal({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let revoke: string | null = null;
    let cancelled = false;

    async function fetchDoc() {
      try {
        const token = (store.getState().auth as { access_token?: string }).access_token;
        const relativePath = toRelativePath(url);
        const res = await axios.get(`${BASE_URL.replace(/\/$/, '')}${relativePath}`, {
          responseType: 'blob',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (cancelled) return;
        const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/pdf' });
        const objectUrl = URL.createObjectURL(blob);
        revoke = objectUrl;
        setBlobUrl(objectUrl);
      } catch {
        if (!cancelled) setError('Failed to load document');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDoc();
    return () => {
      cancelled = true;
      if (revoke) URL.revokeObjectURL(revoke);
    };
  }, [url]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <DocIcon active />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{name}</h3>
              <p className="text-[11px] text-gray-400">Document preview</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 min-h-0 bg-gray-50 flex items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <span className="w-8 h-8 rounded-full border-[3px] border-blue-400 border-t-transparent animate-spin" />
              <p className="text-sm">Loading document...</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center gap-2 text-gray-500 px-6 text-center">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">{error}</p>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-700 underline mt-1">
                Open in new tab
              </a>
            </div>
          )}
          {blobUrl && !loading && (
            <iframe src={blobUrl} title={name} className="w-full h-full border-0" />
          )}
        </div>
      </div>
    </div>
  );
}

export const DocumentItem: React.FC<DocumentItemProps> = ({ id, name, url, isSelected, onSelect }) => {
  const [viewerOpen, setViewerOpen] = useState(false);

  const handleView = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setViewerOpen(true);
  }, []);

  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const isPdf = ext === 'pdf';

  return (
    <li>
      <div
        className={`group w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-[13px] transition-all duration-150 cursor-pointer border ${
          isSelected
            ? 'bg-blue-50 border-blue-200 shadow-sm shadow-blue-100/30'
            : 'border-transparent hover:bg-gray-50 hover:shadow-sm'
        }`}
        onClick={() => onSelect(id)}
      >
        <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
          isSelected ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200/70'
        }`}>
          {isPdf ? (
            <svg className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-red-400'}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8.5 13h1c.83 0 1.5.67 1.5 1.5S10.33 16 9.5 16H9v1.5H8V13h.5zm4 0h1c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H13v1.5h-1V13h.5zm-3.5 1v1h.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H9zm4 0v1h.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H13z"/>
            </svg>
          ) : (
            <DocIcon active={isSelected} />
          )}
        </div>

        <span className={`truncate flex-1 min-w-0 leading-tight ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
          {name}
        </span>

        {url && (
          <button
            type="button"
            onClick={handleView}
            className={`shrink-0 w-7 h-7 flex items-center justify-center rounded transition-all duration-150 ${
              isSelected
                ? 'text-blue-400 hover:text-blue-600 hover:bg-blue-100'
                : 'text-gray-300 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100'
            }`}
            title="View document"
            aria-label={`View ${name}`}
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="square" strokeLinejoin="miter" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        )}
      </div>

      {viewerOpen && url && (
        <DocumentViewerModal url={url} name={name} onClose={() => setViewerOpen(false)} />
      )}
    </li>
  );
};
