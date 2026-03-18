import React from 'react';

const EMPTY = '—';

function humanLabel(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function ReadableValue({ value, depth = 0 }: { value: unknown; depth?: number }): React.ReactNode {
  if (value == null || value === '') return <span className="text-gray-300 italic">{EMPTY}</span>;

  if (Array.isArray(value)) {
    const items = value.filter((x) => x != null && x !== '');
    if (items.length === 0) return <span className="text-gray-300 italic">{EMPTY}</span>;
    return (
      <span className="text-gray-800">
        {items.map((item, i) => (
          <span key={i}>
            {i > 0 && ', '}
            {typeof item === 'object' && item !== null
              ? <ReadableKeyValueBlock data={item as Record<string, unknown>} depth={depth + 1} inline />
              : String(item)}
          </span>
        ))}
      </span>
    );
  }

  if (typeof value === 'object') {
    return <ReadableKeyValueBlock data={value as Record<string, unknown>} depth={depth + 1} />;
  }

  const s = String(value).trim();
  if (s === 'null' || s === 'undefined' || s === '') return <span className="text-gray-300 italic">{EMPTY}</span>;
  return <span className="text-gray-800 break-words">{s}</span>;
}

function filterEntries(data: Record<string, unknown>) {
  return Object.entries(data).filter(([, v]) => {
    if (v == null || v === '') return false;
    if (Array.isArray(v)) return v.some((x) => x != null && x !== '');
    if (typeof v === 'object') return Object.values(v as Record<string, unknown>).some((x) => x != null && x !== '');
    const s = String(v).trim();
    return s !== '' && s !== 'null' && s !== 'undefined';
  });
}

function ReadableKeyValueBlock({ data, depth = 0, inline = false }: { data: Record<string, unknown>; depth?: number; inline?: boolean }): React.ReactNode {
  if (!data || typeof data !== 'object') return null;
  const entries = filterEntries(data);
  if (entries.length === 0) return null;

  if (inline) {
    return (
      <span className="text-gray-800">
        {entries.map(([k, v]) => (
          <span key={k} className="mr-4"><span className="text-gray-400 font-medium">{humanLabel(k)}: </span><ReadableValue value={v} depth={depth} /></span>
        ))}
      </span>
    );
  }

  return (
    <div className={depth > 0 ? 'ml-4 pl-4 border-l-2 border-gray-100 space-y-2' : 'space-y-2'}>
      {entries.map(([key, value]) => (
        <div key={key} className="flex flex-col sm:flex-row sm:gap-4 gap-0.5">
          <span className="text-gray-500 text-sm font-medium shrink-0 sm:w-44">{humanLabel(key)}</span>
          <div className="flex-1 min-w-0 text-[15px] leading-relaxed"><ReadableValue value={value} depth={depth} /></div>
        </div>
      ))}
    </div>
  );
}

function Section({ title, data }: { title: string; data: Record<string, unknown> | null | undefined }) {
  if (!data || typeof data !== 'object') return null;
  const entries = filterEntries(data);
  if (entries.length === 0) return null;

  return (
    <div className="pt-5 first:pt-0">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</h4>
      <ReadableKeyValueBlock data={data} depth={0} />
    </div>
  );
}

function AddressSection({ data }: { data: Record<string, unknown> | null | undefined }) {
  if (!data || typeof data !== 'object') return null;
  const rawFull = data.full_address;
  const full = rawFull != null && rawFull !== '' && String(rawFull).trim() !== 'null' ? String(rawFull).trim() : null;

  if (full) {
    const parts = [
      (data.street ?? data.village) as string | undefined,
      data.area as string | undefined,
      (data.taluka ?? data.city) as string | undefined,
      data.district as string | undefined,
      data.state as string | undefined,
      data.pincode as string | undefined,
    ].filter(Boolean);

    return (
      <div className="pt-5">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Address</h4>
        <p className="text-[15px] text-gray-800 font-medium leading-relaxed">{full}</p>
        {parts.length > 0 && <p className="text-sm text-gray-400 mt-1">{parts.join(', ')}</p>}
      </div>
    );
  }

  return <Section title="Address" data={data} />;
}

function PartiesSection({ parties }: { parties: unknown }) {
  if (!Array.isArray(parties) || parties.length === 0) return null;
  const valid = parties.filter(
    (p) => typeof p === 'object' && p !== null && Object.values(p).some((v) => v != null && v !== '' && String(v).trim() !== 'null')
  );
  if (valid.length === 0) return null;

  return (
    <div className="pt-5">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Parties</h4>
      <div className="space-y-3">
        {valid.map((p: Record<string, unknown>, i: number) => (
          <div key={i} className="p-4 bg-gray-50/80 rounded-lg border border-gray-100">
            <ReadableKeyValueBlock data={p} depth={0} />
          </div>
        ))}
      </div>
    </div>
  );
}

function isNewSchema(d: Record<string, unknown>): boolean {
  return d != null && typeof d.project === 'object' && d.project !== null;
}

function SectionList({ d, project }: { d: Record<string, unknown>; project?: Record<string, unknown> }) {
  if (isNewSchema(d)) {
    return (
      <>
        <Section title="Land" data={project?.land as Record<string, unknown>} />
        <Section title="Approval" data={project?.approval as Record<string, unknown>} />
        <Section title="Timeline" data={project?.timeline as Record<string, unknown>} />
        <Section title="Document Details" data={d.document_metadata as Record<string, unknown>} />
        <Section title="Promoter" data={d.promoter as Record<string, unknown>} />
        <Section title="Unit" data={d.unit as Record<string, unknown>} />
        <Section title="Parking" data={d.parking as Record<string, unknown>} />
        <Section title="Financial" data={d.financial as Record<string, unknown>} />
        <Section title="Payment" data={d.payment as Record<string, unknown>} />
        <Section title="Buyer" data={d.buyer as Record<string, unknown>} />
        <Section title="Legal" data={d.legal as Record<string, unknown>} />
        <Section title="Maintenance" data={d.maintenance as Record<string, unknown>} />
        <Section title="Verification" data={d.verification as Record<string, unknown>} />
        <Section title="Annexures" data={d.annexures as Record<string, unknown>} />
      </>
    );
  }

  return (
    <>
      <Section title="Builder Information" data={d.builder_info as Record<string, unknown>} />
      <PartiesSection parties={d.parties} />
      <Section title="Property Specifications" data={d.property_specs as Record<string, unknown>} />
      <Section title="Timeline" data={d.timeline as Record<string, unknown>} />
      <Section title="Legal Information" data={d.legal as Record<string, unknown>} />
      <Section title="Possession Details" data={d.possession as Record<string, unknown>} />
      <Section title="Dispute Information" data={d.dispute as Record<string, unknown>} />
      {Array.isArray(d.annexures) && d.annexures.length > 0 && (
        <div className="pt-5">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Annexures</h4>
          <p className="text-[15px] text-gray-800">{d.annexures.join(', ')}</p>
        </div>
      )}
    </>
  );
}

export interface ExtractedDataDisplayProps {
  data: unknown;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  compact?: boolean;
  size?: 'normal' | 'large';
}

export const ExtractedDataDisplay: React.FC<ExtractedDataDisplayProps> = ({
  data,
  isExpanded = true,
  onToggleExpand,
  compact = false,
  size = 'normal',
}) => {
  if (!data || typeof data !== 'object') return null;

  const payload = data as Record<string, unknown>;
  const d = (payload.result as Record<string, unknown>) ?? payload;
  const project = d.project as Record<string, unknown> | undefined;
  const large = size === 'large';

  const projectName = project?.project_name != null ? String(project.project_name).trim()
    : d.project_name != null ? String(d.project_name).trim() : null;
  const reraNumber = project?.rera_registration_number != null ? String(project.rera_registration_number).trim()
    : d.rera_number != null ? String(d.rera_number).trim() : null;
  const projectAddress = (project?.address as Record<string, unknown>) ?? (d.address as Record<string, unknown>);
  const projectType = (project?.project_type ?? d.property_name) != null ? String(project?.project_type ?? d.property_name).trim() : null;

  const hasKeyInfo = !!(projectName || reraNumber || projectType);

  const heroCards = hasKeyInfo ? (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {[
        { label: 'RERA Number', value: reraNumber, mono: true },
        { label: 'Project Name', value: projectName },
        { label: isNewSchema(d) ? 'Project Type' : 'Property Name', value: projectType },
      ].map(({ label, value, mono }) => (
        <div key={label} className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200/80">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
          <p className={`text-base font-semibold mt-1 leading-snug ${
            value ? `text-gray-900 ${mono ? 'font-mono' : ''}` : 'text-gray-300 italic'
          }`}>
            {value || EMPTY}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <div className="py-5 px-4 rounded-lg bg-gray-50 border border-gray-100 text-center">
      <p className="text-sm text-gray-400">No project information extracted yet</p>
    </div>
  );

  if (compact) {
    return (
      <div
        className="overflow-y-auto overscroll-contain scrollbar-thin-custom"
        style={{ maxHeight: '65vh' }}
        role="region"
        aria-label="Extracted document data"
      >
        <div className="py-2 space-y-0">
          {heroCards}
          <AddressSection data={projectAddress} />
          <SectionList d={d} project={project} />
        </div>
      </div>
    );
  }

  const summary = [reraNumber, projectName].filter(Boolean).slice(0, 2).join(' · ');

  return (
    <section
      className="rounded-xl border border-gray-200/80 bg-white shadow-sm overflow-hidden"
      aria-label="Extracted agreement data"
    >
      <button
        type="button"
        onClick={onToggleExpand ?? undefined}
        className={`w-full text-left px-5 py-4 flex items-center gap-3 bg-gradient-to-r from-emerald-50/80 to-teal-50/60 border-b border-emerald-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-inset ${
          onToggleExpand ? 'cursor-pointer hover:from-emerald-50 hover:to-teal-50' : 'cursor-default'
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden />
              Output
            </span>
          </div>
          <h3 className={`font-bold text-gray-900 ${large ? 'text-lg' : 'text-base'}`}>Extracted Agreement Data</h3>
          {summary && <p className="text-sm text-gray-500 mt-0.5 truncate">{summary}</p>}
        </div>
        {onToggleExpand && (
          <span className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-transform duration-200 ${
            isExpanded ? 'rotate-180 bg-emerald-100' : 'bg-white border border-gray-200'
          }`}>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        )}
      </button>

      {isExpanded && (
        <div
          className="p-5 overflow-y-auto overscroll-contain scrollbar-thin-custom"
          style={{ maxHeight: '65vh' }}
          role="region"
          aria-label="Document details"
        >
          {heroCards}
          <AddressSection data={projectAddress} />
          <SectionList d={d} project={project} />
        </div>
      )}
    </section>
  );
};
