import { ValidationBadge } from "./validation-badge";

export function ClinicalSummary({ data }: {
  data: {
    allergies: string[];
    currentMedication: string[];
    relevantHistory: string[];
    lastHospitalizations: Array<{ date: string; reason: string; institution: string }>;
    importantSurgeries: Array<{ date: string; procedure: string; institution: string }>;
    pendingDocuments: string[];
    clinicalAlerts: string[];
  };
}) {
  return (
    <div className="bg-white border border-med-line rounded-[20px] shadow-[0_24px_60px_-28px_rgba(14,46,41,.45)] p-6 mb-8">
      <h2 className="font-fraunces text-[21px] font-medium mb-6">Resumen Clínico</h2>

      {/* Clinical Alerts */}
      {data.clinicalAlerts.length > 0 && (
        <div className="mb-6 p-4 bg-[rgba(224,101,76,.08)] border border-[rgba(224,101,76,.2)] rounded-lg">
          <h3 className="font-semibold text-sm text-med-coral mb-2 flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
              <path d="M12 9v4M12 17h.01" />
            </svg>
            Alertas Clínicas
          </h3>
          <ul className="space-y-1 text-sm text-med-ink">
            {data.clinicalAlerts.map((alert, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-med-coral">•</span>
                <span>{alert}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Allergies */}
      {data.allergies.length > 0 && (
        <div className="mb-6">
          <h3 className="text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold mb-2">Alergias Importantes</h3>
          <div className="flex flex-wrap gap-2">
            {data.allergies.map((allergy, i) => (
              <span key={i} className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-[999px] bg-[rgba(224,101,76,.13)] text-med-coral">
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Current Medication */}
      {data.currentMedication.length > 0 && (
        <div className="mb-6">
          <h3 className="text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold mb-2">Medicación Actual</h3>
          <ul className="space-y-1 text-sm text-med-ink">
            {data.currentMedication.map((med, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-med-secondary">•</span>
                <span>{med}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Relevant History */}
      {data.relevantHistory.length > 0 && (
        <div className="mb-6">
          <h3 className="text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold mb-2">Antecedentes Relevantes</h3>
          <ul className="space-y-1 text-sm text-med-ink">
            {data.relevantHistory.map((history, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-med-secondary">•</span>
                <span>{history}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Last Hospitalizations */}
      {data.lastHospitalizations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold mb-2">Últimas Internaciones</h3>
          <div className="space-y-2">
            {data.lastHospitalizations.map((hosp, i) => (
              <div key={i} className="text-sm text-med-ink">
                <span className="font-medium">{hosp.reason}</span>
                <span className="text-med-muted"> — {hosp.date} · {hosp.institution}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Important Surgeries */}
      {data.importantSurgeries.length > 0 && (
        <div className="mb-6">
          <h3 className="text-[11.5px] uppercase tracking-[0.08em] text-med-muted font-semibold mb-2">Cirugías Importantes</h3>
          <div className="space-y-2">
            {data.importantSurgeries.map((surgery, i) => (
              <div key={i} className="text-sm text-med-ink">
                <span className="font-medium">{surgery.procedure}</span>
                <span className="text-med-muted"> — {surgery.date} · {surgery.institution}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Documents */}
      {data.pendingDocuments.length > 0 && (
        <div className="p-4 bg-[rgba(214,154,46,.08)] border border-[rgba(214,154,46,.2)] rounded-lg">
          <h3 className="font-semibold text-sm text-med-amber mb-2 flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Documentos Pendientes de Validación
          </h3>
          <ul className="space-y-1 text-sm text-med-ink">
            {data.pendingDocuments.map((doc, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-med-amber">•</span>
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
