"use client";

import { ValidationBadge } from "./validation-badge";

export function RecordDetailsModal({ record, onClose }: {
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
    description?: string;
    notes?: string;
  };
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] shadow-[0_24px_60px_-28px_rgba(14,46,41,.45)] max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-fraunces text-[21px] font-medium">{record.title}</h2>
              <p className="text-sm text-med-muted mt-1">{record.type}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-med-surface-elevated"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-med-muted">Estado de validación</span>
              <ValidationBadge status={record.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-med-muted block mb-1">Fecha</span>
                <span className="text-med-ink">{record.date}</span>
              </div>
              {record.institution && (
                <div>
                  <span className="text-xs text-med-muted block mb-1">Institución</span>
                  <span className="text-med-ink">{record.institution}</span>
                </div>
              )}
              {record.doctor && (
                <div>
                  <span className="text-xs text-med-muted block mb-1">Profesional</span>
                  <span className="text-med-ink">{record.doctor}</span>
                </div>
              )}
              {record.hasDocument && (
                <div>
                  <span className="text-xs text-med-muted block mb-1">Documento</span>
                  <span className="text-med-secondary">Adjunto</span>
                </div>
              )}
            </div>

            {record.description && (
              <div>
                <span className="text-xs text-med-muted block mb-1">Descripción</span>
                <p className="text-sm text-med-ink">{record.description}</p>
              </div>
            )}

            {record.notes && (
              <div>
                <span className="text-xs text-med-muted block mb-1">Notas adicionales</span>
                <p className="text-sm text-med-ink">{record.notes}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-med-secondary text-white text-sm font-semibold rounded-lg hover:bg-med-secondary-hover"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
