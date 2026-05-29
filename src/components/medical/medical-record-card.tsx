import { ValidationBadge } from "./validation-badge";

const IMPORTANCE_STYLES = {
  critical: { bg: "bg-[rgba(224,101,76,.13)]", text: "text-med-coral", label: "Crítico" },
  important: { bg: "bg-[rgba(214,154,46,.13)]", text: "text-med-amber", label: "Importante" },
  routine: { bg: "bg-[rgba(92,111,106,.13)]", text: "text-med-muted", label: "Rutina" },
};

export function MedicalRecordCard({ record, onPin, onViewDetails }: {
  record: {
    id: string;
    title: string;
    type: string;
    date: string;
    institution?: string;
    doctor?: string;
    status: "declared" | "document_attached" | "ai_extracted" | "pending_review" | "verified" | "institution_issued" | "corrected" | "discarded";
    hasDocument?: boolean;
    importance?: "critical" | "important" | "routine";
    isPinned?: boolean;
  };
  onPin?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}) {
  const importanceStyle = record.importance ? IMPORTANCE_STYLES[record.importance] : null;

  return (
    <div className="bg-white border border-med-line rounded-lg p-4 hover:border-med-secondary/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[15px]">{record.title}</h3>
            {importanceStyle && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-[999px] ${importanceStyle.bg} ${importanceStyle.text}`}>
                {importanceStyle.label}
              </span>
            )}
          </div>
          <p className="text-xs text-med-muted mb-2">{record.type}</p>
        </div>
        {onPin && (
          <button
            onClick={() => onPin(record.id)}
            className={`p-1 rounded hover:bg-med-surface-elevated ${record.isPinned ? "text-med-secondary" : "text-med-muted"}`}
            title={record.isPinned ? "Desfijar" : "Fijar en resumen"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M12 17v-6M12 9V7M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-1.5 text-xs text-med-ink-soft mb-3">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M16 2v6M8 2v6M3 10h18" />
          </svg>
          <span>{record.date}</span>
        </div>
        {record.institution && (
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <path d="M3 21h18M5 21V7l8-4 8 4v14M8 21v-2a4 4 0 0 1 4-4v0a4 4 0 0 1 4 4v2" />
            </svg>
            <span>{record.institution}</span>
          </div>
        )}
        {record.doctor && (
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <path d="M19 14c1.5-1.5 2-3.5 2-5a9 9 0 1 0-18 0c0 1.5.5 3.5 2 5" />
              <circle cx="12" cy="13" r="3" />
            </svg>
            <span>{record.doctor}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ValidationBadge status={record.status} />
          {record.hasDocument && (
            <span className="text-[10px] text-med-muted flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Documento adjunto
            </span>
          )}
        </div>
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(record.id)}
            className="text-xs text-med-secondary hover:underline"
          >
            Ver detalles
          </button>
        )}
      </div>
    </div>
  );
}
